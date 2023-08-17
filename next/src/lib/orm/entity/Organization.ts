import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { DatasetAccess } from './DatasetAccess';
import { OrganizationMembership } from './OrganizationMembership';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(
    () => OrganizationMembership,
    (membership) => membership.organization,
  )
  organizationMemberships: Relation<OrganizationMembership>[];

  @OneToMany(() => DatasetAccess, (datasetAccess) => datasetAccess.organization)
  datasetAccess: Relation<DatasetAccess>[];
}
