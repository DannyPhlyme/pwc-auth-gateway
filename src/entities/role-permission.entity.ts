import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity({
  name: 'rolePermissions',
})
  
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string
}
