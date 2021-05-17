import { PluginHost } from "typedoc/dist/lib/utils/plugins";
import { MissingCheckPlugin } from "./plugin";

/**
 * @param host - Plugin manager host that registers this plugin being loaded.
 * @returns void
 */
export function load (host: PluginHost): void {
  new MissingCheckPlugin().initialize(host.application);
}
