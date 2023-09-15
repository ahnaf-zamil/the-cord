import React from "react";

export const LoginForm: React.FC<{
  callback: (e: React.FormEvent<HTMLFormElement>) => void;
}> = ({ callback }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        callback(e);
      }}
    >
      <div>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
      </div>
      <button
        className="bg-[#1a1a1a] rounded-md px-3 py-2 border border-transparent hover:border-blue-500"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};
