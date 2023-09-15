import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { GuildView } from "./GuildView";
import { IGatewayGuild } from "../lib/types";
import { AxiosError } from "axios";
import { httpClient } from "../lib/http";
import { useAppStore } from "../lib/state";

const fetchAuthToken = async () => {
  try {
    const resp = await httpClient.post("gateway/auth");
    console.log("Fetched auth token");
    return resp.data;
  } catch (e) {
    const err = e as AxiosError;
    if (err.response) {
      console.log(err.status);
    }
    console.log(err.config);
    return null;
  }
};

export const MainView: React.FC = () => {
  const [gatewayReady, setGatewayReady] = useState<boolean>(false);

  const appStore = useAppStore();

  const [guilds, setGuilds] = useState<Array<IGatewayGuild>>([]);
  // const [socket, setSocket] = useState<Socket | null>(null);

  const startConnection = async () => {
    const authToken = await fetchAuthToken();
    if (authToken) {
      if (appStore.socket) {
        return;
      }
      let sock = io("http://localhost:3000", {
        auth: authToken!,
      });

      sock.onAny(console.log);

      sock.on("connect", () => {
        console.log("Connected to gateway");
      });

      sock.on("GUILD_CREATE", (guild) => {
        setGuilds((guilds) => [...guilds, guild]);
      });

      sock.on("CLIENT_READY", () => {
        setGatewayReady(true);
      });

      appStore.setSocket(sock);
    }
  };

  useEffect(() => {
    startConnection();
  }, []);

  const getGuild = (id: string) => guilds.find((g) => g.id === id);

  const switchGuild = (guildId: string) => {
    appStore.setSelectedGuild(guildId);
  };

  return gatewayReady ? (
    <>
      <section className="w-20 h-full py-4 flex flex-col gap-2 items-center">
        {guilds.map((guild) => (
          <div
            onClick={() => switchGuild(guild.id)}
            className="bg-[#1a1a1a] w-16 h-16 rounded-md hover:rounded-xl hover:cursor-pointer flex items-center justify-center border border-transparent hover:border-white"
          >
            <h2>{guild.name.charAt(0)}</h2>
          </div>
        ))}
      </section>
      <section className="p-4 flex">
        {appStore.selectedGuildId ? (
          <GuildView guild={getGuild(appStore.selectedGuildId)!} />
        ) : null}
      </section>
    </>
  ) : (
    <p>Starting connection</p>
  );
};
