import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_user_join" })
export class GuildMemberModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", nullable: false, name: "guild_id" })
  guild_id: number;

  @Column({ type: "bigint", nullable: false, name: "user_id" })
  user_id: number;
}
