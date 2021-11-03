"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse {
    constructor(field, message) {
        this.errors = [{
                field,
                message
            }];
    }
    ;
}
exports.ErrorResponse = ErrorResponse;
;
//# sourceMappingURL=ErrorResponse.js.map