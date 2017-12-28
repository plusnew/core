"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./src/interfaces/jsx");
const src_1 = require("./src");
exports.Plusnew = src_1.default;
const scheduler_1 = require("./src/scheduler");
exports.scheduler = scheduler_1.default;
const redchain_1 = require("redchain");
exports.store = redchain_1.default;
exports.default = new src_1.default();
//# sourceMappingURL=index.js.map