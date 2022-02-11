import { Args } from "https://deno.land/std/flags/mod.ts";
import { ld } from "https://deno.land/x/deno_lodash/mod.ts";
import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";


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

  _splitServiceName(serviceName: any){
    serviceName = serviceName?.replace( /([A-Z_])/g, " $1" );
    serviceName = serviceName?.toLowerCase()
    serviceName = serviceName?.endsWith("service")? serviceName.replace(new RegExp("service" + '$'), ""): serviceName
    serviceName = serviceName?.replace( /_/g, "" );
    return serviceName
  }

  _getFileName(serviceName: any){
    serviceName = serviceName?.trim()
    serviceName = `${serviceName?.split(" ").join("_")}_service.dart`
    return serviceName
  }

  _getClassName(serviceName: any){
    serviceName = serviceName?.trim()
    serviceName = ld.startCase(ld.toLower(serviceName))
    serviceName = serviceName.replace(" ", "")
    return serviceName+"Service"
  }

  _getInstanceName(serviceName: any){
    serviceName = serviceName?.trim()
    serviceName = ld.startCase(ld.toLower(serviceName))
    serviceName = serviceName.replace(" ", "")
    serviceName = serviceName.replace(/./, (a: any)=> a.toLowerCase())
    return serviceName+"Service"
  }


  async _getFileTemplate(className: string, instanceName: string): Promise<string> {
    let template: string = await Deno.readTextFile("./templates/service")
    template = template.replaceAll("_$Service", className).replaceAll("_$$Service", instanceName)
    return template;
  }

  async create() {
    const serviceIndex = this.args._.indexOf("service");
    if(serviceIndex == -1) return;
    const ask = new Ask();
    let serviceName: any = ""

    if (this.args._.length < 3 ){
      serviceName = await prompt('Enter service name: ');
    } else {
      serviceName = this.args._[2].toString();
      const { shouldCreate } = await ask.input({
        name: "shouldCreate",
        message: `Create service ${serviceName}? (Y/N)`,
        type:"confirm"
      });
      
      if(shouldCreate?.toString().toLowerCase() != "y") {
        return
      }
    }

    serviceName = this._splitServiceName(serviceName)
    const fileName = this._getFileName(serviceName)
    const className = this._getClassName(serviceName)
    const instanceName = this._getInstanceName(serviceName)
    const template: string = await this._getFileTemplate(className, instanceName)
    await Deno.writeTextFile(`${this.projectPath}/services/${fileName}`, template)
    console.log(`FileName: ${fileName}, Class: ${className}, Instance: ${instanceName}`)
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
