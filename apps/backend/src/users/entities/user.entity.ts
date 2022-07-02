import { Space } from "./../../spaces/entities/space.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SpacesUsers } from "../../spaces/entities/spaces-users.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mail: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ nullable: false })
  activate: boolean;

  @OneToMany(() => SpacesUsers, (spaceUsers) => spaceUsers.user)
  spaces: SpacesUsers[];

  // @JoinTable()
  // @ManyToMany(() => Space, (space) => space.users)
  // spaces: Space[];

  @ManyToOne(() => Space, { eager: true })
  favoritSpace: Space;
}
