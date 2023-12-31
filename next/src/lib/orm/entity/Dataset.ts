import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('datasets')
export class Dataset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;
}
