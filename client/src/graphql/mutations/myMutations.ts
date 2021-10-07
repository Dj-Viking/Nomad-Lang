export function createRegisterMutation(): string {
  return `
    mutation register($options: RegisterInput!) {
      register(options: $options){
        token
        user {
          username
          email
          token
        }
        errors {
          field
          message
        }
      }
    }
  
  `;
}

export function createAddCardMutation(): string {
  return `
    mutation addCard($options: AddCardInput!) {
      addCard(options: $options) {
        cards {
          id
          creatorId
          createdAt
          updatedAt
          frontSideText
          frontSidePicture
          frontSideLanguage
          backSidePicture
          backSideLanguage
          backSideText
        }
        errors {
          field
          message
        }
      }
    }
  `;
}

export function createLoginMutation(): string {
  return `
    mutation login($options: LoginInput!) {
      login(options: $options) {
        token
        user {
          id
          email
          username
          token
        }
        cards {
          id
          createdAt
          updatedAt
          creatorId
          frontSideText
          frontSidePicture
          frontSideLanguage
          backSidePicture
          backSideLanguage
          backSideText
        }
        errors {
          field
          message
        }
      }
    }
  `;
}

export function createLogoutMutation(email: string): string {
  return `
    mutation logout($email: String!) {
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

export function createEditCardMutation(): string {
  return `
    mutation editCardById($options: EditCardInput!){
      editCardById(options: $options) {
        errors{
          field
          message
        }
        cards {
          id
          creatorId
          updatedAt
          createdAt
          frontSideText
          frontSidePicture
          frontSideLanguage
          backSidePicture
          backSideLanguage
          backSideText
        }
      }
    }
  `;
}

export function createClearUserCardsMutation(): string {
  return `
    mutation clearUserCards {
      clearUserCards {
        done
        errors {
          field
          message
        }
      }
    }
  `;
}

export function createDeleteCardMutation(): string {
  return `
    mutation deleteCard($id: Int!) {
      deleteCard(id: $id){
        cards {
          id
          creatorId
          frontSideText
          frontSidePicture
          frontSideLanguage
          backSidePicture
          backSideLanguage
          backSideText
        }
        errors {
          field
          message
        }
      }
    }
  `;
}
