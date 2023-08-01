import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { Dataset } from './Dataset';
import { Organization } from './Organization';

@Entity('dataset_access')
export class DatasetAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Dataset, (dataset) => dataset.id)
  @JoinColumn({ name: 'dataset_id' })
  dataset: Relation<Dataset>;

  @ManyToOne(() => Organization, (organization) => organization.id)
  @JoinColumn({ name: 'organization_id' })
  organization: Relation<Organization>;
}
