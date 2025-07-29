import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UsersRole } from '../users-role.enum';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number; // เลขไอดี

  @Column({ nullable: true })
  agencyEVP: string; // หน่วยงาน EVP

  @Column({ nullable: true })
  agencySVP: string; // หน่วยงาน SVP

  @Column({ nullable: true })
  agencyDM: string; // หน่วยงาน DM

  @Column()
  area: string; // พื้นที่

  @Column({ default: false })
  isActive: boolean; // สถานะการใช้งาน

  @Column({
    type: 'enum',
    enum: UsersRole,
    default: UsersRole.USER,
  })
  role: UsersRole; // บทบาทของผู้ใช้ (USER, ADMIN, SUPERADMIN)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
