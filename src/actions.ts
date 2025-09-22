import { baseTsconfig, mainTsconfig } from "./tsconfig";
import { basename, join, relative } from "node:path";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { detectPackageManager, installPackage } from "@antfu/install-pkg";

import { Logger } from "@h3ravel/shared";
import { downloadTemplate } from "giget";
import { existsSync } from "node:fs";
import { slugify } from "@h3ravel/support";
import { unlink } from "node:fs/promises";

export default class {
    skipInstallation?: boolean

    constructor(private location?: string, private appName?: string, private description?: string) {
        if (!this.location) {
            this.location = join(process.cwd(), '.temp')
        }
    }

    async download (template: string, install = false, auth?: string) {
        if (this.location?.includes('.temp')) {
            await rm(this.location!, { force: true, recursive: true })
        }

        this.skipInstallation = !install
        this.removeLockFile()

        return await downloadTemplate(template, {
            dir: this.location,
            auth,
            install,
            registry: (await detectPackageManager()) ?? 'npm',
            forceClean: false
        });
    }

    async installPackage (name: string) {
        await installPackage(name, {
            cwd: this.location,
            silent: true,
        })
    }

    async complete () {
        const packageManager = (await detectPackageManager()) ?? 'npm'

        console.log('')

        Logger.success('Your h3ravel project has been created successfully')
        Logger.parse([['cd ' + relative(process.cwd(), this.location!), 'cyan']])
        Logger.parse([[`${packageManager} run dev`, 'cyan']])
        Logger.parse([['Open http://localhost:4444', 'cyan']])

        console.log('')

        Logger.parse([['Have any questions', 'white']])
        Logger.parse([['Join our Discord server -', 'white'], ['https://discord.gg/hsG2A8PuGb', 'yellow']])
        Logger.parse([['Checkout the documentation -', 'white'], ['https://h3ravel.toneflix.net', 'yellow']])
    }

    async cleanup () {
        const pkgPath = join(this.location!, 'package.json')
        const pkg = await readFile(pkgPath!, 'utf-8').then(JSON.parse)

        delete pkg.packageManager
        pkg.name = slugify(this.appName ?? basename(this.location!).replace('.', ''), '-')
        if (this.description) {
            pkg.description = this.description
        }

        await Promise.allSettled([
            writeFile(pkgPath, JSON.stringify(pkg, null, 2)),
            this.removeLockFile(),
            rm(join(this.location!, 'pnpm-workspace.yaml'), { force: true }),
            rm(join(this.location!, 'README.md'), { force: true }),
            rm(join(this.location!, '.github'), { force: true, recursive: true }),
        ])
    }

    async removeLockFile () {
        if (!this.skipInstallation) {
            return
        }

        await Promise.allSettled([
            unlink(join(this.location!, 'package-lock.json')),
            unlink(join(this.location!, 'yarn.lock')),
            unlink(join(this.location!, 'pnpm-lock.yaml')),
        ])
    }

    async getBanner () {
        return await readFile(join(process.cwd(), './logo.txt'), 'utf-8')
    }

    async copyExampleEnv () {
        const envPath = join(this.location!, '.env')
        const exampleEnvPath = join(this.location!, '.env.example')

        if (existsSync(exampleEnvPath)) {
            await copyFile(exampleEnvPath, envPath)
        }
    }

    async createTsConfig () {
        const tscPath = join(this.location!, '.h3ravel')

        await mkdir(tscPath, { recursive: true })
        await writeFile(join(tscPath, 'tsconfig.json'), JSON.stringify(mainTsconfig, null, 2))
        await writeFile(join(this.location!, 'tsconfig.json'), JSON.stringify(baseTsconfig, null, 2))
    }
}
