export interface User {
  id: string;
  email: string;
  username?: string;
}

export interface AuthContextValue {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}
