#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/run.ts
import { Command } from "commander";
import chalk2 from "chalk";
import inquirer from "inquirer";

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
import ora from "ora";

// src/actions.ts
import { basename, join, relative } from "path";
import { copyFile, readFile, rm, writeFile } from "fs/promises";
import { detectPackageManager, installPackage } from "@antfu/install-pkg";
import chalk from "chalk";
import { downloadTemplate } from "giget";
import { existsSync } from "fs";
import { unlink } from "fs/promises";
var actions_default = class {
  static {
    __name(this, "default");
  }
  destination;
  constructor(destination) {
    this.destination = destination;
    if (!this.destination) {
      this.destination = join(process.cwd(), ".temp");
    }
  }
  async download(template, install = false, auth) {
    if (this.destination?.includes(".temp")) {
      await rm(this.destination, {
        force: true,
        recursive: true
      });
    }
    return await downloadTemplate(template, {
      dir: this.destination,
      auth,
      install,
      registry: false,
      forceClean: true
    });
  }
  async install() {
    await installPackage("@h3ravel/core", {
      cwd: this.destination,
      silent: true
    });
  }
  async complete() {
    const packageManager = await detectPackageManager() ?? "npm";
    console.log("");
    console.log("Your h3ravel project has been created successfully!");
    console.log(chalk.cyan("cd " + relative(process.cwd(), this.destination)));
    console.log(chalk.cyan(`${packageManager} run dev`));
    console.log(chalk.cyan("Open http://localhost:4444"));
    console.log("");
    console.log(`Have any questions?`);
    console.log(`Join our Discord server - ${chalk.yellow("https://discord.gg/hsG2A8PuGb")}`);
  }
  async cleanup() {
    const pkgPath = join(this.destination, "package.json");
    const pkg = await readFile(pkgPath, "utf-8").then(JSON.parse);
    delete pkg.packageManager;
    pkg.name = basename(this.destination).replace(".", "");
    await Promise.allSettled([
      writeFile(pkgPath, JSON.stringify(pkg, null, 2)),
      unlink(join(this.destination, "package-lock.json")),
      unlink(join(this.destination, "yarn.lock")),
      unlink(join(this.destination, "pnpm-lock.yaml")),
      rm(join(this.destination, "pnpm-workspace.yaml"), {
        force: true
      }),
      rm(join(this.destination, "README.md"), {
        force: true
      }),
      rm(join(this.destination, ".github"), {
        force: true,
        recursive: true
      })
    ]);
  }
  async getBanner() {
    return await readFile(join(process.cwd(), "./logo.txt"), "utf-8");
  }
  async copyExampleEnv() {
    const envPath = join(this.destination, ".env");
    const exampleEnvPath = join(this.destination, ".env.example");
    if (existsSync(exampleEnvPath)) {
      await copyFile(exampleEnvPath, envPath);
    }
  }
};

// src/run.ts
import { join as join2 } from "path";
var program = new Command();
program.name("create-h3ravel").description("CLI to create new h3ravel app").version("0.1.0");
program.option("-n, --name <type>", "Add your name").action(async (options) => {
  console.log(options);
  const { appName, template, install } = await inquirer.prompt([
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
  const actions = new actions_default(join2(process.cwd(), String(appName).toLowerCase().replaceAll(" ", "-")));
  const spinner = ora(`Loading Template...`).start();
  await actions.download(templates.find((e) => e.alias === template)?.source, install);
  spinner.info(chalk2.green("Cleaning Up...")).start();
  await actions.cleanup();
  spinner.info(chalk2.green("Creating .env...")).start();
  await actions.copyExampleEnv();
  spinner.succeed(chalk2.green("Template Downloaded!"));
  await actions.complete();
});
program.parse();
//# sourceMappingURL=run.js.map