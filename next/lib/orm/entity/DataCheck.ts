import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './User';
import { Record } from './Rectord';

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

  @ManyToOne(() => Record, (record) => record.exam_uid)
  @JoinColumn({ name: 'record_id' })
  record: Relation<User>;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
