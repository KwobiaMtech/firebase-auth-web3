import { Column, Entity, OneToOne } from 'typeorm';

import { AuthUserEntity } from '../../auth/entities/auth-user.entity';
import { AbstractEntity } from './abstract-entity';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column('date', { nullable: true })
  dateOfBirth?: Date;

  @Column('int', { nullable: true })
  idNumber?: number;

  @OneToOne(() => AuthUserEntity, (auth) => auth.user)
  authUser: AuthUserEntity;
}
