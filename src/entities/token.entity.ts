import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TokenReason } from './enum';
import { User } from './user.entity';

@Entity({
  name: 'tokens',
})
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false})
  @JoinColumn({name:"userId", referencedColumnName : 'id'})
  user: User;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  token: string;

  @Column({
    type: 'enum',
    enum: TokenReason,
  })
  reason: TokenReason;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expiry_date: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_revoked: boolean;

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
