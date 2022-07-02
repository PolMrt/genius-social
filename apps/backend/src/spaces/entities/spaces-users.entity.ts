import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Role } from "../enum/roles.enum";
import { Space } from "./space.entity";

@Entity()
export class SpacesUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.spaces)
  user: User;

  @ManyToOne(() => Space, (space) => space.users)
  space: Space;

  @Column({ nullable: false, default: Role.user })
  role: Role;
}
