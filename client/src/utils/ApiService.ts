/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AddCardPayload,
  AddCardResponse,
  ChangePasswordResponse,
  ClearCardsResponse,
  DeleteCardResponse,
  EditCardResponse,
  ForgotPassResponse,
  ChangeThemePrefResponse,
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
  forgotPassword: (email: string) => Promise<ForgotPassResponse>;
  changePassword: (
    resetToken: string,
    newPassword: string
  ) => Promise<ChangePasswordResponse>;
  changeThemePref: (
    token: string,
    themePref: string
  ) => Promise<ChangeThemePrefResponse>;
}

class ApiService implements IApiService {
  headers: Record<string, string>;
  constructor() {
    this.headers = {};
  }

  private _clearHeaders(): void {
    this.headers = {};
  }
  private _setInitialHeaders(): void {
    this.headers = {
      ...this.headers,
      "Content-Type": "application/json",
    };
  }
  private _setAuthHeader(token: string): void {
    this.headers = {
      ...this.headers,
      authorization: `Bearer ${token}`,
    };
  }
  public async me(token?: string): Promise<MeQueryResponse> {
    this._clearHeaders();
    this._setInitialHeaders();
    this._setAuthHeader(token as string);
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
    this._clearHeaders();
    this._setInitialHeaders();
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
    this._clearHeaders();
    this._setInitialHeaders();
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
    this._clearHeaders();
    this._setInitialHeaders();
    this._setAuthHeader(token);
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
    this._clearHeaders();
    this._setInitialHeaders();
    this._setAuthHeader(token);
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
    this._clearHeaders();
    this._setInitialHeaders();
    this._setAuthHeader(token);
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
    this._clearHeaders();
    this._setInitialHeaders();
    this._setAuthHeader(token);
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
  public async forgotPassword(email: string): Promise<ForgotPassResponse> {
    this._clearHeaders();
    this._setInitialHeaders();
    try {
      const res = await fetch(`${API_URL}` + "/user/forgotPassword", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: this.headers,
      });
      if (res.status !== 200) {
        throw new Error("[ERROR]: UNEXPECTED STATUS" + res.status);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      const err = error as Error;
      return {
        done: void 0,
        error: err.message,
      };
    }
  }
  public async changePassword(
    resetToken: string,
    newPassword: string
  ): Promise<ChangePasswordResponse> {
    this._clearHeaders();
    this._setInitialHeaders();
    this._setAuthHeader(resetToken);
    try {
      const res = await fetch(`${API_URL}` + "/user/changePassword", {
        method: "PUT",
        body: JSON.stringify({ newPassword }),
        headers: this.headers,
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      const err = error as Error;
      return {
        error: `There was a problem with this change password request! ${err.message}`,
      };
    }
  }
  public async changeThemePref(
    token: string,
    themePref: string
  ): Promise<ChangeThemePrefResponse> {
    this._clearHeaders();
    this._setInitialHeaders();
    this._setAuthHeader(token);
    try {
      const res = await fetch(`${API_URL}` + "/user/changeThemePref", {
        method: "PUT",
        body: JSON.stringify({ themePref }),
        headers: this.headers,
      });
      const data = await res.json();
      return {
        themePref: data.themePref,
        error: void 0,
      };
    } catch (error) {
      const err = error as Error;
      return {
        error: err.message,
      };
    }
  }
}

export const api = new ApiService();
