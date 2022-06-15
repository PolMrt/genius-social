import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.spaces)
  users: User[];
}
