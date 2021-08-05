import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'login_histories',
})
export class LoginHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.histories)
  user: User;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  ip: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  login_date: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  logout_date: Date;

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
