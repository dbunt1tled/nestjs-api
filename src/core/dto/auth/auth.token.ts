export interface AuthToken {
  iss: number;
  email: string;
  roles: string[];
  iat: number;
  session: string;
  exp: number;
}
