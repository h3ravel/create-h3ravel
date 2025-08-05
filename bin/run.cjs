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
var import_promises2 = require("fs/promises");
var actions_default = class {
  static {
    __name(this, "default");
  }
  destination;
  constructor(destination) {
    this.destination = destination;
    if (!this.destination) {
      this.destination = (0, import_node_path.join)(process.cwd(), ".temp");
    }
  }
  async download(template, install = false, auth) {
    if (this.destination?.includes(".temp")) {
      await (0, import_promises.rm)(this.destination, {
        force: true,
        recursive: true
      });
    }
    return await (0, import_giget.downloadTemplate)(template, {
      dir: this.destination,
      auth,
      install,
      registry: false,
      forceClean: true
    });
  }
  async install() {
    await (0, import_install_pkg.installPackage)("@h3ravel/core", {
      cwd: this.destination,
      silent: true
    });
  }
  async complete() {
    const packageManager = await (0, import_install_pkg.detectPackageManager)() ?? "npm";
    console.log("");
    console.log("Your h3ravel project has been created successfully!");
    console.log(import_chalk.default.cyan("cd " + (0, import_node_path.relative)(process.cwd(), this.destination)));
    console.log(import_chalk.default.cyan(`${packageManager} run dev`));
    console.log(import_chalk.default.cyan("Open http://localhost:4444"));
    console.log("");
    console.log(`Have any questions?`);
    console.log(`Join our Discord server - ${import_chalk.default.yellow("https://discord.gg/hsG2A8PuGb")}`);
  }
  async cleanup() {
    const pkgPath = (0, import_node_path.join)(this.destination, "package.json");
    const pkg = await (0, import_promises.readFile)(pkgPath, "utf-8").then(JSON.parse);
    delete pkg.packageManager;
    pkg.name = (0, import_node_path.basename)(this.destination).replace(".", "");
    await Promise.allSettled([
      (0, import_promises.writeFile)(pkgPath, JSON.stringify(pkg, null, 2)),
      (0, import_promises2.unlink)((0, import_node_path.join)(this.destination, "package-lock.json")),
      (0, import_promises2.unlink)((0, import_node_path.join)(this.destination, "yarn.lock")),
      (0, import_promises2.unlink)((0, import_node_path.join)(this.destination, "pnpm-lock.yaml")),
      (0, import_promises.rm)((0, import_node_path.join)(this.destination, "pnpm-workspace.yaml"), {
        force: true
      }),
      (0, import_promises.rm)((0, import_node_path.join)(this.destination, "README.md"), {
        force: true
      }),
      (0, import_promises.rm)((0, import_node_path.join)(this.destination, ".github"), {
        force: true,
        recursive: true
      })
    ]);
  }
  async getBanner() {
    return await (0, import_promises.readFile)((0, import_node_path.join)(process.cwd(), "./logo.txt"), "utf-8");
  }
  async copyExampleEnv() {
    const envPath = (0, import_node_path.join)(this.destination, ".env");
    const exampleEnvPath = (0, import_node_path.join)(this.destination, ".env.example");
    if ((0, import_node_fs.existsSync)(exampleEnvPath)) {
      await (0, import_promises.copyFile)(exampleEnvPath, envPath);
    }
  }
};

// src/run.ts
var import_node_path2 = require("path");
var program = new import_commander.Command();
program.name("create-h3ravel").description("CLI to create new h3ravel app").version("0.1.0");
program.option("-n, --name <type>", "Add your name").action(async (options) => {
  console.log(options);
  const { appName, template, install } = await import_inquirer.default.prompt([
    {
      type: "input",
      name: "appName",
      message: "What is the name of your project?",
      default: "h3ravel"
    },
    {
      type: "list",
      name: "template",
      message: "Select starter template",
      choices: templates.map((e) => ({
        name: e.name,
        value: e.alias,
        disabled: !e.source ? "(Unavailable at this time)" : false
      }))
    },
    {
      type: "confirm",
      name: "install",
      message: "Would you want to install node_modules right away?",
      default: true
    }
  ]);
  const actions = new actions_default((0, import_node_path2.join)(process.cwd(), String(appName).toLowerCase().replaceAll(" ", "-")));
  const spinner = (0, import_ora.default)(`Loading Template...`).start();
  await actions.download(templates.find((e) => e.alias === template)?.source, install);
  spinner.info(import_chalk2.default.green("Cleaning Up...")).start();
  await actions.cleanup();
  spinner.info(import_chalk2.default.green("Creating .env...")).start();
  await actions.copyExampleEnv();
  spinner.succeed(import_chalk2.default.green("Template Downloaded!"));
  await actions.complete();
});
program.parse();
//# sourceMappingURL=run.cjs.map