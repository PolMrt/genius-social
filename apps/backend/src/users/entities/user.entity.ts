import { Space } from "./../../spaces/entities/space.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mail: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany(() => Space, (space) => space.users, {
    eager: true,
    cascade: true,
  })
  spaces: Space[];
}
