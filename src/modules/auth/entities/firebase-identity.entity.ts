import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { AuthUserEntity } from './auth-user.entity';

@Entity()
export class FirebaseIdentityEntity {
  @PrimaryColumn('text')
  id: string;

  @OneToOne(() => AuthUserEntity, (o) => o.firebaseIdentity)
  @JoinColumn()
  user: AuthUserEntity;

  @RelationId('user')
  readonly userId: string;

  @Column('text', { nullable: true })
  primaryEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
