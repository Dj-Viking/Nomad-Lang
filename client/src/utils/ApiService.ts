import { ICard, UserEntityBase } from "@/types";
// let headers = {} as Record<string, string>;
export interface IApiService {
  headers: Record<string, string>;
  me: (token?: string) => Promise<UserEntityBase | void>;
  login: (email: string, password: string) => Promise<UserEntityBase | void>;
  signup: (
    username: string,
    email: string,
    password: string
  ) => Promise<UserEntityBase | void>;
  clearCards: (token: string) => Promise<UserEntityBase | void>;
  editCard: (token: string) => Promise<Array<ICard> | void>;
  deleteCard: (token: string) => Promise<Array<ICard> | void>;
  forgotPassword: (
    email: string
  ) => Promise<boolean | { message: string } | void>;
  changePassword: (
    resetToken: string,
    newPassword: string
  ) => Promise<boolean | { message: string } | void>;
}

class ApiService implements IApiService {
  headers: Record<string, string>;
  constructor() {
    this.headers = {};
  }
  public async me(token?: string): Promise<UserEntityBase | void> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token as string);
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async login(
    email: string,
    password: string
  ): Promise<void | UserEntityBase> {
    this.clearHeaders();
    this.setInitialHeaders();
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async signup(
    username: string,
    email: string,
    password: string
  ): Promise<void | UserEntityBase> {
    this.clearHeaders();
    this.setInitialHeaders();
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async clearCards(token: string): Promise<void | UserEntityBase> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async editCard(token: string): Promise<void | ICard[]> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async deleteCard(token: string): Promise<void | ICard[]> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async forgotPassword(
    email: string
  ): Promise<boolean | void | { message: string }> {
    this.clearHeaders();
    this.setInitialHeaders();
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async changePassword(
    resetToken: string,
    newPassword: string
  ): Promise<boolean | void | { message: string }> {
    this.clearHeaders();
    this.setInitialHeaders();
    try {
      return void 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private clearHeaders(): void {
    this.headers = {};
  }
  private setInitialHeaders(): void {
    this.headers = {
      ...this.headers,
      "Content-Type": "application/json",
    };
  }
  private setAuthHeader(token: string): void {
    this.headers = {
      ...this.headers,
      authorization: `Bearer ${token}`,
    };
  }
}

export const API = new ApiService();
