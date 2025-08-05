#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/run.ts
import { Argument, Command } from "commander";
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
import { slugify } from "@h3ravel/support";
import { unlink } from "fs/promises";
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
      this.location = join(process.cwd(), ".temp");
    }
  }
  async download(template, install = false, auth) {
    if (this.location?.includes(".temp")) {
      await rm(this.location, {
        force: true,
        recursive: true
      });
    }
    this.skipInstallation = !install;
    this.removeLockFile();
    return await downloadTemplate(template, {
      dir: this.location,
      auth,
      install,
      registry: await detectPackageManager() ?? "npm",
      forceClean: false
    });
  }
  async installPackage(name) {
    await installPackage(name, {
      cwd: this.location,
      silent: true
    });
  }
  async complete() {
    const packageManager = await detectPackageManager() ?? "npm";
    console.log("");
    console.log("Your h3ravel project has been created successfully!");
    console.log(chalk.cyan("cd " + relative(process.cwd(), this.location)));
    console.log(chalk.cyan(`${packageManager} run dev`));
    console.log(chalk.cyan("Open http://localhost:4444"));
    console.log("");
    console.log(`Have any questions?`);
    console.log(`Join our Discord server - ${chalk.yellow("https://discord.gg/hsG2A8PuGb")}`);
  }
  async cleanup() {
    const pkgPath = join(this.location, "package.json");
    const pkg = await readFile(pkgPath, "utf-8").then(JSON.parse);
    delete pkg.packageManager;
    pkg.name = slugify(this.appName ?? basename(this.location).replace(".", ""), "-");
    if (this.description) {
      pkg.description = this.description;
    }
    await Promise.allSettled([
      writeFile(pkgPath, JSON.stringify(pkg, null, 2)),
      this.removeLockFile(),
      rm(join(this.location, "pnpm-workspace.yaml"), {
        force: true
      }),
      rm(join(this.location, "README.md"), {
        force: true
      }),
      rm(join(this.location, ".github"), {
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
      unlink(join(this.location, "package-lock.json")),
      unlink(join(this.location, "yarn.lock")),
      unlink(join(this.location, "pnpm-lock.yaml"))
    ]);
  }
  async getBanner() {
    return await readFile(join(process.cwd(), "./logo.txt"), "utf-8");
  }
  async copyExampleEnv() {
    const envPath = join(this.location, ".env");
    const exampleEnvPath = join(this.location, ".env.example");
    if (existsSync(exampleEnvPath)) {
      await copyFile(exampleEnvPath, envPath);
    }
  }
};

// src/run.ts
import { basename as basename2, join as join2 } from "path";
import { slugify as slugify2 } from "@h3ravel/support";
var program = new Command();
program.name("create-h3ravel").description("CLI to create new h3ravel app").version("0.1.0");
program.option("-n, --name <string>", "The name of your project.").option("-i, --install", "Install node_modules right away.").option("-t, --token <string>", "Kit repo authentication token.").option("-d, --desc <string>", "Project Description.").option('-k, --kit <string>", "Starter template kit').addArgument(new Argument("[location]", "The location where this project should be created relative to the current dir.")).action(async (pathName, options) => {
  let { appName, description } = await inquirer.prompt([
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
  let { template, install, location, token } = await inquirer.prompt([
    {
      type: "input",
      name: "location",
      message: "Installation location relative to the current dir:",
      default: slugify2(options.name ?? appName ?? basename2(process.cwd()), "-"),
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
    console.log(chalk2.bgRed(" Error: "), chalk2.red(`The ${kit.name} kit is not currently available`));
    process.exit(1);
  }
  const actions = new actions_default(join2(process.cwd(), location), appName, description);
  const spinner = ora(`Loading Template...`).start();
  await actions.download(kit?.source ?? template, install);
  spinner.info(chalk2.green("Cleaning Up...")).start();
  await actions.cleanup();
  spinner.info(chalk2.green("Creating .env...")).start();
  await actions.copyExampleEnv();
  spinner.succeed(chalk2.green("Template Downloaded!"));
  await actions.complete();
});
program.parse();
//# sourceMappingURL=run.js.map