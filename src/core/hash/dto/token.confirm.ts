import { TokenType } from 'src/core/hash/enums/token.type';

export interface TokenConfirm {
  sub: string;
  email: string;
  type: TokenType;
  session: string;
}
