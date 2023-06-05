import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { AutoMap } from '@automapper/classes';

@Entity()
export class User {

  @PrimaryColumn()
  @AutoMap()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  @AutoMap()
  role: Role;

  @ManyToOne(() => User, user => user.subordinates)
  boss?: User;

  @OneToMany(() => User, user => user.boss)
  subordinates?: User[];

}