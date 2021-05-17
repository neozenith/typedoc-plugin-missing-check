/**
 * Missing Check plugin observes the conversion of Typescript Symbols to Reflections
 * and accumulates a list of Reflections that are missing comments.
 *
 * A list of all errors are emitted at the end of EVENT_RESOLVE_END.
 *
 * Plugin Template inspired by:
 * https://github.com/krisztianb/typedoc-plugin-base/blob/master/src/example_plugin.ts
 */
import { Context } from "typedoc/dist/lib/converter/context";
import { ReflectionKind } from "typedoc/dist/lib/models";
import { Converter, Application, ParameterType, BooleanDeclarationOption, StringDeclarationOption } from "typedoc";
import { LogLevel } from "typedoc/dist/lib/utils";

export class MissingCheckPlugin {
  /** A boolean option of this plugin. */
  protected disabledOption: BooleanDeclarationOption = {
    type: ParameterType.Boolean,
    name: "missing-check-disabled",
    help: "[Missing Check Plugin] Option to disable missing check",
    defaultValue: false
  };

  /** An enum option of this plugin. */
  protected missingCheckLevelOption: StringDeclarationOption = {
    type: ParameterType.String,
    name: "missing-check-level",
    help: "[Missing Check Plugin] Visibility level to validate. Can have values [\"public\",\"protected\",\"private\"]",
    defaultValue: "public"
  };

  /**
   * List of accumulated errors to spit out when resolving finishes.
   */
  private errors: any[] = [];

  /**
   * Create a new MissingCheckPlugin instance.
   */
  initialize (typedoc: Application) {
    this.addOptionsToApplication(typedoc);
    this.subscribeToApplicationEvents(typedoc);
  }

  /**
   * Register command line options this plugin supports for congifuration.
   *
   * @param typedoc The TypeDoc Application
   */
  protected addOptionsToApplication (typedoc: Application): void {
    typedoc.options.addDeclaration(this.disabledOption);
    typedoc.options.addDeclaration(this.missingCheckLevelOption);
  }

  /**
     * Subscribes to events of the application so the plugin can do its work in the particular doc generation phases.
     * @param typedoc The TypeDoc Application.
     */
  protected subscribeToApplicationEvents (typedoc: Application): void {
    // typedoc.converter.on(Converter.EVENT_BEGIN, (context: Context) => this.onConverterBegin(context));
    // typedoc.converter.on(Converter.EVENT_FILE_BEGIN, (context: Context) => this.onConverterFileBegin(context));
    // typedoc.converter.on(Converter.EVENT_CREATE_DECLARATION, (context: Context) => this.onConverterCreateDeclaration(context));
    // typedoc.converter.on(Converter.EVENT_CREATE_PARAMETER, (context: Context) => this.onConverterCreateParameter(context));
    // typedoc.converter.on(Converter.EVENT_CREATE_SIGNATURE, (context: Context) => this.onConverterCreateSignature(context));
    // typedoc.converter.on(Converter.EVENT_CREATE_TYPE_PARAMETER, (context: Context) => this.onConverterCreateTypeParameter(context));
    // typedoc.converter.on(Converter.EVENT_FUNCTION_IMPLEMENTATION, (context: Context) => this.onConverterFunctionImplementation(context));
    // typedoc.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context: Context) => this.onConverterResolveBegin(context));
    // typedoc.converter.on(Converter.EVENT_RESOLVE, (context: Context, reflection: Reflection) => this.onConverterResolve(context, reflection));
    typedoc.converter.on(Converter.EVENT_RESOLVE_END, (context: Context) => this.onConverterResolveEnd(context));
    // typedoc.converter.on(Converter.EVENT_END, (context: Context) => this.onConverterEnd(context));

    // typedoc.renderer.on(RendererEvent.BEGIN, (event: RendererEvent) => this.onRendererBegin(event));
    // typedoc.renderer.on(PageEvent.BEGIN, (event: PageEvent) => this.onRendererBeginPage(event));
    // typedoc.renderer.on(PageEvent.END, (event: PageEvent) => this.onRendererEndPage(event));
    // typedoc.renderer.on(RendererEvent.END, (event: RendererEvent) => this.onRendererEnd(event));
  }

  /**
   * Triggered when the converter finishes.
   *
   * @param context  The context object describing the current state the converter is in.
   */
  private onConverterResolveEnd (_context: Context) {
    console.log("RESOLVE END");
    const logger = _context.logger;
    for (const reflection of _context.project.getReflectionsByKind(ReflectionKind.All)) {
      const output: Record<string, any> = {
        kind: reflection.kindString,
        name: reflection.getFullName(),
        comment: reflection.comment,
        flags: reflection.flags
      };

      if (reflection.sources !== undefined) {
        output.location = reflection.sources.map(s => `${s.fileName}:${s.line}:${s.character}`);
      } else if (reflection.parent?.sources !== undefined) {
        output.location = reflection.parent?.sources.map(s => `${s.fileName}:${s.line}:${s.character}`);
      }
      const failureCondition = reflection.comment === undefined || (reflection.comment !== undefined && (reflection.comment.shortText.length + reflection.comment.text.length === 0));
      const level = (failureCondition) ? LogLevel.Warn : LogLevel.Verbose;

      // TODO: factor in Options to disable checks or filter by scope levels
      // TODO: resolve the scope level for each reflection type, may need to reach up to parent and extract from `flags`.

      logger.log("=========", level);
      logger.log(JSON.stringify(output), level);
      // console.log(reflection);
    }
  }
}
