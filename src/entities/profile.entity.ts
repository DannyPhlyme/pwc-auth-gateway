import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Gender, MaritalStatus } from './enum';
import { Address } from './address.entity';
import { ProfileGallery } from './profile-gallery.entity';
import { User } from 'src/entities/user.entity';

@Entity({
  name: 'profiles',
})
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ProfileGallery, (gallery) => gallery.profile)
  galleries: ProfileGallery[]

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string

  @OneToOne(() => User)
   @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  occupation: string;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    default: MaritalStatus.SINGLE,
    nullable: true,
  })
  marital_status: MaritalStatus;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  hobbies: string;

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
