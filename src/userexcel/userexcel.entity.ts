import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('user_excel')
export class UserExcel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  agencyEVP: string;

  @Column({ nullable: true })
  agencySVP: string;

  @Column({ nullable: true })
  agencyDM: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  yearWork: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
