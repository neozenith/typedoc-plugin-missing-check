/**
 * Missing Check plugin observes the conversion of Typescript Symbols to Reflections
 * and accumulates a list of Reflections that are missing comments.
 *
 * A list of all errors are emitted at the end of EVENT_RESOLVE_END.
 *
 * Plugin Template inspired by:
 * https://github.com/krisztianb/typedoc-plugin-base/blob/master/src/example_plugin.ts
 *
 * @module
 */

import { Context } from "typedoc/dist/lib/converter/context";
import { Reflection, ReflectionFlags, ReflectionKind } from "typedoc/dist/lib/models";
import { Converter, Application, ParameterType, BooleanDeclarationOption, StringDeclarationOption } from "typedoc";
import { LogLevel } from "typedoc/dist/lib/utils";

/**
 * MissingCheckPlugin checks resolved symbols in the Converter for adequate documentation.
 */
export class MissingCheckPlugin {
  /** Enable/disable this plugin. */
  protected disabledOption: BooleanDeclarationOption = {
    type: ParameterType.Boolean,
    name: "missing-check-disabled",
    help: "[Missing Check Plugin] Option to disable missing check",
    defaultValue: false
  };

  /** Enable/disable verbose error messages. */
  protected verboseOption: BooleanDeclarationOption = {
    type: ParameterType.Boolean,
    name: "missing-check-verbose",
    help: "[Missing Check Plugin] Option to enable more verbose error messages.",
    defaultValue: false
  };

  /** Scope level to run check across. */
  protected missingCheckLevelOption: StringDeclarationOption = {
    type: ParameterType.String,
    name: "missing-check-level",
    help: "[Missing Check Plugin] Visibility level to validate. Can have values [\"public\",\"protected\",\"private\"]",
    defaultValue: "public"
  };

  private typedoc: Application;

  /**
   * Instantiate new MissingCheckPlugin.
   *
   * @param typedoc - Core TypeDoc Application processing
   */
  public constructor (typedoc: Application) {
    this.typedoc = typedoc;
  }

  /**
   * Initialise functionality of plugin by registering options and listeners.
   */
  public init (): void {
    this.addOptionsToApplication(this.typedoc);
    this.subscribeToApplicationEvents(this.typedoc);
  }

  /**
   * Register command line options this plugin supports for congifuration.
   *
   * @param typedoc The TypeDoc Application
   */
  private addOptionsToApplication (typedoc: Application): void {
    typedoc.options.addDeclaration(this.disabledOption);
    typedoc.options.addDeclaration(this.verboseOption);
    typedoc.options.addDeclaration(this.missingCheckLevelOption);
  }

  /**
     * Subscribes to events of the application so the plugin can do its work in the particular doc generation phases.
     * @param typedoc The TypeDoc Application.
     */
  private subscribeToApplicationEvents (typedoc: Application): void {
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
    const options = _context.converter.owner.application.options;
    const disabled = options.getValue(this.disabledOption.name);
    const verbose = options.getValue(this.verboseOption.name) as boolean;
    const scopeLevel = options.getValue(this.missingCheckLevelOption.name) as string;

    const logger = _context.logger;
    if (disabled) {
      logger.log("Missing Check plugin disabled");
      return;
    }

    let failureCount = 0;

    for (const reflection of _context.project.getReflectionsByKind(ReflectionKind.All)) {
      if (this.checkReflection(reflection, _context, scopeLevel, verbose)) {
        failureCount += 1;
      }
    }

    if (failureCount) {
      let message = `Found ${failureCount} errors when checking for missing documentation.`;
      if (!verbose) message += "Consider using --missing-check-verbose for more detailed output";

      logger.error(message);
    }
  }

  private checkReflection (reflection: Reflection, _context: Context, scopeLevel: string, verbose: boolean): boolean {
    const logger = _context.logger;

    const ignorable: string[] = [
      "Project::Class::Constructor",
      "Project::Class::Property",
      "Project::Class::Method"
    ]; // Load ignorable list from Options??

    // TODO: Get these checks working...
    const shouldNotBeIgnorableButUnhandledForNow: string[] = [
      "Project::Class::Constructor::Constructor signature::Parameter",
      "Project::Class::Constructor::Constructor signature",
      "Module::Class::Constructor",
      "Module::Class::Method",
      "Module::Function"
    ];

    const thisKindChain = this.kindChainNames(reflection).join("::");

    if (thisKindChain.includes("Type literal") || thisKindChain.includes("Type alias")) return false;
    if (ignorable.includes(thisKindChain)) return false;
    if (shouldNotBeIgnorableButUnhandledForNow.includes(thisKindChain)) return false;

    const reflectionObj: Record<string, any> = {
      kind: reflection.kindString,
      kindChain: thisKindChain,
      name: reflection.name,
      fullname: reflection.getFullName(),
      comment: reflection.comment,
      flags: reflection.flags
    };

    if (reflection.sources !== undefined) {
      reflectionObj.location = reflection.sources.map(s => `${s.fileName}:${s.line}:${s.character}`);
    } else if (reflection.parent?.sources !== undefined) {
      reflectionObj.location = reflection.parent?.sources.map(s => `${s.fileName}:${s.line}:${s.character}`);
    }

    let flags = reflection.flags;
    if (reflection.kindOf(ReflectionKind.CallSignature) && reflection.parent) {
      flags = reflection.parent.flags;
    } else if (reflection.kindOf(ReflectionKind.Parameter) && reflection.parent && reflection.parent.parent) {
      flags = reflection.parent.parent.flags;
    }

    if (this.shouldCheck(scopeLevel, flags)) {
      let failureCondition = false;

      if (reflection.comment === undefined) {
        reflectionObj.reason = `Documentation comment missing for ${reflectionObj.kind} named '${reflectionObj.name}'.`;

        if (reflection.kindOf(ReflectionKind.Module)) reflectionObj.reason += " You may need to add a @module tag. http://typedoc.org/guides/doccomments/#files";

        failureCondition = true;
      } else if (reflection.comment !== undefined && (reflection.comment.shortText.length + reflection.comment.text.length === 0)) {
        reflectionObj.reason = `Documentation comment empty for ${reflectionObj.kind} named ${reflectionObj.name}`;
        failureCondition = true;
      }

      if (reflectionObj?.reason && verbose) reflectionObj.reason += JSON.stringify(reflectionObj, null, 2);

      if (failureCondition) logger.log(this.format(reflectionObj), LogLevel.Error);

      return failureCondition;
    } else {
      return false;
    }
  }

  private shouldCheck (scopeLevel: string, flags: ReflectionFlags) {
    const publicLevel = (!flags.isProtected && !flags.isPrivate);
    const protectedLevel = !flags.isPrivate;
    const privateLevel = true;

    return (scopeLevel === "public" && publicLevel) ||
    (scopeLevel === "protected" && protectedLevel) ||
    (scopeLevel === "private" && privateLevel);
  }

  private kindChain (reflection: Reflection): Array<ReflectionKind> {
    const output: Array<ReflectionKind> = [];
    let currentReflection: Reflection | undefined = reflection;
    while (currentReflection && currentReflection.kind) {
      output.push(currentReflection.kind);
      currentReflection = currentReflection.parent ?? undefined;
    }
    return output.reverse();
  }

  private kindChainNames (reflection: Reflection): Array<String | undefined> {
    const output: Array<String | undefined> = [];
    let currentReflection: Reflection | undefined = reflection;
    while (currentReflection && currentReflection.kindString) {
      output.push(currentReflection.kindString);
      currentReflection = currentReflection.parent ?? undefined;
    }
    return output.reverse();
  }

  private format (reflectionObj: Record<string, any>): string {
    return `(missing-check) ${reflectionObj.location} ${reflectionObj.reason ?? reflectionObj.kind} ${JSON.stringify(reflectionObj.comment)}`;
  }
}
