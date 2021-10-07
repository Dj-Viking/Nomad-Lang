
export interface CustomError {
  field: string;
  message: string;
}
export type ErrorArray = CustomError[];
export class ErrorResponse {
  errors!: ErrorArray 
  constructor(field: string, message: string) {
    this.errors = [{
      field,
      message
    }];
  };
};