const path = require('path');

const baseDirectory = path.join(__dirname, '..');
const distDirectory = path.join(baseDirectory, 'dist');

module.exports = {
  baseDirectory,
  distDirectory,
};
