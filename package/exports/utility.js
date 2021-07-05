"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoolean = exports.returnValue = exports.getFromReturned = exports.returnedFromLine = exports.parseFunction = exports.parseString = exports.parseCommands2 = exports.parseCommands = exports.$functions = exports.cmds = exports.parseVariables = exports.getFunction = exports.getVariable = exports.makeVariable = exports.getArgs = exports.sleep = exports.writeReturnErr = exports.$checkQuotes = exports.$checkBrackets = void 0;
var index_js_1 = require("../index.js");
var fs = require("fs");
var $checkBrackets = function (expr) {
    var holder = [];
    var openBrackets = ['(', '{', '['];
    var closedBrackets = [')', '}', ']'];
    for (var _i = 0, expr_1 = expr; _i < expr_1.length; _i++) {
        var letter = expr_1[_i];
        if (openBrackets.includes(letter)) {
            holder.push(letter);
        }
        else if (closedBrackets.includes(letter)) {
            var openPair = openBrackets[closedBrackets.indexOf(letter)];
            if (holder[holder.length - 1] === openPair) {
                holder.splice(-1, 1);
            }
            else {
                holder.push(letter);
                break;
            }
        }
    }
    return (holder.length === 0); // return true if length is 0, otherwise false
};
exports.$checkBrackets = $checkBrackets;
var $checkQuotes = function (expr) {
    if (expr[0] == '"' && expr.slice(-1) == '"') {
        return true;
    }
    else {
        return false;
    }
};
exports.$checkQuotes = $checkQuotes;
var writeReturnErr = function (fileName, newdata, add) {
    fs.readFile(fileName, 'utf8', function (err, data) {
        /* if (err) {
            return
        } */
        var $ = newdata;
        if (add) {
            $ = data += newdata;
        }
        fs.writeFile(fileName, $, function (err) {
            if (err)
                return console.log(err);
        });
    });
};
exports.writeReturnErr = writeReturnErr;
function sleep(sec) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, sec * 1000); })];
        });
    });
}
exports.sleep = sleep;
var getArgs = function (cmd, limit, split) {
    var $ = cmd.split(" ", limit);
    $ = cmd.split($[split]);
    var returned = $[1].slice(1);
    return returned;
};
exports.getArgs = getArgs;
// helpers
var makeVariable = function ($name, $value, $function, $type) {
    if ($type === void 0) { $type = "undefined"; }
    if ($function == "null") {
        if (exports.getVariable('val:' + $name.split(" = ")[0], $function) == null) {
            index_js_1.variables.push({
                name: 'val:' + $name.split(" = ")[0],
                val: $value,
                function: "null",
                __type: $type
            });
        }
        else {
            exports.getVariable('val:' + $name.split(" = ")[0], $function).val = $value;
        }
    }
    else {
        if (exports.getVariable('$:' + $name.split(" = ")[0], $function) == null) {
            index_js_1.variables.push({
                name: '$:' + $name.split(" = ")[0] + "__&func:" + $function,
                val: $value,
                function: $function,
                __type: $type
            });
        }
        else {
            exports.getVariable('$:' + $name.split(" = ")[0], $function).val = $value;
        }
    }
};
exports.makeVariable = makeVariable;
var getVariable = function ($name, $function) {
    if ($function === void 0) { $function = "null"; }
    if ($function == "null") {
        for (var _i = 0, variables_1 = index_js_1.variables; _i < variables_1.length; _i++) {
            var variable = variables_1[_i];
            if (variable.name == $name) {
                return variable;
            }
        }
    }
    else {
        for (var _a = 0, variables_2 = index_js_1.variables; _a < variables_2.length; _a++) {
            var variable = variables_2[_a];
            if (variable.name == $name && $function == variable.function) {
                return variable;
            }
        }
    }
};
exports.getVariable = getVariable;
var getFunction = function ($name) {
    for (var _i = 0, functions_1 = index_js_1.functions; _i < functions_1.length; _i++) {
        var func = functions_1[_i];
        if (func.name == $name) {
            return func;
        }
    }
};
exports.getFunction = getFunction;
// Parsing helper functions
var parseVariables = function ($content, $calling, $add) {
    if ($calling === void 0) { $calling = "null"; }
    if ($add === void 0) { $add = ""; }
    $content = $content.split("//")[0];
    var words = $content.split(" ");
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        var $ = word + $add;
        var val = exports.getVariable($, $calling);
        if (val != null) {
            if (val.function == "null") {
                $content = $content.replace(word, exports.getVariable($, $calling).val);
            }
            else {
                if ($calling = val.function) {
                    $content = $content.replace(word, exports.getVariable($, $calling).val);
                }
            }
        }
    }
    var __words = $content.split(")")[0].split("(");
    for (var _a = 0, __words_1 = __words; _a < __words_1.length; _a++) {
        var word = __words_1[_a];
        var $ = word + $add;
        var val = exports.getVariable($, $calling);
        if (val != null) {
            if (val.function == "null") {
                $content = $content.replace(word, exports.getVariable($, $calling).val);
            }
            else {
                if ($calling = val.function) {
                    $content = $content.replace(word, exports.getVariable($, $calling).val);
                }
            }
        }
    }
    return $content;
};
exports.parseVariables = parseVariables;
exports.cmds = [
    'val', 'repeat', 'func', 'run', 'cd', 'clear', 'write', 'write_add', 'rm',
    'listdir', 'mk', 'exec', 'calc', 'debug', 'set', '//', 'if', 'ifnot', 'rest',
    '{/end}'
];
exports.$functions = [
    'log', 'run'
];
var parseCommands = function ($content, $calling) {
    if ($calling === void 0) { $calling = "null"; }
    var words = $content.split(" ");
    for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
        var word = words_2[_i];
        if (exports.$functions.includes(word) && exports.$checkBrackets(word)) {
            $content = $content.replace(word, index_js_1.handleCommand(word.split("(")[0], $calling));
            console.log($content);
        }
    }
    return $content;
};
exports.parseCommands = parseCommands;
var parseCommands2 = function ($content, $calling) {
    if ($calling === void 0) { $calling = "null"; }
    var words = $content.split(" ");
    for (var _i = 0, words_3 = words; _i < words_3.length; _i++) {
        var word = words_3[_i];
        if (exports.$checkBrackets(word.split("cmd:")[1])) {
            if (exports.parseFunction(word.split("cmd:")[1])) {
                index_js_1.handleCommand(exports.parseFunction(word.split("cmd:")[1]), $calling, "", 1);
            }
        }
    }
};
exports.parseCommands2 = parseCommands2;
var parseString = function ($content) {
    return $content.split('"')[1].split('"')[0];
};
exports.parseString = parseString;
var parseFunction = function ($content) {
    return $content.split(")")[0].split("(")[1];
};
exports.parseFunction = parseFunction;
exports.returnedFromLine = [];
function getFromReturned(line) {
    for (var _i = 0, returnedFromLine_1 = exports.returnedFromLine; _i < returnedFromLine_1.length; _i++) {
        var datapoint = returnedFromLine_1[_i];
        if (datapoint.line = line) {
            return datapoint;
        }
    }
}
exports.getFromReturned = getFromReturned;
var returnValue = function ($line, $value) {
    exports.returnedFromLine.push({
        line: $line,
        return: $value
    });
};
exports.returnValue = returnValue;
var getBoolean = function ($string) {
    if ($string == "true") {
        return true;
    }
    else if ($string == "false") {
        return false;
    }
};
exports.getBoolean = getBoolean;
// exports
exports.default = {
    returnValue: exports.returnValue,
    // get functions
    getFromReturned: getFromReturned,
    getArgs: exports.getArgs,
    getFunction: exports.getFunction,
    getVariable: exports.getVariable,
    getBoolean: exports.getBoolean,
    // parsers
    parseString: exports.parseString,
    parseVariables: exports.parseVariables,
    parseCommands: exports.parseCommands,
    parseCommands2: exports.parseCommands2,
    parseFunction: exports.parseFunction,
    // checks
    $checkBrackets: exports.$checkBrackets,
    $checkQuotes: exports.$checkQuotes,
    // unnamed
    cmds: exports.cmds,
    $functions: exports.$functions,
    sleep: sleep,
    writeReturnErr: exports.writeReturnErr,
    makeVariable: exports.makeVariable
};
