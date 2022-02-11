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

  async register( byPass = false) {
    const all = this.args.all;
   if(!all && !byPass) return
    const serviceRegisterFilePath = `${this.projectPath}/utils/service_utils.dart`;
    let serviceRegister = await Deno.readTextFile(serviceRegisterFilePath);
    const matchLastModule = /(  static final (.*) = "(.*)";\n\})/;
    const matchLastRegistry = /(  Module\.(.*): (\w*),\n\};)/;
    const matchLastImport = /(import '.*';\n\n)/;
    
    const servicesDirPath = `${this.projectPath}/services`;

    for await (const dirEntry of Deno.readDir(servicesDirPath)) {
      if (dirEntry.isFile) {
        const fileName = dirEntry.name;
        let serviceName = fileName.split(".")[0].split("_").map((value, index) =>
          (index == 0) ? value : ld.capitalize(value)
        ).join("");
        
        //console.log(`TEST ${serviceName}`)

        if(!serviceRegister.includes(serviceName)){
          
          serviceName = this._splitServiceName(serviceName)
          const moduleName = this._getModuleName(serviceName)
          const instanceName = this._getInstanceName(serviceName)
          const fileName = this._getFileName(serviceName)
          if(serviceName.includes("free")) console.log("TESR "+serviceName+ " "+ moduleName+" "+instanceName +" "+serviceName.endsWith(" "))
          //console.log(`Matcher  ${serviceRegister.match(matchLastModule)?.at(1)}`)
          serviceRegister = serviceRegister.replace(matchLastModule, `  static final ${moduleName} = "${moduleName}";\n$1`)
          serviceRegister = serviceRegister.replace(matchLastRegistry, `  Module.${moduleName}: ${instanceName},\n$1`)
          serviceRegister = serviceRegister.replace(matchLastImport, `import 'package:solutech_sat/services/${fileName}';\n$1`)
        }
      }
    }
    await Deno.writeTextFile(serviceRegisterFilePath, serviceRegister)
    //console.log(serviceRegister)
    //console.log(serviceRegister.match(matchLastRegistry))
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
    serviceName = serviceName.trim()
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
    serviceName = serviceName.replaceAll(" ", "")
    serviceName = serviceName.replace(/./, (a: any)=> a.toLowerCase())
    return serviceName+"Service"
  }

  _getModuleName(serviceName: any){
    serviceName = serviceName?.trim()
    serviceName = ld.startCase(ld.toLower(serviceName))
    serviceName = serviceName.replaceAll(" ", "")
    serviceName = serviceName.replace(/./, (a: any)=> a.toLowerCase())
    return serviceName
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
    }

    serviceName = this._splitServiceName(serviceName)
    const fileName = this._getFileName(serviceName)
    const className = this._getClassName(serviceName)
    const instanceName = this._getInstanceName(serviceName)
    const { shouldCreate } = await ask.input({
      name: "shouldCreate",
      message: `Create service ${className}? (Y/N)`,
      type:"confirm"
    });
    
    if(shouldCreate?.toString().toLowerCase() != "y") {
      return
    }

    const template: string = await this._getFileTemplate(className, instanceName)
    await Deno.writeTextFile(`${this.projectPath}/services/${fileName}`, template)
    await this.register(true)
    console.log(" ")
    console.log("Created and Registered")
    console.log(`FileName: ${fileName}, Class: ${className}, Instance: ${instanceName}`)
  }

  init() {
    if (ld.first(this.args._) == "register" && this.args._.includes("services")) this.register();
    if (ld.first(this.args._) == "show" && (this.args._.includes("services") || this.args._.includes("manager"))) this.show();
    if (ld.first(this.args._) == "create" && this.args._.includes("service")) this.create();
  }
}
