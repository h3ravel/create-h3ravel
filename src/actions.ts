import { Logger, Resolver, baseTsconfig, mainTsconfig, packageJsonScript } from "@h3ravel/shared";
import { basename, join, relative } from "node:path";
import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { detectPackageManager, installPackage } from "@antfu/install-pkg";

import { Str } from "@h3ravel/support";
import { downloadTemplate } from "giget";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";

export default class {
    skipInstallation?: boolean

    constructor(private location?: string, private appName?: string, private description?: string) {
        if (!this.location) {
            this.location = join(process.cwd(), '.temp')
        }
    }

    async download (template: string, install = false, auth?: string, overwrite = false) {
        if (this.location?.includes('.temp') || (overwrite && existsSync(this.location!))) {
            await rm(this.location!, { force: true, recursive: true })
        } else if (existsSync(this.location!)) {
            console.log('\n')
            Logger.parse([[' ERROR ', 'bgRed'], [this.location!, ['gray', 'italic']], ['is not empty.', 'white']], ' ')
            console.log('')
            process.exit(0)
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

    async complete (installed = false) {
        console.log('')

        Logger.success('Your h3ravel project has been created successfully')
        Logger.parse([['cd', 'cyan'], ['./' + relative(process.cwd(), this.location!), 'green']])
        if (!installed) {
            Logger.parse([[await Resolver.getPakageInstallCommand(), 'cyan']])
        }
        Logger.parse([['npx', 'cyan'], ['musket fire', 'green']], ' ')
        Logger.parse([['Open http://localhost:3000', 'cyan']])

        console.log('')

        Logger.parse([['Have any questions', 'white']])
        Logger.parse([['Join our Discord server -', 'white'], ['https://discord.gg/hsG2A8PuGb', 'yellow']])
        Logger.parse([['Checkout the documentation -', 'white'], ['https://h3ravel.toneflix.net', 'yellow']])
    }

    async cleanup () {
        const pkgPath = join(this.location!, 'package.json')
        const pkg = await readFile(pkgPath!, 'utf-8').then(JSON.parse)

        delete pkg.packageManager
        pkg.name = Str.slugify(this.appName ?? basename(this.location!).replace('.', ''), '-')
        pkg.scripts = packageJsonScript
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
        if (!existsSync(join(this.location!, 'src/database/db.sqlite'))) {
            await writeFile(join(this.location!, 'src/database/db.sqlite'), '')
        }
    }
}
