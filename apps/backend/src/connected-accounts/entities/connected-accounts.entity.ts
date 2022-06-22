import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Space } from "../../spaces/entities/space.entity";
import { ConnectionTypes } from "../enum/connection-types.enum";

@Entity()
export class ConnectedAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    default: ConnectionTypes.instagram,
  })
  accountType: ConnectionTypes;

  @Column({ nullable: false })
  identifier: string;

  @Column()
  expires: Date;

  @Column()
  name: string;

  @Column({ length: 2000 })
  profilePictureUrl: string;

  @Column({ select: false })
  token: string;

  @ManyToOne(() => Space, (space) => space.connectedAccounts)
  @JoinTable()
  space: Space;
}
