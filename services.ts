import { Args } from "https://deno.land/std/flags/mod.ts";
import { ld } from "https://deno.land/x/deno_lodash/mod.ts";
import * as ink from 'https://deno.land/x/ink/mod.ts'


export class ServiceUtil {
  args: Args;
  projectPath: string;

  constructor(args: Args, projectPath: string) {
    this.args = args;
    this.projectPath = projectPath;
    this.init();
  }

  register() {
  }

  async show() {
    const unregistered = this.args._.includes("unregistered");
    const isSummary = this.args._.includes("summary");
    const isManager = this.args._.includes("manager");
    const results = [];
    const servicesDirPath = `${this.projectPath}/${
      isManager ? "helpers" : "services"
    }`;
    const serviceUtilFilePath = `${this.projectPath}/utils/service_utils.dart`;
    for await (const dirEntry of Deno.readDir(servicesDirPath)) {
      if (dirEntry.isFile) {
        const fileName = dirEntry.name;
        const manager = fileName.split(".")[0].split("_").map((value, index) =>
          (index == 0) ? value : ld.capitalize(value)
        ).join("");
        const serviceUtilContents = await Deno.readTextFile(
          serviceUtilFilePath,
        );
        const result = {
          [isManager ? "Manager" : "Service"]: manager,
          "Registered": serviceUtilContents.includes(manager) ? "YES" : "NO",
        };
        results.push(result);
      }
    }

    if (!isSummary) {
      const unregisteredResults = results.filter((result) =>
        result.Registered == "NO"
      );
      console.table(unregistered ? unregisteredResults : results, [
        isManager ? "Manager" : "Service",
        "Registered",
      ]);
    }

    const counts = {
      "REGISTERED":
        results.filter((result) => result.Registered == "YES").length,
      "NOT REGISTERED":
        results.filter((result) => result.Registered == "NO").length,
    };

    console.table(
      [counts],
      unregistered ? ["NOT REGISTERED"] : ["REGISTERED", "NOT REGISTERED"],
    );
  }

  create() {
  }

  init() {
    if (this.args._.includes("services") || this.args._.includes("manager")) {
      return;
    }
    if (ld.first(this.args._) == "register") this.register();
    if (ld.first(this.args._) == "show") this.show();
    if (ld.first(this.args._) == "create") this.create();
  }
}
