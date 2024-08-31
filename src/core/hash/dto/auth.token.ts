import { TokenType } from 'src/core/hash/enums/token.type';

export interface AuthToken {
  sub: string;
  email: string;
  type: TokenType;
  session: string;
}
