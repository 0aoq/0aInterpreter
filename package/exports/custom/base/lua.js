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
const fs = __importStar(require("fs"));
index_js_1.createCmdFromFile("lua.new", true, function ($) {
    if (index_js_1.imported[0].lua === true) {
        let name = utility_js_1.splitFlags(utility_js_1.getArgs($.cmd, 2, 0).split(" do")[0], "sandbox")[0]; // get sandbox flag
        setTimeout(() => {
            const CreateFiles = fs.createWriteStream(process.cwd() + "/" + name + ".lua", {
                flags: 'a'
            });
            for (let line of index_js_1.getFromHold(name).lines) {
                CreateFiles.write(line + '\r\n');
            }
        }, 1);
    }
    else {
        return index_js_1.handleCommand(`SyntaxError "lua.new" is not recognized as a valid keyword. Did you forget to import lua?`, "lua", "", 1);
    }
});
