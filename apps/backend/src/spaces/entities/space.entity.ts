import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ConnectedAccount } from "../../connected-accounts/entities/connected-accounts.entity";
import { Invitation } from "../../connected-accounts/entities/invitation.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.spaces)
  users: User[];

  @OneToMany(() => Invitation, (invitation) => invitation.space)
  invitations: Invitation[];

  @OneToMany(
    () => ConnectedAccount,
    (connectedAccount) => connectedAccount.space
  )
  connectedAccounts: ConnectedAccount[];
}
