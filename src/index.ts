/**
 * TypeDoc plugin entrypoint to register plugin.
 */

import { PluginHost } from "typedoc/dist/lib/utils/plugins";
import { MissingCheckPlugin } from "./plugin";

/**
 * `load` is a required method to load typedoc plugins.
 *
 * @param host - Plugin manager host that registers this plugin being loaded.
 * @returns void
 */
export function load (host: PluginHost): void {
  new MissingCheckPlugin(host.application).init();
}
