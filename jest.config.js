module.exports = {
  verbose: true,
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  rootDir: __dirname,
  roots: [
    "<rootDir>/src",
    "<rootDir>/test",
  ],
  modulePaths: ["src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  transformIgnorePatterns: [],
  moduleFileExtensions: ['tsx', 'ts', 'js'],
  setupFiles: [],
  coverageReporters: [
    "lcov",
    "text"
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
}