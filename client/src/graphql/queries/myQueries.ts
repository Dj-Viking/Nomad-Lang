export function createMeQuery(): string {
  return `
    query me {
      me {
        user {
          id
          username
          email
          token
        }
        errors {
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

export function createGetUserTodosQuery(): string {
  return `
    query getUserTodos {
      getUserTodos {
        todos {
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
        errors{
          field
          message
        }
      }
    }
  `;
}
