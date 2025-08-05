#!/usr/bin/env node

import { Argument, Command } from 'commander';
import chalk from 'chalk';
import inquirer from "inquirer";
import { templates } from './templates';
import ora from 'ora';
import Actions from './actions';
import { basename, join } from 'node:path';

const program = new Command();

program
    .name('create-h3ravel')
    .description('CLI to create new h3ravel app')
    .version('0.1.0');

program
    .option("-n, --name <string>", "The name of your project.")
    .option('-i, --install', 'Install node_modules right away.')
    .option('-t, --token <string>', 'Kit repo authentication token.')
    .option('-d, --desc <string>', 'Project Description.')
    .option('-k, --kit <string>", "Starter template kit')
    .addArgument(new Argument('[location]', 'The location where this project should be created relative to the current dir.'))
    .action(async (pathName, options) => {

        let { appName, template, install, location, token, description } = await inquirer
            .prompt([
                {
                    type: "input",
                    name: "appName",
                    message: "What is the name of your project:",
                    default: 'h3ravel',
                    when: () => !options.name,
                },
                {
                    type: "input",
                    name: "description",
                    message: "Project Description:",
                    when: () => !options.desc,
                },
                {
                    type: "input",
                    name: "location",
                    message: "Installation location relative to the current dir:",
                    default: basename(process.cwd()),
                    when: () => !pathName,
                },
                {
                    type: "list",
                    name: "template",
                    message: "Choose starter template kit:",
                    choices: <never>templates.map(e => ({
                        name: e.name,
                        value: e.alias,
                        disabled: !e.source ? '(Unavailable at this time)' : false,
                    })),
                    default: 'full',
                    when: () => !options.kit,
                },
                {
                    type: "input",
                    name: "token",
                    message: "Authentication token:",
                    when: () => options.kit && !options.token,
                },
                {
                    type: 'confirm',
                    name: "install",
                    message: "Would you want to install node_modules right away:",
                    default: true,
                    when: () => !options.install,
                },
            ])

        token = options.token ?? token
        appName = options.name ?? appName
        install = options.install ?? install
        template = options.kit ?? template
        location = pathName ?? location
        description = options.description ?? description

        const kit = templates.find(e => e.alias === template)!

        if (kit && !kit.source) {
            console.log(chalk.bgRed(' Error: '), chalk.red(`The ${kit.name} kit is not currently available`))
            process.exit(1)
        }

        const actions = new Actions(join(process.cwd(), location), appName, description);

        const spinner = ora(`Loading Template...`).start();
        await actions.download(kit?.source ?? template, install);

        spinner.info(chalk.green("Cleaning Up...")).start();
        await actions.cleanup()

        spinner.info(chalk.green("Creating .env...")).start();
        await actions.copyExampleEnv()

        spinner.succeed(chalk.green('Template Downloaded!'))

        await actions.complete()
    });

program.parse();
