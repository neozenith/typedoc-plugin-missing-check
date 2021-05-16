import { ParameterType, Application } from "typedoc";
import { PluginHost } from "typedoc/dist/lib/utils/plugins";
import { MissingCheckPlugin } from "./plugin";

/**
 * XXXXXXXX
 * @param host - Plugin manager host that registers this plugin being loaded.
 */
export function load (host: PluginHost) {
  const app: Application = host.application;

  app.options.addDeclaration({
    help: "[Missing Check Plugin] Option to disable missing check",
    name: "missing-check-disabled",
    type: ParameterType.Boolean,
    defaultValue: false
  });

  app.options.addDeclaration({
    help: "[Missing Check Plugin] Visibility level to validate. Can have values [\"public\",\"protected\",\"private\"]",
    name: "missing-check-level",
    type: ParameterType.String,
    defaultValue: "public"
  });

  app.converter.addComponent(
    "missing-check",
    new MissingCheckPlugin(app.converter)
  );
}
