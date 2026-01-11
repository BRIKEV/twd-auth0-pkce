import type { AxiosError } from "axios";
import { api } from "./client";

export type User = {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
};

export async function getSession() {
  try {
    const { data } = await api.get<User>("/api/me");
    return { isAuthenticated: true, user: data } as const;
  } catch (err) {
    const error = err as AxiosError;
    if (error?.response?.status === 401) {
      return { isAuthenticated: false, user: undefined } as const;
    }
    throw err;
  }
}
