import { UserCredential } from 'firebase/auth';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { globalConfig, GlobalConfig } from 'src/config';
import { InjectRepository } from 'nestjs-fireorm';
import { BaseFirestoreRepository } from 'fireorm';
import { User } from '../collections/user.collection';
import {
  RegisterDto,
  RegisterOutputDto,
  LoginDto,
  LoginOutputDto,
} from '../dto/auth.dto';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import * as referralCodes from 'referral-codes';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable()
export class FirebaseAuthService {
  private firebaseClient: FirebaseApp;
  constructor(
    @Inject(globalConfig.KEY) private cfg: GlobalConfig,
    @InjectRepository(User)
    private users: BaseFirestoreRepository<User>,
  ) {
    const firebaseAccount = cfg.firebase.admin_cert;
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAccount),
      databaseURL: `https://${firebaseAccount.project_id}.firebaseio.com`,
    });
    this.firebaseClient = initializeApp(cfg.firebase.client_cert);
  }

  async validateIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(token);
  }

  async loginUser(input: LoginDto): Promise<LoginOutputDto> {
    return await this.loginFirebase(input);
  }

  async createUser(input: RegisterDto): Promise<RegisterOutputDto> {
    const firebaseUser = await this.createFirebaseUser(
      input.email,
      input.password,
    );
    const newUser = new User();
    newUser.id = firebaseUser.uid;
    newUser.dateOfBirth =
      typeof input.dateOfBirth === 'string'
        ? new Date(input.dateOfBirth)
        : input.dateOfBirth;
    newUser.idNumber = Number(this.generateCode(6));
    console.log('newUser', newUser);
    return await this.users.create(newUser);
  }

  async createFirebaseUser(
    email: string,
    password: string,
  ): Promise<UserRecord | any> {
    try {
      return admin
        .auth()
        .createUser({
          email: email,
          password: password,
        })
        .catch((error) => {
          throw new HttpException(error, 500);
        });
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async loginFirebase(input: LoginDto): Promise<LoginOutputDto | any> {
    const auth = getAuth(this.firebaseClient);
    const login: UserCredential = await signInWithEmailAndPassword(
      auth,
      input.email,
      input.password,
    ).catch((error) => {
      throw new HttpException(error, 500);
    });
    return {
      accessToken: await login.user.getIdToken(),
      refreshToken: login.user.refreshToken,
    };
  }

  generateCode(length: number): string {
    return referralCodes.generate({
      length,
      count: 1,
      charset: '0123456789',
    })[0];
  }
}
