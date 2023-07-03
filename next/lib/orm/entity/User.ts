import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { DataCheck } from './DataCheck';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  firstName: string | null;

  @Column({ type: 'text', nullable: true })
  lastName: string | null;

  @Column({ type: 'text', nullable: true })
  image: string | null;

  @OneToMany(() => DataCheck, (dataCheck) => dataCheck.user)
  dataChecks: Relation<DataCheck>[];
}
