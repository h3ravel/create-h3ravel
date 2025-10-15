#!/usr/bin/env node

import { CreateH3ravelCommand } from './Commands/CreateH3ravelCommand';
import { Kernel } from '@h3ravel/musket';

class Application { }

Kernel.init(new Application(), {
    rootCommand: CreateH3ravelCommand
})
