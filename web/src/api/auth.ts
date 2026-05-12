import client from "./client";
import type { AuthToken, User } from "@/types";

export const authApi = {
  register: (email: string, password: string) =>
    client.post<AuthToken>("/auth/register", { email, password }).then((r) => r.data),

  login: (email: string, password: string) =>
    client.post<AuthToken>("/auth/login", { email, password }).then((r) => r.data),

  me: () => client.get<User>("/auth/me").then((r) => r.data),

  forgotPassword: (email: string) =>
    client.post<{ message: string }>("/auth/forgot-password", { email }).then((r) => r.data),
};
