/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddCardInput,
  AddCardResponse,
  ICard,
  LoginResponse,
  MeQueryResponse,
  RegisterResponse,
  UserEntityBase,
} from "@/types";
import { API_URL } from "@/constants";
export interface IApiService {
  headers: Record<string, string>;
  me: (token?: string) => Promise<MeQueryResponse>;
  login: (args: {
    email?: string;
    username?: string;
    password: string;
  }) => Promise<LoginResponse>;
  signup: (args: {
    username: string;
    email: string;
    password: string;
  }) => Promise<RegisterResponse | void>;
  addCard: (card: AddCardInput, token: string) => Promise<AddCardResponse>;
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
  public async me(token?: string): Promise<MeQueryResponse> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token as string);
    try {
      const res = await fetch(API_URL + "/user/me", {
        method: "GET",
        headers: this.headers,
      });
      const data = await res.json();
      if (data.error) return data;
      else return data;
    } catch (error) {
      const err = error as Error;
      console.log(err);
      return { user: void 0, error: err.message };
    }
  }
  public async login(args: {
    email?: string;
    username?: string;
    password: string;
  }): Promise<LoginResponse> {
    const { username, email, password } = args;
    this.clearHeaders();
    this.setInitialHeaders();
    try {
      const res = await fetch(API_URL + "/user/login", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: this.headers,
      });
      const data = (await res.json()) as LoginResponse;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async signup(args: {
    username: string;
    email: string;
    password: string;
  }): Promise<RegisterResponse | void> {
    this.clearHeaders();
    this.setInitialHeaders();
    try {
      const { username, email, password } = args;
      const res = await fetch(API_URL + "/user/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: this.headers,
      });
      const data = (await res.json()) as RegisterResponse;
      return data;
    } catch (error) {
      console.error(error);
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
  public async addCard(
    card: AddCardInput,
    token: string
  ): Promise<AddCardResponse> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      const res = await fetch(API_URL + "/user/addCard", {
        method: "POST",
        body: JSON.stringify(card),
        headers: this.headers,
      });
      const data = (await res.json()) as AddCardResponse;
      console.log("data from add card post", data);
      if (data.error) throw new Error(`${data.error}`);
      return data;
    } catch (error) {
      const err = error as Error;
      console.error("error in add card api service", error);
      return { error: err.message, cards: void 0 };
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
    _email: string
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
    _resetToken: string,
    _newPassword: string
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

export const api = new ApiService();
