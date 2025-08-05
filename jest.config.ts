import { createJsWithTsEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

const tsJestTransformCfg = createJsWithTsEsmPreset().transform

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ['<rootDir>'],
  testMatch: ['**/**/*test.ts'],
}

export default jestConfig
