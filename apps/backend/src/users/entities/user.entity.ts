import { Space } from "./../../spaces/entities/space.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Invitation } from "../../connected-accounts/entities/invitation.entity";

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
