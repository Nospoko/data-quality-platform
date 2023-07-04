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
  @CreateDateColumn({ type: 'timestamp', name: 'time', nullable: true })
  time: Date;

  @Column({ type: 'text', nullable: true })
  label: string;

  @Column({ type: 'bigint', nullable: true })
  position: number;

  @PrimaryColumn({ type: 'text', nullable: false })
  exam_uid: string;

  @OneToMany(() => DataCheck, (dataCheck) => dataCheck.record)
  dataChecks: Relation<DataCheck>[];
}
