"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./classes/di"));
__export(require("./decorators/reflection"));
var di_1 = require("./classes/di");
exports.autowired = (_a = new di_1.DI(), _a.autowired), exports.override = _a.override, exports.reset = _a.reset; // export as singleton
