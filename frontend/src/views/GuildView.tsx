import { useEffect, useState } from "react";
import { IGatewayGuild } from "../lib/types";

export const GuildView: React.FC<{ guild: IGatewayGuild }> = ({ guild }) => {
  const [selectedChannels, setSelectedChannels] = useState<{
    [guildId: string]: string;
  }>({});

  useEffect(() => {
    let selectedChannel = selectedChannels[guild.id];
    if (!selectedChannel) {
      setSelectedChannels((state) => {
        state[guild.id] = guild.channels[0].id;
        return { ...state };
      });
    }
  }, [guild]);

  return (
    <div className="border-l h-full border-gray-500 flex">
      <section className="bg-[#1b1b1b] h-full">
        <h1 className="font-semibold text-lg text-center py-8">{guild.name}</h1>
        <ul className="gap-2 flex flex-col py-4">
          {guild.channels.map((channel) => (
            <li
              onClick={() =>
                setSelectedChannels((state) => {
                  state[guild.id] = channel.id;
                  return { ...state };
                })
              }
              className={
                "hover:bg-[#242424] text-center rounded-xl w-52 py-2 mx-2 cursor-pointer " +
                (selectedChannels[guild.id] == channel.id ? "bg-[#242424]" : "")
              }
            >
              # {channel.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
