import { _decorator, Component, Label } from "cc";
import { DevelopmentPlatformBridge } from "../platform/DevelopmentPlatformBridge";

const { ccclass, property } = _decorator;

@ccclass("GameBootstrap")
export class GameBootstrap extends Component {
  @property(Label) public diagnosticLabel: Label | null = null;

  public async start(): Promise<void> {
    const diagnosticLabel = this.getOrCreateDiagnosticLabel();
    const bridge = new DevelopmentPlatformBridge({
      commit: "local",
      builtAt: "1970-01-01T00:00:00.000Z",
    });
    const build = await bridge.getBuildInfo();
    diagnosticLabel.string = `AURA / development / ${build.commit}`;
  }

  private getOrCreateDiagnosticLabel(): Label {
    const diagnosticLabel =
      this.diagnosticLabel ??
      this.node.getComponent(Label) ??
      this.node.addComponent(Label);

    this.diagnosticLabel = diagnosticLabel;
    return diagnosticLabel;
  }
}
