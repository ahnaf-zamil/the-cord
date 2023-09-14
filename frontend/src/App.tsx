import { io } from "socket.io-client";

const events = ["GUILD_CREATE", "CLIENT_READY"];

export const App = () => {
  const login = async () => {
    const resp = await fetch("http://localhost:5000/users/login", {
      method: "POST",
      body: JSON.stringify({
        email: "ahnaf@ahnafzamil.com",
        password: "amogus123",
      }),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.status === 200) {
      console.log("Logged in successfully");
      return;
    } else {
      throw Error("Login error");
    }
  };

  const fetchAuthToken = async () => {
    const resp = await fetch("http://localhost:5000/gateway/auth", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.status === 200) {
      console.log("Fetched auth token");
      return await resp.json();
    } else {
      throw Error("Auth token fetch error");
    }
  };

  const startConnection = async () => {
    await login();
    const authToken = await fetchAuthToken();
    if (authToken) {
      const socket = io("http://localhost:3000", {
        auth: authToken!,
      });

      socket.on("connect", () => {
        console.log("Connected to gateway");
      });

      events.forEach((ev) =>
        socket.on(ev, (data) => {
          console.log(ev, data || "no data");
        })
      );
    }
  };

  return (
    <>
      <button onClick={startConnection}>Start connection</button>
      <p>Keep dev tools console open</p>
    </>
  );
};
