import dbConf from "../config/db.config";
import { UserModel } from "../models/user.model";
import { ChannelModel } from "../models/channel.model";
import { DataSource, Repository } from "typeorm";
import { GuildModel } from "../models/guild.model";
import { GuildMemberModel } from "../models/guild_member.model";

interface IRepositories {
  [x: string]: Repository<any>;
}

interface IDB {
  dataSource: DataSource;
  repos: IRepositories;
}

const db: IDB = {
  dataSource: new DataSource({
    ...dbConf,
    entities: [UserModel, GuildModel, ChannelModel, GuildMemberModel],
  }),
  repos: {},
};

db.repos.user = db.dataSource.getRepository(UserModel);
db.repos.guild = db.dataSource.getRepository(GuildModel);
db.repos.channel = db.dataSource.getRepository(ChannelModel);
db.repos.guildMember = db.dataSource.getRepository(GuildMemberModel);

export default db;
