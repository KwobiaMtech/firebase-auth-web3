import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { AuthUserEntity } from './auth-user.entity';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => AuthUserEntity)
  user: AuthUserEntity;

  @RelationId('user')
  readonly userId: string;

  @Column('timestamp without time zone')
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
