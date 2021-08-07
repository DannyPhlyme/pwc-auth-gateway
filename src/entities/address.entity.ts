import { Entity, Column, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm';

@Entity({
  name: 'addresses',
})
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  address2: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  postal_code: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  phone: bigint;

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
