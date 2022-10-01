import { UserEntity } from '../../../modules/main/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserInterface } from '../interfaces/user.interface';
import { AuthUserRole } from '../types/auth-user.roles';
import { FirebaseIdentityEntity } from './firebase-identity.entity';

@Entity()
export class AuthUserEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false, array: true, default: '{}' })
  roles?: AuthUserRole[];

  @Column('text', { nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Profiles
  @OneToOne(() => UserEntity, (user) => user.authUser, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column('string', { nullable: true })
  userId?: string;

  @OneToOne(() => FirebaseIdentityEntity, (o) => o.user)
  firebaseIdentity: FirebaseIdentityEntity;
}
