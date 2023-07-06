import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Record } from './Record';
import { User } from './User';

export enum Choice {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CUSTOM = 'custom',
}

@Entity('data_checks')
export class DataCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Choice,
    nullable: true,
  })
  choice: Choice;

  @ManyToOne(() => Record, (record) => record.index)
  @JoinColumn({ name: 'record_id' })
  record: Relation<Record>;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
