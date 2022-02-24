"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorLog = exports.logJson = void 0;
const types_1 = require("../../types");
function logJson(input) {
    return (() => console.log(`${types_1.ANSI_ESCAPES.warning}`, `${JSON.stringify(input, null, 2)}`, `${types_1.ANSI_ESCAPES.reset}`))();
}
exports.logJson = logJson;
class ColorLog extends Object {
    constructor(color, message) {
        super();
        this.message = message;
        switch (color) {
            case "yellow":
                {
                    this.color = types_1.ANSI_ESCAPES.warning;
                }
                break;
            case "red":
                {
                    this.color = types_1.ANSI_ESCAPES.danger;
                }
                break;
            case "green":
                {
                    this.color = types_1.ANSI_ESCAPES.success;
                }
                break;
            case "blue":
                {
                    this.color = types_1.ANSI_ESCAPES.info;
                }
                break;
            case "purple":
                {
                    this.color = types_1.ANSI_ESCAPES.link;
                }
                break;
            default:
                this.color = "";
        }
    }
    genLog() {
        return console.log(`${this.color}`, `${this.message}`, `${types_1.ANSI_ESCAPES.reset}`);
    }
}
exports.ColorLog = ColorLog;
//# sourceMappingURL=helpers.js.map