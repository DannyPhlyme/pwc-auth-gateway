import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { Status } from './enum';
import { User } from './user.entity';
import * as bcrypt from "bcrypt"

@Entity({
  name: 'passwords',
})
export class Password {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.passwords)
  user: User;

  @Column({
    type: 'varchar',
    length: 255,
  })
  salt: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  hash: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: string;

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

  @BeforeInsert()
  async hashPassword() {
    this.hash = await bcrypt.hash(this.hash, 10);
  }

  async comparePassword(attempt: string){
    return await bcrypt.compare(attempt, this.hash);
  };

  @BeforeUpdate()
  updateTimestamp() {
    this.updated_at = new Date();
  }
}
