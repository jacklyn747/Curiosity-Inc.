import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.module\\.css$': '<rootDir>/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: ['/node_modules/'],
}
export default config
