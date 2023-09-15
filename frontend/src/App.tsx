import { useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { useAuthStore } from "./lib/state";
import { httpClient } from "./lib/http";
import { AxiosError } from "axios";
import { MainView } from "./views/MainView";

const fetchCurrentUser = async () => {
  try {
    const resp = await httpClient.get("users/@me");
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

const loginUser = async (email: string, password: string) => {
  try {
    const resp = await httpClient.post("users/login", {
      email,
      password,
    });
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

export const App = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    (async () => {
      const user = await fetchCurrentUser();
      if (user) {
        authStore.setUser(user);
      }
    })();
  }, []);

  return (
    <main className="flex h-screen">
      {!authStore.user ? (
        <>
          <LoginForm
            callback={async (e) => {
              const target = e.target as typeof e.target & {
                email: { value: string };
                password: { value: string };
              };
              await loginUser(target.email.value, target.password.value);
              window.location.reload();
            }}
          />
          <p>Keep dev tools console open</p>
        </>
      ) : (
        <MainView />
      )}
    </main>
  );
};
