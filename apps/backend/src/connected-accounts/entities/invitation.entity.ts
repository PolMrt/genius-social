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
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uniqueId: string;

  @Column({
    nullable: false,
    default: InvitationTypes.instagram,
  })
  accountType: InvitationTypes;

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
