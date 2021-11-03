"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeQuery = exports.createEditCardMutation = exports.createClearUserCardsMutation = exports.createGetUserCardsQuery = exports.createAddCardMutation = exports.createLogoutMutation = exports.ColorLog = exports.logJson = void 0;
const types_1 = require("../../types");
function logJson(input) {
    return (() => console.log(`${types_1.ANSI_ESCAPES.warning}`, `${JSON.stringify(input, null, 2)}`, `${types_1.ANSI_ESCAPES.reset}`))();
}
exports.logJson = logJson;
;
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
            default: this.color = "";
        }
    }
    genLog() {
        return console.log(`${this.color}`, `${this.message}`, `${types_1.ANSI_ESCAPES.reset}`);
    }
}
exports.ColorLog = ColorLog;
function createLogoutMutation(email) {
    return `
		mutation logout{
			logout(email: "${email}") {
				done
				errors {
					field
					message
				}
			}
		}
	`;
}
exports.createLogoutMutation = createLogoutMutation;
function createAddCardMutation() {
    return `
		mutation addCard($options: AddCardInput!) {
			addCard(options: $options) {
				cards {
					id
					creatorId
					frontSideText
					frontSideLanguage
					frontSidePicture 
					backSideText
					backSideLanguage
					backSidePicture
				}
				errors {
					field
					message
				}
			}
		}
	`;
}
exports.createAddCardMutation = createAddCardMutation;
function createGetUserCardsQuery() {
    return `
		query getUserCards {
			getUserCards{
				cards {
					id
					creatorId
					frontSideText
					frontSideLanguage
					frontSidePicture 
					backSideText
					backSideLanguage
					backSidePicture
				}
				errors {
					field
					message
				}
			}
		}
	`;
}
exports.createGetUserCardsQuery = createGetUserCardsQuery;
function createClearUserCardsMutation() {
    return `
		mutation clearUserCards {
			clearUserCards {
				errors {
					field
					message
				}
				done
			}
		}
	`;
}
exports.createClearUserCardsMutation = createClearUserCardsMutation;
function createEditCardMutation() {
    return `
		mutation editCardById($options: EditCardInput!) {
			editCardById(options: $options){
				errors {
					field
					message
				}
				cards {
					id
					frontSideText
					frontSideLanguage
					frontSidePicture 
					backSideText
					backSideLanguage
					backSidePicture
					createdAt
					updatedAt
					creatorId
				}
			}
		}
	`;
}
exports.createEditCardMutation = createEditCardMutation;
function createMeQuery() {
    return `
		{
			me {
				user {
					token
					id
					username
					email
					createdAt
					updatedAt
				}
				cards {
					id
					frontSideText
					frontSideLanguage
					frontSidePicture 
					backSideText
					backSideLanguage
					backSidePicture
				}
				token
				errors {
					field
					message
				}
			}
		}
	`;
}
exports.createMeQuery = createMeQuery;
//# sourceMappingURL=helpers.js.map