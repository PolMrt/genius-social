import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Space } from "../../spaces/entities/space.entity";
import { InvitationStates } from "../enum/invitation-states.enum";
import { InvitationTypes } from "../enum/invitation-types.enum";

@Entity()
export class ConnectedAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    default: InvitationTypes.instagram,
  })
  accountType: InvitationTypes;

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
