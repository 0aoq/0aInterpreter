"use strict";
// npx tsc parse.ts
// node parse.js
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
exports.handleCommand = exports.createCmdFromFile = exports.multi_line_required = exports.getFromHold = exports.imported = exports.parseHold = exports.parsedLines = exports.functions = exports.variables = void 0;
var readline = require('readline');
var fs = require('fs');
var path = require('path');
var http = require('http');
var colors = require('colors');
var utility_js_1 = require("./exports/utility.js");
var parse_js_1 = require("./exports/parse.js");
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("\n    <script>\n        window.location = \"https://github.com/0aoq/0aDocumentation\"\n    </script>\n    ");
    res.end();
}).listen(8080);
exports.variables = [];
exports.functions = [];
var indexed = [];
// main
exports.parsedLines = [];
exports.parseHold = [];
exports.imported = [{
        html: false,
        css: false,
        lua: false
    }];
function getFromHold($name) {
    for (var _i = 0, parseHold_1 = exports.parseHold; _i < parseHold_1.length; _i++) {
        var value = parseHold_1[_i];
        if (value.name == $name) {
            return value;
        }
    }
}
exports.getFromHold = getFromHold;
var file_cmds = [];
exports.multi_line_required = ['func'];
var createCmdFromFile = function (name, multiline, run) {
    if (name && run) {
        exports.multi_line_required.push(name);
        file_cmds.push({
            name: name,
            run: run
        });
    }
};
exports.createCmdFromFile = createCmdFromFile;
fs.readdir(__dirname + "/exports/custom", function (err, files) {
    if (err) {
        console.log(err);
    }
    files.forEach(function (file) {
        if (file.split(".")[1] == "js") { // file extension
            setTimeout(function () {
                require(__dirname + "/exports/custom/" + file);
            }, 100);
        }
    });
});
function getFromCustomCmds(name) {
    for (var _i = 0, file_cmds_1 = file_cmds; _i < file_cmds_1.length; _i++) {
        var datapoint = file_cmds_1[_i];
        if (datapoint.name == name) {
            return datapoint;
        }
    }
}
// cmd functions
function cmds__repeat_worker($do, $amount, $every) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < $amount)) return [3 /*break*/, 4];
                    exports.handleCommand($do);
                    return [4 /*yield*/, utility_js_1.sleep($every)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// run
var handleCommand = function (cmd, callingFrom, addToVariables, line) {
    if (callingFrom === void 0) { callingFrom = "null"; }
    if (addToVariables === void 0) { addToVariables = ""; }
    return __awaiter(this, void 0, void 0, function () {
        var $, $name, $value, returned, $do, $amount, $every, $name_1, args, returned, _i, args_1, arg, $name, $value, _a, variables_1, val, uniqueId, _b, _c, command, _d, $_1, $_, returned, $name, $data, $name, $data, func, statement1, statement2, func, statement1, statement2, $_, $operation, $_, split, url, start, service, returned, $_, $operation, _e, file_cmds_2, custom_cmd;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    cmd = cmd.replace("    ", ""); // remove \t spaces
                    cmd = cmd.replace("\t", ""); // remove \t spaces
                    $ = cmd.split(" ");
                    if (!$) return [3 /*break*/, 21];
                    if ($[0] == "//") {
                        return [2 /*return*/];
                    }
                    // ===============
                    // UTILITY
                    // ===============
                    if ($[0] == "val") { // &;cmd[val]
                        $name = utility_js_1.getArgs(cmd, 2, 0);
                        $value = $name.split(" = ")[1];
                        if (isNaN(parseInt($value))) {
                            if (!utility_js_1.getVariable($value)) {
                                if ($value[0] == '"') {
                                    if (utility_js_1.$checkQuotes($value)) {
                                        utility_js_1.makeVariable($name, $value.split('"')[1].split('"')[0], callingFrom || null, "string");
                                    }
                                    else {
                                        exports.handleCommand("SyntaxError string was not closed properly.", callingFrom, addToVariables, line);
                                    }
                                }
                                else {
                                    utility_js_1.makeVariable($name, $value, callingFrom || null);
                                }
                            }
                        }
                        else if (!isNaN(parseInt($value))) {
                            utility_js_1.makeVariable($name, parseInt($value), callingFrom || null, "int");
                        }
                    }
                    else if ($[0] == "repeat") { // &;cmd[repeat]
                        // repeat {/s} run makeFile {/args} makeDir = true {/arg} fileName = test/repeatThing.txt {/arg} {/set} 1 i 4
                        $ = cmd.split(" ");
                        returned = cmd.split(" {/s} ")[1].split(" {/set} ");
                        $do = returned[0];
                        $amount = returned[1].split(" i ")[1];
                        $every = returned[1].split(" i")[0];
                        cmds__repeat_worker($do, $amount, $every);
                        // ===============
                        // FUNCTIONS
                        // ===============
                    }
                    else if ($[0] == "func") { // &;cmd[func]
                        $name_1 = utility_js_1.getArgs(cmd, 2, 0).split(" do")[0];
                        if (utility_js_1.getFunction($name_1) == null && $name_1 != "null") {
                            exports.functions.push({
                                name: $name_1,
                                run: getFromHold($name_1).lines,
                                nestedto: callingFrom || "null"
                            });
                            setTimeout(function () {
                                getFromHold($name_1).lines = ['parsed', "line: " + getFromHold($name_1).on];
                            }, 10);
                        }
                        else if (utility_js_1.getFunction($name_1).run[0].split(" ")[0] != "func") { // fix strange error on nested functions where it would try to duplicate
                            return [2 /*return*/, exports.handleCommand("SyntaxError Function has already been declared.", callingFrom, addToVariables, line)];
                        }
                    }
                    else if ($[0] == "run") { // &;cmd[run]
                        if (utility_js_1.getArgs(cmd, 2, 1) && utility_js_1.$checkBrackets(utility_js_1.getArgs(cmd, 2, 1))) {
                            args = utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 1)).split("; ");
                            returned = cmd.split(" ")[1];
                            if (utility_js_1.getFunction(returned).name) {
                                if (utility_js_1.getFunction(returned).nestedto == "null" || utility_js_1.getFunction(returned).nestedto == callingFrom) {
                                    if (args) {
                                        for (_i = 0, args_1 = args; _i < args_1.length; _i++) {
                                            arg = args_1[_i];
                                            $name = arg.split(" = ")[0];
                                            $value = arg.split(" = ")[1];
                                            for (_a = 0, variables_1 = exports.variables; _a < variables_1.length; _a++) {
                                                val = variables_1[_a];
                                                if (val.function == utility_js_1.getFunction(returned).name) {
                                                    val.name = "&;0a__val:reset";
                                                    val.val = "";
                                                }
                                            }
                                            utility_js_1.makeVariable($name, $value, utility_js_1.getFunction(returned).name || "null");
                                        }
                                    }
                                    uniqueId = "__&func:" + utility_js_1.getFunction(returned).name;
                                    for (_b = 0, _c = utility_js_1.getFunction(returned).run; _b < _c.length; _b++) {
                                        command = _c[_b];
                                        command = command.replace("    ", ""); // remove \t spaces
                                        command = command.replace("\t", ""); // remove \t spaces
                                        exports.handleCommand(utility_js_1.parseVariables(command, utility_js_1.getFunction(returned).name, uniqueId), utility_js_1.getFunction(returned).name, uniqueId);
                                    }
                                }
                            }
                            else {
                                exports.handleCommand("SyntaxError Function \"" + returned + "\" does not exist.", callingFrom, addToVariables, line);
                            }
                        }
                        else {
                            exports.handleCommand("SyntaxError Brackets were not opened and closed properly.", callingFrom, addToVariables, line);
                        }
                    }
                    // =================
                    // VARIABLES ALLOWED
                    // =================
                    for (_d = 0, $_1 = $; _d < $_1.length; _d++) { // parse all variables from every word
                        $_ = $_1[_d];
                        $[$_] = $_.replace($_, utility_js_1.parseVariables($_, callingFrom, addToVariables));
                    }
                    if (!($[0] == "log")) return [3 /*break*/, 1];
                    $ = cmd.split(" ");
                    // really long error handling section
                    if (utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0))[0] == '"') { // is a string
                        if (utility_js_1.$checkBrackets(cmd.slice(4))) {
                            if (utility_js_1.$checkQuotes(utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0)))) {
                                console.log(utility_js_1.parseString(utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0))));
                            }
                            else {
                                exports.handleCommand("SyntaxError quotes weren't closed properly for log function.", callingFrom, addToVariables, line);
                            }
                        }
                        else {
                            exports.handleCommand("SyntaxError brakets were not closed properly for log function.", callingFrom, addToVariables, line);
                        }
                    }
                    else if (utility_js_1.getVariable(utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0))) || !isNaN(parseInt(utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0))))) { // is a variable/int
                        if (utility_js_1.$checkBrackets(cmd.slice(4))) {
                            if (utility_js_1.getVariable(utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0)))) { // specific for variable
                                console.log(utility_js_1.getVariable(utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0))).val);
                            }
                            else { // any
                                console.log(utility_js_1.parseFunction(utility_js_1.getArgs(cmd, 2, 0)));
                            }
                        }
                        else {
                            exports.handleCommand("SyntaxError brakets were not closed properly for log function.", callingFrom, addToVariables, line);
                        }
                    }
                    else {
                        exports.handleCommand("SyntaxError log type not recognized.", callingFrom, addToVariables, line);
                    }
                    return [3 /*break*/, 20];
                case 1:
                    if (!($[0] == "SyntaxError")) return [3 /*break*/, 2];
                    console.log(colors.bold(colors.red("[!] (" + (line || 1) + ") SyntaxError: " + utility_js_1.getArgs(cmd, 2, 0))));
                    return [3 /*break*/, 20];
                case 2:
                    if (!($[0] == "cd")) return [3 /*break*/, 3];
                    exports.handleCommand('log (val:$cd)', callingFrom, addToVariables, line);
                    return [3 /*break*/, 20];
                case 3:
                    if (!($[0] == "read")) return [3 /*break*/, 4];
                    returned = utility_js_1.parseVariables(utility_js_1.getArgs(cmd, 2, 0), callingFrom);
                    console.log(returned);
                    fs.readFile(returned, 'utf8', function (err, data) {
                        if (err) {
                            console.log(colors.bold(colors.red("SyntaxError: " + err)));
                        }
                        console.log('\x1b[32m%s\x1b[0m', '=====================');
                        console.log(data);
                        console.log('\x1b[32m%s\x1b[0m', '=====================');
                    });
                    return [3 /*break*/, 20];
                case 4:
                    if (!($[0] == "clear")) return [3 /*break*/, 5];
                    console.clear();
                    return [3 /*break*/, 20];
                case 5:
                    if (!($[0] == "write")) return [3 /*break*/, 6];
                    $name = utility_js_1.getArgs(cmd, 2, 0).split(" ")[0];
                    $data = utility_js_1.getArgs(cmd, 2, 1);
                    utility_js_1.parseVariables($name, callingFrom);
                    utility_js_1.writeReturnErr($name, $data, false);
                    return [3 /*break*/, 20];
                case 6:
                    if (!($[0] == "write_add")) return [3 /*break*/, 7];
                    $name = utility_js_1.getArgs(cmd, 2, 0).split(" ")[0];
                    $data = utility_js_1.getArgs(cmd, 2, 1);
                    utility_js_1.parseVariables($name, callingFrom);
                    utility_js_1.writeReturnErr($name, $data, true);
                    return [3 /*break*/, 20];
                case 7:
                    if (!($[0] == "rm")) return [3 /*break*/, 8];
                    try {
                        fs.unlinkSync(utility_js_1.getArgs(cmd, 2, 0));
                    }
                    catch (err) {
                        return [2 /*return*/, console.log(colors.bold(colors.red("Error: " + err)))];
                    }
                    return [3 /*break*/, 20];
                case 8:
                    if (!($[0] == "listdir")) return [3 /*break*/, 9];
                    fs.readdir(utility_js_1.getArgs(cmd, 2, 0), function (err, files) {
                        if (err) {
                            return console.log(colors.bold(colors.red("Error: " + err)));
                        }
                        files.forEach(function (file) {
                            console.log(file);
                        });
                    });
                    return [3 /*break*/, 20];
                case 9:
                    if (!($[0] == "mk")) return [3 /*break*/, 10];
                    if (cmd.split(" ")[1] == "includedir") {
                        fs.mkdir(path.join(process.cwd(), cmd.split(" ")[2].split("/")[0]), function (err) {
                            if (err) {
                                return console.log(colors.bold(colors.red("[!] Error: " + err)));
                            }
                        });
                    }
                    fs.writeFile(utility_js_1.parseVariables(cmd.split(" ")[2], callingFrom), "", function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("Created.");
                        }
                    });
                    return [3 /*break*/, 20];
                case 10:
                    if (!($[0] == "exec")) return [3 /*break*/, 11];
                    parse_js_1.parse(cmd, callingFrom, addToVariables, line);
                    return [3 /*break*/, 20];
                case 11:
                    if (!($[0] == "if")) return [3 /*break*/, 12];
                    func = utility_js_1.parseVariables(utility_js_1.getArgs(cmd, 2, 0), callingFrom).split(" do ")[0];
                    statement1 = func.split(" == ")[0];
                    statement2 = func.split(" == ")[1];
                    if (statement2 == "null") {
                        statement2 = null;
                    }
                    if (statement1 == statement2) {
                        exports.handleCommand(utility_js_1.getArgs(cmd, 2, 0).split(" do ")[1], callingFrom);
                    }
                    return [3 /*break*/, 20];
                case 12:
                    if (!($[0] == "ifnot")) return [3 /*break*/, 13];
                    func = utility_js_1.parseVariables(utility_js_1.getArgs(cmd, 2, 0), callingFrom).split(" do ")[0];
                    statement1 = func.split(" == ")[0];
                    statement2 = func.split(" == ")[1];
                    if (statement2 == "null") {
                        statement2 = null;
                    }
                    if (statement1 != statement2) {
                        exports.handleCommand(utility_js_1.getArgs(cmd, 2, 0).split(" do ")[1], callingFrom);
                    }
                    return [3 /*break*/, 20];
                case 13:
                    if (!($[0] == "calc")) return [3 /*break*/, 14];
                    $_ = utility_js_1.getArgs(cmd, 2, 0).split(" with ")[0].split(" ");
                    $operation = utility_js_1.getArgs(cmd, 2, 0).split(" with ")[1];
                    if ($operation == "+") {
                        if (parseInt($_[0]) && parseInt($_[1])) {
                            console.log(parseInt($_[0]) + parseInt($_[1]));
                        }
                    }
                    else if ($operation == "-") {
                        if (parseInt($_[0]) && parseInt($_[1])) {
                            console.log(parseInt($_[0]) - parseInt($_[1]));
                        }
                    }
                    else if ($operation == "*") {
                        if (parseInt($_[0]) && parseInt($_[1])) {
                            console.log(parseInt($_[0]) * parseInt($_[1]));
                        }
                    }
                    else if ($operation == "/") {
                        if (parseInt($_[0]) && parseInt($_[1])) {
                            console.log(parseInt($_[0]) / parseInt($_[1]));
                        }
                    }
                    else if ($operation == "^") {
                        if (parseInt($_[0]) && parseInt($_[1])) {
                            Math.pow(parseInt($_[0]), parseInt($_[1]));
                        }
                    }
                    return [3 /*break*/, 20];
                case 14:
                    if (!($[0] == "debug")) return [3 /*break*/, 15];
                    $_ = utility_js_1.getArgs(cmd, 2, 0);
                    if ($_ == "variables") {
                        console.log(exports.variables);
                    }
                    else if ($_ == "functions") {
                        console.log(exports.functions);
                    }
                    else if ($_ == "within") {
                        console.log(callingFrom);
                    }
                    else if ($_ == "parsehold") {
                        console.log(exports.parseHold);
                    }
                    else if ($_ == "parsedlines") {
                        console.log(exports.parsedLines);
                    }
                    else if ($_ == "dictionary") {
                        console.log(utility_js_1.cmds);
                    }
                    else if ($_ == "imported") {
                        console.log(exports.imported);
                    }
                    else if ($_ == "customcmds") {
                        console.log(file_cmds);
                    }
                    return [3 /*break*/, 20];
                case 15:
                    if (!($[0] == "sleep")) return [3 /*break*/, 19];
                    if (!utility_js_1.$checkBrackets(cmd.slice(4))) return [3 /*break*/, 17];
                    split = cmd.slice(4).split(")")[0].split("(")[1];
                    return [4 /*yield*/, utility_js_1.sleep(parseInt(split))];
                case 16:
                    _f.sent();
                    return [3 /*break*/, 18];
                case 17:
                    exports.handleCommand("SyntaxError Brackets were not opened and closed properly.", callingFrom, addToVariables, line);
                    _f.label = 18;
                case 18: return [3 /*break*/, 20];
                case 19:
                    if ($[0] == "open") { // &;cmd[open]
                        url = utility_js_1.getArgs(cmd, 2, 0);
                        if (url) {
                            start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
                            require('child_process').exec(start + ' ' + url);
                        }
                        else {
                            exports.handleCommand("SyntaxError Url not specified.", callingFrom, addToVariables, line);
                        }
                    }
                    else if ($[0] == "import") {
                        service = utility_js_1.parseString(utility_js_1.getArgs(cmd, 2, 0));
                        if (service) {
                            exports.imported[0][service] = true;
                        }
                        else {
                            exports.handleCommand("SyntaxError Service not defined.", callingFrom, addToVariables, line);
                        }
                    }
                    // ===============
                    // IF NO CMD
                    // ===============
                    else if ($[0] == "set") { // &;cmd[set]
                        returned = cmd.split(" ")[0];
                        if (utility_js_1.getVariable('val:' + returned, callingFrom) != null) {
                            utility_js_1.getVariable('val:' + returned, callingFrom).val = utility_js_1.getArgs(cmd, 1, 0).split("= ")[1];
                        }
                    }
                    else if (!cmd.split(" ") || !utility_js_1.cmds.includes(cmd.split(" ")[0]) && !getFromCustomCmds(cmd.split(" ")[0])) {
                        if (isNaN(parseInt(cmd.split(" ")[0]))) {
                            exports.handleCommand("SyntaxError \"" + cmd + "\" is not recognized as a valid keyword.", callingFrom, addToVariables, line);
                        }
                        else {
                            $_ = cmd.split(" ");
                            $operation = $_[1];
                            if ($operation == "+") {
                                if (parseInt($_[0]) && parseInt($_[2])) {
                                    console.log(parseInt($_[0]) + parseInt($_[2]));
                                }
                            }
                            else if ($operation == "-") {
                                if (parseInt($_[0]) && parseInt($_[2])) {
                                    console.log(parseInt($_[0]) - parseInt($_[2]));
                                }
                            }
                            else if ($operation == "*") {
                                if (parseInt($_[0]) && parseInt($_[2])) {
                                    console.log(parseInt($_[0]) * parseInt($_[2]));
                                }
                            }
                            else if ($operation == "/") {
                                if (parseInt($_[0]) && parseInt($_[2])) {
                                    console.log(parseInt($_[0]) / parseInt($_[2]));
                                }
                            }
                            else if ($operation == "^") {
                                if (parseInt($_[0]) && parseInt($_[2])) {
                                    Math.pow(parseInt($_[0]), parseInt($_[2]));
                                }
                            }
                            else {
                                exports.handleCommand("SyntaxError Operator not supports/undefined.", callingFrom, addToVariables, line);
                            }
                        }
                    }
                    _f.label = 20;
                case 20:
                    // ===============
                    // FILE CMDS
                    // ===============
                    for (_e = 0, file_cmds_2 = file_cmds; _e < file_cmds_2.length; _e++) {
                        custom_cmd = file_cmds_2[_e];
                        if (custom_cmd.name == cmd.split(" ")[0]) {
                            custom_cmd.run({
                                cmd: cmd,
                                callingFrom: callingFrom,
                                addToVariables: addToVariables,
                                line: line
                            });
                        }
                    }
                    _f.label = 21;
                case 21: return [2 /*return*/];
            }
        });
    });
};
exports.handleCommand = handleCommand;
// question prompt
console.log("[!] Module base loaded correctly.");
var promptcmd = function () {
    var cmd_input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    cmd_input.question("[&] ", function (cmd) {
        exports.handleCommand(cmd);
        cmd_input.close();
        promptcmd();
    });
};
var dir_input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
dir_input.question("[&] Load files from directory: (cd/scripts) ", function (cmd) {
    cmd = cmd || process.cwd() + "/scripts";
    fs.readdir(cmd, function (err, files) {
        if (err) {
            console.log(err);
        }
        files.forEach(function (file) {
            setTimeout(function () {
                exports.handleCommand("exec " + cmd + "/" + file);
            }, 100);
        });
        promptcmd();
    });
    dir_input.close();
});
// defaults
process.title = "0a Basic Command Line";
exports.handleCommand('val $cd = "' + process.cwd() + '"');
exports.default = {
    handleCommand: exports.handleCommand,
    variables: exports.variables,
    functions: exports.functions,
    parseHold: exports.parseHold,
    parsedLines: exports.parsedLines,
    getFromHold: getFromHold,
    createCmdFromFile: exports.createCmdFromFile,
    imported: exports.imported,
    multi_line_required: exports.multi_line_required
};
