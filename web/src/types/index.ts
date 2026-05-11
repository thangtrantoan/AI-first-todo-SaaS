export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}
