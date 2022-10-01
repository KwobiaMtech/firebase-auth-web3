import { Injectable } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseAuthService) {}
}
