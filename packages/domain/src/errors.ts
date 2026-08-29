export type DomainErrorCode =
  | "INVALID_READING_INPUT"
  | "UNKNOWN_CARD_CONTENT"
  | "INVALID_DISCOVERY_STATE"
  | "INVALID_HISTORY_ENTRY"
  | "HISTORY_SESSION_CONFLICT"
  | "UNSUPPORTED_REPLAY_VERSION";

export type DomainErrorField =
  | "input"
  | "seed"
  | "sessionId"
  | "questionCategory"
  | "safetyDisposition"
  | "reversalsEnabled"
  | "createdAt"
  | "cardId"
  | "revealedAt"
  | "discovery"
  | "result"
  | "savedAt"
  | "history"
  | "themeRef"
  | "deckRef"
  | "version";

export interface SerializedDomainError {
  readonly code: DomainErrorCode;
  readonly field?: DomainErrorField;
}

const ERROR_MESSAGES: Record<DomainErrorCode, string> = {
  INVALID_READING_INPUT: "The reading input is invalid.",
  UNKNOWN_CARD_CONTENT: "The card content is unavailable.",
  INVALID_DISCOVERY_STATE: "The discovery state is invalid.",
  INVALID_HISTORY_ENTRY: "The history entry is invalid.",
  HISTORY_SESSION_CONFLICT: "The history session conflicts.",
  UNSUPPORTED_REPLAY_VERSION: "The replay version is unsupported.",
};

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly field?: DomainErrorField;

  constructor(code: DomainErrorCode, field?: DomainErrorField) {
    super(ERROR_MESSAGES[code]);
    Object.defineProperty(this, "name", {
      configurable: true,
      value: "DomainError",
    });
    this.code = code;
    if (field !== undefined) this.field = field;
  }

  toJSON(): SerializedDomainError {
    return this.field === undefined
      ? { code: this.code }
      : { code: this.code, field: this.field };
  }
}
