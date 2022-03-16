"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.instance = exports.singleton = exports.resolve = exports.override = exports.autowired = void 0;
__exportStar(require("./classes/di"), exports);
__exportStar(require("./decorators/reflection"), exports);
__exportStar(require("./models/autowired-lifetimes"), exports);
const di_1 = require("./classes/di");
_a = new di_1.DI(), exports.autowired = _a.autowired, exports.override = _a.override, exports.resolve = _a.resolve, exports.singleton = _a.singleton, exports.instance = _a.instance, exports.reset = _a.reset; // Export as singleton
