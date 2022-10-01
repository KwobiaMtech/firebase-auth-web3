import { Logger, Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import express from 'express';
import { GlobalConfig } from 'rxjs';
import { globalConfig } from 'src/config';
import { EntityManager } from 'typeorm';
import { AuthUserEntity } from '../entities/auth-user.entity';
import { FirebaseIdentityEntity } from '../entities/firebase-identity.entity';
import * as admin from 'firebase-admin';
import { Strategy } from 'passport-strategy';
import { ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { v4 as uuidv4 } from 'uuid';
import { safeTransaction } from 'src/utils/typeorm';

type DecodedIdToken = admin.auth.DecodedIdToken;

// Inspired by https://github.com/tfarras/nestjs-firebase-auth/blob/master/src/passport-firebase.strategy.ts
class FirebaseAuthStrategy extends Strategy {
  readonly name = 'firebase';
  protected readonly logger = new Logger('FirebaseStrategy');
  private readonly extractor: JwtFromRequestFunction;

  constructor(
    private opts?: {
      extractor: JwtFromRequestFunction;
    },
  ) {
    super();
    if (!opts.extractor) {
      throw new Error(
        '\n Extractor is not a function. You should provide an extractor. \n Read the docs: https://github.com/tfarras/nestjs-firebase-auth#readme',
      );
    }
    this.extractor = this.opts.extractor;
  }

  async validate(idToken: DecodedIdToken): Promise<any> {
    throw new Error('Not Implemented');
  }

  async authenticate(req: express.Request): Promise<void> {
    const idToken = this.extractor(req);
    if (!idToken) {
      this.fail('Unauthorized', 401);
      return;
    }

    try {
      await admin
        .auth()
        .verifyIdToken(idToken, false)
        .then((res) => this.validateDecodedIdToken(res))
        .catch((err) => {
          this.logger.debug(err);
          console.error(err);
          //this.fail({ err }, 401);
        });
    } catch (e) {
      this.logger.debug(e);
      console.error(e);
      //this.fail(e, 401);
    }
  }

  private async validateDecodedIdToken(decodedIdToken: DecodedIdToken) {
    const result = await this.validate(decodedIdToken);

    if (result) {
      // this.success(result);
    }

    //this.fail('Unauthorized', 401);
  }
}

// TODO Abstract this like the other identity providers
@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  FirebaseAuthStrategy,
  'firebase',
) {
  constructor(
    @Inject(globalConfig.KEY) cfg: GlobalConfig,
    private em: EntityManager,
  ) {
    super({
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: DecodedIdToken) {
    // Only block if sign in provider is password
    if (
      token.firebase.sign_in_provider === 'password' &&
      !token.email_verified
    ) {
      return false;
    }
    const firebaseId = token.sub;
    let identity = await this.em.findOne(FirebaseIdentityEntity, {
      where: { id: firebaseId },
      join: { alias: 'i', innerJoinAndSelect: { user: 'i.user' } },
    });
    // First user creation if not existing on our end
    if (!identity) {
      identity = new FirebaseIdentityEntity();
      identity.id = firebaseId;
      identity.primaryEmail = token.email;

      this.logger.debug(
        `Creating new user from firebase identity: ${JSON.stringify(identity)}`,
      );

      const authUser = await safeTransaction(this.em, async (em) => {
        let authUser = new AuthUserEntity();
        authUser.id = uuidv4();
        authUser = await em.save(authUser, { reload: true });
        identity.user = authUser;
        identity = await em.save(identity, { reload: true });
        identity.user = undefined; // Break circular loop
        authUser.firebaseIdentity = identity;
        return authUser;
      });
      this.logger.debug(
        `Created new user from firebase id ${firebaseId}: ${JSON.stringify(
          authUser,
        )}`,
      );

      return authUser;
    } else {
      return identity.user;
    }
  }
}
