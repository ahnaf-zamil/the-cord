import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { GuildModel } from "./guild.model";

@Entity({ name: "users" })
export class UserModel extends BaseEntity {
  @PrimaryColumn({ type: "bigint" })
  id: number;

  @Column({ length: 30, nullable: false, unique: true })
  handle: string;

  @Column({ length: 30, nullable: false })
  username: string;

  @Column({ length: 300, nullable: false, unique: true })
  email: string;

  @Column({ type: "text", nullable: false })
  password: string;

  @ManyToMany(() => GuildModel, (guild) => guild.members, { cascade: true })
  @JoinTable({ name: "user_guild_join" })
  guilds: GuildModel[];

  public toJSON(): object {
    return {
      id: this.id.toString(),
      handle: this.handle,
      username: this.username,
      email: this.email,
    };
  }
}
