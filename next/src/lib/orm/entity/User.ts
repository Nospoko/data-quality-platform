import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { DataCheck } from './DataCheck';
import { OrganizationMembership } from './OrganizationMembership';

import { UserRole } from '@/types/common';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  firstName: string | null;

  @Column({ type: 'text', nullable: true })
  lastName: string | null;

  @Column({ type: 'text', nullable: true })
  image: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @OneToMany(() => DataCheck, (dataCheck) => dataCheck.user)
  dataChecks: Relation<DataCheck>[];

  @OneToMany(
    () => OrganizationMembership,
    (membership) => membership.organization,
  )
  organizationMemberships: Relation<OrganizationMembership>[];
}
