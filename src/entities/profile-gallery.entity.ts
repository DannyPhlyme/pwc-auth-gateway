import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import { ImageType, Status } from './enum';
import { Profile } from './profile.entity';

@Entity({
  name: 'profile_galleries',
})
export class ProfileGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.galleries)
  profile: Profile;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  image: string;

  @Column({
    type: 'enum',
    enum: ImageType,
    default: ImageType.PNG,
  })
  type: ImageType;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

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
