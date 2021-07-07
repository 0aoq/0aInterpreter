import { createCmdFromFile } from '../../core/index.js';

let clui = require("clui")

createCmdFromFile("exit", false, function ($) {
    let Spinner = clui.Spinner;

    let countdown = new Spinner(`Exiting 0a Interpreter (5)`);

    countdown.start();

    let number = 5;
    setInterval(function () {
        number--;
        countdown.message(`Exiting 0a Interpreter (${number})`);
        if (number === 0) {
            process.stdout.write('\n');
            process.exit(0);
        }
    }, 1000);
})