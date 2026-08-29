import type { CardId, DiscoveryRecord } from "@aura/contracts";
import { describe, expect, it } from "vitest";
import { recordCardDiscovery } from "../src/discovery.js";
import { DomainError } from "../src/errors.js";

const CARD_ID = "major.fool" as CardId;
const OTHER_CARD_ID = "major.magician" as CardId;
const FIRST_SEEN_AT = "2026-08-28T00:00:00.000Z";
const LATER_REVEALED_AT = "2026-08-29T00:00:00.000Z";

function expectInvalidDiscoveryState(
  action: () => unknown,
  field: "cardId" | "revealedAt" | "discovery",
  sentinels: readonly string[],
): void {
  try {
    action();
    throw new Error("Expected invalid discovery state.");
  } catch (error) {
    expect(error).toBeInstanceOf(DomainError);

    const domainError = error as DomainError;
    expect(String(domainError)).toBe(
      "DomainError: The discovery state is invalid.",
    );
    expect(Object.keys(domainError)).toEqual(["code", "field"]);
    expect(JSON.stringify(domainError)).toBe(
      JSON.stringify({ code: "INVALID_DISCOVERY_STATE", field }),
    );
    expect("cause" in domainError).toBe(false);

    const publicEnvelope = JSON.stringify({
      text: String(domainError),
      json: JSON.stringify(domainError),
      enumerable: Object.entries(domainError),
    });
    for (const sentinel of sentinels) {
      expect(publicEnvelope).not.toContain(sentinel);
    }
  }
}

describe("recordCardDiscovery", () => {
  it("appends a canonical card discovery", () => {
    const records: readonly DiscoveryRecord[] = [];

    expect(recordCardDiscovery(records, CARD_ID, FIRST_SEEN_AT)).toEqual([
      { cardId: CARD_ID, firstSeenAt: FIRST_SEEN_AT },
    ]);
  });

  it("keeps the original first-seen time for a duplicate reveal", () => {
    const records: readonly DiscoveryRecord[] = [
      { cardId: CARD_ID, firstSeenAt: FIRST_SEEN_AT },
    ];

    const result = recordCardDiscovery(records, CARD_ID, LATER_REVEALED_AT);

    expect(result).toBe(records);
    expect(result).toEqual([{ cardId: CARD_ID, firstSeenAt: FIRST_SEEN_AT }]);
  });

  it("returns a new array without mutating an existing discovery list", () => {
    const existing = { cardId: CARD_ID, firstSeenAt: FIRST_SEEN_AT } as const;
    const records: readonly DiscoveryRecord[] = Object.freeze([existing]);

    const result = recordCardDiscovery(
      records,
      OTHER_CARD_ID,
      LATER_REVEALED_AT,
    );

    expect(result).not.toBe(records);
    expect(records).toEqual([existing]);
    expect(result).toEqual([
      existing,
      { cardId: OTHER_CARD_ID, firstSeenAt: LATER_REVEALED_AT },
    ]);
  });

  it("rejects an invalid reveal time without leaking it", () => {
    const invalidTime = "PRIVATE_INVALID_TIME_2026-99-99";

    expectInvalidDiscoveryState(
      () => recordCardDiscovery([], CARD_ID, invalidTime),
      "revealedAt",
      [CARD_ID, invalidTime],
    );
  });

  it("rejects a schema-valid card ID outside the current catalog", () => {
    const noncanonical = "major.not-in-catalog" as CardId;

    expectInvalidDiscoveryState(
      () => recordCardDiscovery([], noncanonical, FIRST_SEEN_AT),
      "cardId",
      [noncanonical, FIRST_SEEN_AT],
    );
  });

  it("rejects every existing record with unknown data without leaking it", () => {
    const privateRecordData = "PRIVATE_EXISTING_RECORD_DATA";
    const records = [
      {
        cardId: CARD_ID,
        firstSeenAt: FIRST_SEEN_AT,
        privateRecordData,
      },
    ] as unknown as readonly DiscoveryRecord[];

    expectInvalidDiscoveryState(
      () => recordCardDiscovery(records, OTHER_CARD_ID, LATER_REVEALED_AT),
      "discovery",
      [
        CARD_ID,
        FIRST_SEEN_AT,
        privateRecordData,
        OTHER_CARD_ID,
        LATER_REVEALED_AT,
      ],
    );
  });

  it("rejects duplicate existing card IDs instead of repairing them", () => {
    const records: readonly DiscoveryRecord[] = [
      { cardId: CARD_ID, firstSeenAt: FIRST_SEEN_AT },
      { cardId: CARD_ID, firstSeenAt: LATER_REVEALED_AT },
    ];

    expectInvalidDiscoveryState(
      () => recordCardDiscovery(records, OTHER_CARD_ID, FIRST_SEEN_AT),
      "discovery",
      [CARD_ID, FIRST_SEEN_AT, LATER_REVEALED_AT, OTHER_CARD_ID],
    );
  });

  it("rejects invalid existing records instead of repairing them", () => {
    const invalidExistingTime = "PRIVATE_EXISTING_TIME_2026-99-99";
    const records = [
      { cardId: CARD_ID, firstSeenAt: invalidExistingTime },
    ] as unknown as readonly DiscoveryRecord[];

    expectInvalidDiscoveryState(
      () => recordCardDiscovery(records, OTHER_CARD_ID, LATER_REVEALED_AT),
      "discovery",
      [CARD_ID, invalidExistingTime, OTHER_CARD_ID, LATER_REVEALED_AT],
    );
  });

  it("prioritizes invalid persisted state over an invalid incoming card ID", () => {
    const invalidExistingTime = "PRIVATE_EXISTING_TIME_2026-99-99";
    const invalidIncomingCardId = "PRIVATE_INCOMING_CARD_ID" as CardId;
    const records = [
      { cardId: CARD_ID, firstSeenAt: invalidExistingTime },
    ] as unknown as readonly DiscoveryRecord[];

    expectInvalidDiscoveryState(
      () => recordCardDiscovery(records, invalidIncomingCardId, FIRST_SEEN_AT),
      "discovery",
      [CARD_ID, invalidExistingTime, invalidIncomingCardId, FIRST_SEEN_AT],
    );
  });

  it("prioritizes invalid persisted state over an invalid incoming time", () => {
    const invalidExistingTime = "PRIVATE_EXISTING_TIME_2026-99-99";
    const invalidIncomingTime = "PRIVATE_INCOMING_TIME_2026-99-99";
    const records = [
      { cardId: CARD_ID, firstSeenAt: invalidExistingTime },
    ] as unknown as readonly DiscoveryRecord[];

    expectInvalidDiscoveryState(
      () => recordCardDiscovery(records, CARD_ID, invalidIncomingTime),
      "discovery",
      [CARD_ID, invalidExistingTime, invalidIncomingTime],
    );
  });

  it("rejects existing schema-valid card IDs outside the current catalog", () => {
    const noncanonical = "major.not-in-catalog" as CardId;
    const records: readonly DiscoveryRecord[] = [
      { cardId: noncanonical, firstSeenAt: FIRST_SEEN_AT },
    ];

    expectInvalidDiscoveryState(
      () => recordCardDiscovery(records, OTHER_CARD_ID, LATER_REVEALED_AT),
      "discovery",
      [noncanonical, FIRST_SEEN_AT, OTHER_CARD_ID, LATER_REVEALED_AT],
    );
  });

  it("contains hostile record accessors and redacts their details", () => {
    const privateRecordData = "PRIVATE_HOSTILE_RECORD_DATA";
    const hostile = new Proxy(
      { cardId: CARD_ID, firstSeenAt: FIRST_SEEN_AT },
      {
        get(target, property, receiver) {
          if (property === "cardId") {
            throw new Error(privateRecordData);
          }
          return Reflect.get(target, property, receiver);
        },
      },
    ) as unknown as DiscoveryRecord;

    expectInvalidDiscoveryState(
      () => recordCardDiscovery([hostile], OTHER_CARD_ID, LATER_REVEALED_AT),
      "discovery",
      [
        CARD_ID,
        FIRST_SEEN_AT,
        privateRecordData,
        OTHER_CARD_ID,
        LATER_REVEALED_AT,
      ],
    );
  });
});
