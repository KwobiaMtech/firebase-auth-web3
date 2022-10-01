import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordEncoderService {
  encodePassword(password: string) {
    const rounds = process.env.NODE_ENV === 'test' ? 1 : 10;
    return bcrypt.hashSync(password, rounds);
  }

  verifyPassword(plain: string, encoded: string) {
    return bcrypt.compareSync(plain, encoded);
  }
}
