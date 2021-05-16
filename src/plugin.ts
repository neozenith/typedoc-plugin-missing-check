import {
  Component,
  ConverterComponent,
} from "typedoc/dist/lib/converter/components";
import { Context } from "typedoc/dist/lib/converter/context";
import { Reflection, ContainerReflection } from "typedoc/dist/lib/models";
import { Converter } from "typedoc";

@Component({ name: "missing-check" })
export class MissingCheckPlugin extends ConverterComponent {
  /**
   * Create a new MissingCheckPlugin instance.
   */
  initialize() {
    this.listenTo(this.owner, {
      [Converter.EVENT_RESOLVE]: this.onResolve,
    });
  }

  /**
   * Triggered when the converter resolves a reflection.
   *
   * @param context  The context object describing the current state the converter is in.
   * @param reflection  The reflection that is currently resolved.
   */
  private onResolve(_context: Context, reflection: Reflection) {
    console.log(reflection);
    if (reflection instanceof ContainerReflection) {
      console.log(reflection);
    }
  }
}
