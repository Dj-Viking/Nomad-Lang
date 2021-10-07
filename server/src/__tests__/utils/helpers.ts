

import { ANSI_ESCAPES } from "../../types";

export function logJson(input: any): void {
  return (() => console.log(`${ANSI_ESCAPES.warning}`, `${JSON.stringify(input, null, 2)}`, `${ANSI_ESCAPES.reset}`))();
};

/**
 * helper class to construct colored console logs for the tests
 */
export class ColorLog extends Object {
	private color!: string;
	private message!: string;
	constructor(color: string, message: string) {
		super();
		this.message = message;
		switch (color) {
			case "yellow": {
				this.color = ANSI_ESCAPES.warning;
			}
			break;
			case "red": {
				this.color = ANSI_ESCAPES.danger;
			}
			break;
			case "green": {
				this.color = ANSI_ESCAPES.success;
			}
			break;
			case "blue": {
				this.color = ANSI_ESCAPES.info;
			}
			break;
			case "purple": {
				this.color = ANSI_ESCAPES.link;
			}
			break;
			default: this.color = "";
			
		}
	}
	public genLog(): void {
		return console.log(`${this.color}`, `${this.message}`, `${ANSI_ESCAPES.reset}`);
	}
}

export function createLogoutMutation(email: string): string {
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
	`
}

//same here add the variables args as an object with { options: { ...args } }
export function createAddCardMutation(): string {
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

export function createGetUserCardsQuery(): string {
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
	`
}

export function createClearUserCardsMutation(): string {
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
	`
}

//no input args tot his function pass variable args withint he request() function
// on the test
export function createEditCardMutation(): string {
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



export function createMeQuery(): string {
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
	`
}