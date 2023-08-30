import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "guild_user_join" })
export class GuildMemberModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", nullable: false })
  guildId: number;

  @Column({ type: "bigint", nullable: false })
  userId: number;
}
