"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginMutation = void 0;
function createLoginMutation() {
    return `
		mutation login($options: LoginInput!) {
			login(options: $options) {
				user {
					id
					email
					token 
          username
				}
				cards {
					id
					frontSideText
					frontSidePicture
					frontSideLanguage
					backSideText
					backSidePicture
					backSideLanguage
					creatorId
					createdAt
					updatedAt
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
exports.createLoginMutation = createLoginMutation;
//# sourceMappingURL=myMutations.js.map