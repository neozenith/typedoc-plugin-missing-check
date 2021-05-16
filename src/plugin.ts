import {
  Component,
  ConverterComponent
} from "typedoc/dist/lib/converter/components";
import { Context } from "typedoc/dist/lib/converter/context";
import { Reflection, ContainerReflection } from "typedoc/dist/lib/models";
import { Converter } from "typedoc";

@Component({ name: "missing-check" })
export class MissingCheckPlugin extends ConverterComponent {
  /**
   * Create a new MissingCheckPlugin instance.
   */
  initialize () {
    this.listenTo(this.owner, {
      [Converter.EVENT_RESOLVE]: this.onResolve,
      [Converter.EVENT_RESOLVE_END]: this.onResolveEnd
    });
  }

  /**
   * Triggered when the converter resolves a reflection.
   *
   * @param context  The context object describing the current state the converter is in.
   * @param reflection  The reflection that is currently resolved.
   */
  private onResolve (_context: Context, reflection: Reflection) {
    console.log("RESOLVE");
    if (reflection instanceof ContainerReflection) {
      console.log(reflection);
    }
  }

  /**
   * Triggered when the converter resolves a reflection.
   *
   * @param context  The context object describing the current state the converter is in.
   * @param reflection  The reflection that is currently resolved.
   */
  private onResolveEnd (_context: Context) {
    console.log("RESOLVE END");
  }
}
