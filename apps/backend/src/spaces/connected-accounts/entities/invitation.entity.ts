import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../../users/entities/user.entity";
import { Space } from "../../entities/space.entity";
import { InvitationStates } from "../enum/invitation-states.enum";
import { InvitationTypes } from "../enum/invitation-types.enum";

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Space)
  @JoinColumn()
  space: Space;
}
