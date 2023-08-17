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
  UNKNOWN = 'unknown',
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

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Record, (record) => record.id)
  @JoinColumn({ name: 'record_id' })
  record: Relation<Record>;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
