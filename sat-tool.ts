import { parse } from "https://deno.land/std/flags/mod.ts";
import { LocalStorage } from "https://deno.land/x/storage@0.0.5/mod.ts"
import {  ServiceUtil } from "./utils/service_util.ts";

const args = parse(Deno.args);
const storage = new LocalStorage<string>();
const providedPath = args.path ?? storage.get("path") ?? ".";
const projectPath = `${providedPath}/lib`

storage.set("path", providedPath)
storage.save()


new ServiceUtil(args, projectPath);