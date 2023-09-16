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
  record_id: string;

  @Column({ type: 'text', nullable: true })
  dataset_name: string;

  @Column({ type: 'json' })
  metadata: any;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @OneToMany(() => DataCheck, (dataCheck) => dataCheck.record)
  dataChecks: DataCheck[];
}
