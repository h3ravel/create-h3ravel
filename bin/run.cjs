#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/run.ts
var import_commander = require("commander");
var import_chalk2 = __toESM(require("chalk"), 1);
var import_inquirer = __toESM(require("inquirer"), 1);

// src/templates.ts
var templates = [
  {
    name: "Full Starter Kit",
    alias: "full",
    hint: "A full H3ravel application with everything possible",
    source: "github:h3ravel/h3ravel"
  },
  {
    name: "Lean Starter Kit",
    alias: "lean",
    hint: "A lean H3ravel application with just the framework core",
    source: null
  },
  {
    name: "API Starter Kit",
    alias: "api",
    hint: "Creates a H3ravel application for building JSON APIs",
    source: null
  },
  {
    name: "Web Starter Kit",
    alias: "web",
    hint: "Creates a H3ravel application for building a server rendered app",
    source: null
  },
  {
    name: "Inertia Starter Kit",
    alias: "inertia",
    hint: "Inertia application with a frontend framework of your choice",
    source: null
  }
];

// src/run.ts
var import_ora = __toESM(require("ora"), 1);

// src/actions.ts
var import_node_path = require("path");
var import_promises = require("fs/promises");
var import_install_pkg = require("@antfu/install-pkg");
var import_chalk = __toESM(require("chalk"), 1);
var import_giget = require("giget");
var import_node_fs = require("fs");
var import_support = require("@h3ravel/support");
var import_promises2 = require("fs/promises");
var actions_default = class {
  static {
    __name(this, "default");
  }
  location;
  appName;
  description;
  skipInstallation;
  constructor(location, appName, description) {
    this.location = location;
    this.appName = appName;
    this.description = description;
    if (!this.location) {
      this.location = (0, import_node_path.join)(process.cwd(), ".temp");
    }
  }
  async download(template, install = false, auth) {
    if (this.location?.includes(".temp")) {
      await (0, import_promises.rm)(this.location, {
        force: true,
        recursive: true
      });
    }
    this.skipInstallation = !install;
    this.removeLockFile();
    return await (0, import_giget.downloadTemplate)(template, {
      dir: this.location,
      auth,
      install,
      registry: await (0, import_install_pkg.detectPackageManager)() ?? "npm",
      forceClean: false
    });
  }
  async installPackage(name) {
    await (0, import_install_pkg.installPackage)(name, {
      cwd: this.location,
      silent: true
    });
  }
  async complete() {
    const packageManager = await (0, import_install_pkg.detectPackageManager)() ?? "npm";
    console.log("");
    console.log("Your h3ravel project has been created successfully!");
    console.log(import_chalk.default.cyan("cd " + (0, import_node_path.relative)(process.cwd(), this.location)));
    console.log(import_chalk.default.cyan(`${packageManager} run dev`));
    console.log(import_chalk.default.cyan("Open http://localhost:4444"));
    console.log("");
    console.log(`Have any questions?`);
    console.log(`Join our Discord server - ${import_chalk.default.yellow("https://discord.gg/hsG2A8PuGb")}`);
  }
  async cleanup() {
    const pkgPath = (0, import_node_path.join)(this.location, "package.json");
    const pkg = await (0, import_promises.readFile)(pkgPath, "utf-8").then(JSON.parse);
    delete pkg.packageManager;
    pkg.name = (0, import_support.slugify)(this.appName ?? (0, import_node_path.basename)(this.location).replace(".", ""), "-");
    if (this.description) {
      pkg.description = this.description;
    }
    await Promise.allSettled([
      (0, import_promises.writeFile)(pkgPath, JSON.stringify(pkg, null, 2)),
      this.removeLockFile(),
      (0, import_promises.rm)((0, import_node_path.join)(this.location, "pnpm-workspace.yaml"), {
        force: true
      }),
      (0, import_promises.rm)((0, import_node_path.join)(this.location, "README.md"), {
        force: true
      }),
      (0, import_promises.rm)((0, import_node_path.join)(this.location, ".github"), {
        force: true,
        recursive: true
      })
    ]);
  }
  async removeLockFile() {
    if (!this.skipInstallation) {
      return;
    }
    await Promise.allSettled([
      (0, import_promises2.unlink)((0, import_node_path.join)(this.location, "package-lock.json")),
      (0, import_promises2.unlink)((0, import_node_path.join)(this.location, "yarn.lock")),
      (0, import_promises2.unlink)((0, import_node_path.join)(this.location, "pnpm-lock.yaml"))
    ]);
  }
  async getBanner() {
    return await (0, import_promises.readFile)((0, import_node_path.join)(process.cwd(), "./logo.txt"), "utf-8");
  }
  async copyExampleEnv() {
    const envPath = (0, import_node_path.join)(this.location, ".env");
    const exampleEnvPath = (0, import_node_path.join)(this.location, ".env.example");
    if ((0, import_node_fs.existsSync)(exampleEnvPath)) {
      await (0, import_promises.copyFile)(exampleEnvPath, envPath);
    }
  }
};

// src/run.ts
var import_node_path2 = require("path");
var import_support2 = require("@h3ravel/support");
var program = new import_commander.Command();
program.name("create-h3ravel").description("CLI to create new h3ravel app").version("0.1.0");
program.option("-n, --name <string>", "The name of your project.").option("-i, --install", "Install node_modules right away.").option("-t, --token <string>", "Kit repo authentication token.").option("-d, --desc <string>", "Project Description.").option('-k, --kit <string>", "Starter template kit').addArgument(new import_commander.Argument("[location]", "The location where this project should be created relative to the current dir.")).action(async (pathName, options) => {
  let { appName, description } = await import_inquirer.default.prompt([
    {
      type: "input",
      name: "appName",
      message: "What is the name of your project:",
      default: "h3ravel",
      when: /* @__PURE__ */ __name(() => !options.name, "when")
    },
    {
      type: "input",
      name: "description",
      message: "Project Description:",
      when: /* @__PURE__ */ __name(() => !options.desc, "when")
    }
  ]);
  let { template, install, location, token } = await import_inquirer.default.prompt([
    {
      type: "input",
      name: "location",
      message: "Installation location relative to the current dir:",
      default: (0, import_support2.slugify)(options.name ?? appName ?? (0, import_node_path2.basename)(process.cwd()), "-"),
      when: /* @__PURE__ */ __name(() => !pathName, "when")
    },
    {
      type: "list",
      name: "template",
      message: "Choose starter template kit:",
      choices: templates.map((e) => ({
        name: e.name,
        value: e.alias,
        disabled: !e.source ? "(Unavailable at this time)" : false
      })),
      default: "full",
      when: /* @__PURE__ */ __name(() => !options.kit, "when")
    },
    {
      type: "input",
      name: "token",
      message: "Authentication token:",
      when: /* @__PURE__ */ __name(() => options.kit && !options.token, "when")
    },
    {
      type: "confirm",
      name: "install",
      message: "Would you want to install node_modules right away:",
      default: true,
      when: /* @__PURE__ */ __name(() => !options.install, "when")
    }
  ]);
  token = options.token ?? token;
  appName = options.name ?? appName;
  install = options.install ?? install;
  template = options.kit ?? template;
  location = pathName ?? location;
  description = options.description ?? description;
  const kit = templates.find((e) => e.alias === template);
  if (kit && !kit.source) {
    console.log(import_chalk2.default.bgRed(" Error: "), import_chalk2.default.red(`The ${kit.name} kit is not currently available`));
    process.exit(1);
  }
  const actions = new actions_default((0, import_node_path2.join)(process.cwd(), location), appName, description);
  const spinner = (0, import_ora.default)(`Loading Template...`).start();
  await actions.download(kit?.source ?? template, install);
  spinner.info(import_chalk2.default.green("Cleaning Up...")).start();
  await actions.cleanup();
  spinner.info(import_chalk2.default.green("Creating .env...")).start();
  await actions.copyExampleEnv();
  spinner.succeed(import_chalk2.default.green("Template Downloaded!"));
  await actions.complete();
});
program.parse();
//# sourceMappingURL=run.cjs.map