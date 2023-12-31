import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { DataCheck } from './DataCheck';
import { OrganizationMembership } from './OrganizationMembership';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

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

  @OneToMany(() => OrganizationMembership, (membership) => membership.user)
  organizationMemberships: Relation<OrganizationMembership>[];

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
