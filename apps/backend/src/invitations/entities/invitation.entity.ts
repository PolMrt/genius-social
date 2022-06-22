import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InvitationStates } from "../enum/invitation-states.enum";
import { ConnectionTypes } from "../../connected-accounts/enum/connection-types.enum";
import { User } from "../../users/entities/user.entity";
import { Space } from "../../spaces/entities/space.entity";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uniqueId: string;

  @Column({
    nullable: false,
    default: ConnectionTypes.instagram,
  })
  accountType: ConnectionTypes;

  @Column({ nullable: false })
  identifier: string;

  @Column({ nullable: false, default: InvitationStates.waiting })
  state: InvitationStates;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Space, (space) => space.invitations)
  @JoinTable()
  space: Space;
}
