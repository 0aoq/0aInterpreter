"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../core/index.js");
const utility_js_1 = require("../../../core/utility.js");
const clui = __importStar(require("clui"));
const os = __importStar(require("os"));
index_js_1.createCmdFromFile("monitor", false, function ($) {
    let $for = parseInt(utility_js_1.getArgs($.cmd, 2, 0));
    let waited = 0;
    if (!isNaN($for)) {
        console.log(`Monitoring CPU ${os.cpus()[0].model} on ${os.hostname()}, on platform ${os.platform()}, ${os.arch()}`);
        setInterval(function () {
            if (waited < $for) {
                waited++;
                let Gauge = clui.Gauge;
                let total = os.totalmem();
                let free = os.freemem();
                let used = total - free;
                let human = Math.ceil(used / 1000000) + ' MB';
                console.log(Gauge(used, total, 20, total * 0.8, human));
            }
        }, 1000);
    }
});
