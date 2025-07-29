import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'Admin' })
  role: 'Admin' | 'SuperAdmin';

  @Column({ default: true })
  active: boolean;
}
