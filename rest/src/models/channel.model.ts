import { Entity, BaseEntity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { GuildModel } from "./guild.model";

@Entity({ name: "channels" })
export class ChannelModel extends BaseEntity {
  @PrimaryColumn({ type: "bigint" })
  id: number;

  @Column({ length: 30, nullable: false })
  name: string;

  @Column({ nullable: false })
  type: number;

  @Column({ type: "bigint", nullable: false })
  guildId: string;

  @ManyToOne(() => GuildModel, (guild) => guild.channels)
  guild: GuildModel;

  public toJSON(): object {
    return {
      id: this.id.toString(),
      name: this.name,
      type: this.type,
      guild_id: this.guildId.toString(),
    };
  }
}
