const path = require('path');

module.exports = {
  verbose: true,
  rootDir: path.join(__dirname, '..'),
  roots: [
    "<rootDir>/src",
    "<rootDir>/test",
  ],
  modulePaths: ["src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ['tsx', 'ts', 'js'],
  setupFiles: [
    require.resolve('requestidlecallback'),
  ],
}