import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @OneToMany(() => User, user => user.role)
  user: User

  @OneToMany(() => Permission, permission => permission.role)
  permissions: Permission[]

   @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

   @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  active: boolean

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