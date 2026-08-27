import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const labels = new Map<object, MockLabel>();

  class MockLabel {
    public string = "";
  }

  class MockNode {
    public getComponent(type: typeof MockLabel): MockLabel | null {
      return labels.get(this) instanceof type ? labels.get(this)! : null;
    }

    public addComponent(type: typeof MockLabel): MockLabel {
      const label = new type();
      labels.set(this, label);
      return label;
    }
  }

  return { MockLabel, MockNode };
});

vi.mock("cc", () => {
  class Component {
    public node = new mocks.MockNode();
  }

  return {
    _decorator: {
      ccclass: () => (target: unknown) => target,
      property: () => () => undefined,
    },
    Component,
    Label: mocks.MockLabel,
  };
});

import { GameBootstrap } from "../assets/scripts/bootstrap/GameBootstrap.js";

describe("GameBootstrap", () => {
  it("creates and uses a diagnostic Label when the scene does not inject one", async () => {
    const bootstrap = new GameBootstrap();

    await bootstrap.start();

    expect(bootstrap.diagnosticLabel).toBeInstanceOf(mocks.MockLabel);
    expect(bootstrap.diagnosticLabel?.string).toBe(
      "AURA / development / local",
    );
  });
});
