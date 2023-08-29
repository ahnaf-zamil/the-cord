import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { ChannelModel } from "./channel.model";
import { UserModel } from "./user.model";

@Entity({ name: "guilds" })
export class GuildModel extends BaseEntity {
  @PrimaryColumn({ type: "bigint" })
  id: number;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ type: "bigint", nullable: false })
  ownerId: number;

  @OneToMany(() => ChannelModel, (channel) => channel.guild)
  channels: ChannelModel[];

  @ManyToMany(() => UserModel, (member) => member.guilds)
  members: UserModel[];

  public toJSON(): object {
    return {
      id: this.id.toString(),
      name: this.name,
      owner_id: this.ownerId,
    };
  }
}
