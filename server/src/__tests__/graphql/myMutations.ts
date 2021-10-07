export function createLoginMutation(): string {
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