/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddCardPayload,
  AddCardResponse,
  ClearCardsResponse,
  DeleteCardResponse,
  EditCardResponse,
  ICard,
  IEditCardPayload,
  LoginResponse,
  MeQueryResponse,
  RegisterResponse,
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
  addCard: (
    token: string,
    card: AddCardPayload
  ) => Promise<AddCardResponse | never>;
  clearCards: (token: string) => Promise<ClearCardsResponse>;
  editCard: (
    token: string,
    card: IEditCardPayload
  ) => Promise<EditCardResponse>;
  deleteCard: (token: string, id: string) => Promise<DeleteCardResponse>;
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
  public async addCard(
    token: string,
    card: AddCardPayload
  ): Promise<AddCardResponse | never> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      console.log("card sending", card);

      const res = await fetch(`${API_URL}` + "/user/addCard", {
        method: "POST",
        body: JSON.stringify(card),
        headers: this.headers,
      });
      if (res.status !== 200) {
        throw new Error("[ERROR]: UNEXPECTED STATUS" + res.status);
      }
      const data = (await res.json()) as ICard[];
      console.log("data from add card api service fetch", data);
      return {
        cards: data,
      };
    } catch (error) {
      throw {
        error: `error during api service add card ${error}`,
      };
    }
  }
  public async clearCards(token: string): Promise<ClearCardsResponse> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      const res = await fetch(`${API_URL}` + "/user/clearCards", {
        method: "PUT",
        headers: this.headers,
      });
      const data = await res.json();
      console.log("data from clear cards", data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  public async editCard(
    token: string,
    card: IEditCardPayload
  ): Promise<EditCardResponse> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      const res = await fetch(`${API_URL}` + `/user/editCard/${card.id}`, {
        method: "PUT",
        body: JSON.stringify(card),
        headers: this.headers,
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      const err = error as Error;
      return {
        cards: void 0,
        error: err.message,
      };
    }
  }
  public async deleteCard(
    token: string,
    id: string
  ): Promise<DeleteCardResponse> {
    this.clearHeaders();
    this.setInitialHeaders();
    this.setAuthHeader(token);
    try {
      const res = await fetch(`${API_URL}` + `/user/deleteCard/${id}`, {
        method: "DELETE",
        headers: this.headers,
      });
      console.log("res for delete card", res);
      const data = await res.json();
      console.log("data for delete card", data);
      return data;
    } catch (error) {
      console.error(error);
      const err = error as Error;
      return {
        cards: void 0,
        error: err.message as string,
      };
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
