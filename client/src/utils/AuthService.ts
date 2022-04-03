class AuthService {
  public getToken(): string | null {
    let decrypted = "";
    // Retrieves the user token from localStorage
    const token = localStorage.getItem("id_token");
    if (!token) return null;
    //will be encrypted lets decrypt it
    if (typeof window === "undefined" && typeof Buffer !== "undefined") {
      decrypted = Buffer.from(token as string, "base64").toString();
    } else {
      decrypted = atob(token);
    }
    if (decrypted) return decrypted;
    else return null;
  }

  public setToken(token: string): void {
    // Saves user token to localStorage
    let encrypted = "";
    //encrypt token before setting to storage
    if (typeof window === "undefined" && typeof Buffer !== "undefined") {
      encrypted = Buffer.from(token).toString("base64");
      localStorage.setItem("id_token", encrypted);
    } else {
      encrypted = btoa(token);
      localStorage.setItem("id_token", encrypted);
    }
    return;
  }

  public clearToken(): void | Error {
    const token = this.getToken();
    if (token) {
      localStorage.removeItem("id_token");
    } else return new Error("could not clear token, was undefined or null");
  }
}

export default new AuthService();
