import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { LoginHistory } from './login-history.entity';
import { Status } from './enum';
import { Password } from './password.entity';
import { Token } from './token.entity';
import { ActivityLog } from './activity-logs.entity';
import { Profile } from './profile.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => LoginHistory, (history) => history.user, {
    cascade: ['insert'],
  })
  histories: LoginHistory[];

  @OneToMany(() => Password, (password) => password.user)
  passwords: Password[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => ActivityLog, (activity) => activity.user)
  activities: ActivityLog[];

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @Column({
    type: 'varchar',
    length: 255,
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  last_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.INACTIVE,
  })
  status: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  email_verified: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  referrer_id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  referral_code: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
