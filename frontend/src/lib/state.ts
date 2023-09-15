import { create } from "zustand";
import { IAuthedUser } from "./types";
import { Socket } from "socket.io-client";

interface AuthState {
  user: IAuthedUser | null;
  setUser: (user: IAuthedUser) => void;
}

interface AppState {
  selectedGuildId: string | null;
  setSelectedGuild: (guildId: string) => void;

  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: IAuthedUser) => set((_) => ({ user })),
}));

export const useChannelStore = create<{
  selectedChannels: {
    [guildId: string]: string;
  };
  setSelectedChannelForGuild: (guildId: string, channelId: string) => void;
}>();

export const useAppStore = create<AppState>((set) => ({
  selectedGuildId: null,
  setSelectedGuild: (guildId) =>
    set((state) => ({ ...state, selectedGuildId: guildId })),

  socket: null,
  setSocket: (socket) => set((state) => ({ ...state, socket })),
}));
