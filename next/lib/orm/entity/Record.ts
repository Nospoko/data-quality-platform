import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';

import { DataCheck } from './DataCheck';

@Entity('records')
export class Record {
  @CreateDateColumn({ type: 'timestamp', name: 'time' })
  time: Date;

  @Column({ type: 'text' })
  label: string;

  @Column({ type: 'bigint' })
  position: number;

  @PrimaryColumn({ type: 'bigint', unique: true })
  index: number;

  @Column({ type: 'text' })
  exam_uid: string;

  @OneToMany(() => DataCheck, (dataCheck) => dataCheck.record)
  dataChecks: Relation<DataCheck>[];
}
