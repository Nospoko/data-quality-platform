import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DataCheck } from './DataCheck';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  exam_uid: string;

  @Column({ type: 'text', nullable: true })
  dataset_name: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'text' })
  label: string;

  @Column({ type: 'int' })
  index: number;

  @CreateDateColumn({ type: 'timestamp', name: 'time' })
  time: Date;

  @OneToMany(() => DataCheck, (dataCheck) => dataCheck.record)
  dataChecks: DataCheck[];
}
