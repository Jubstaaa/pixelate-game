"use client";

import { Button, Input } from "@heroui/react";
import { addToast } from "@heroui/react";
import React, { useState } from "react";

import { useSaveDeviceMutation } from "@/lib/api/game-api";

function LeaderboardForm({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [saveDevice, { isLoading }] = useSaveDeviceMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = username.trim();

    if (!value) {
      addToast({ title: "Error", description: "Please enter a username.", color: "danger" });
      return;
    }

    await saveDevice({ username: value }).unwrap();
    setUsername("");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm items-center gap-1.5">
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          id="username"
          value={username}
          isDisabled={isLoading}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" isDisabled={isLoading}>
          {isLoading ? "Joining..." : "Join"}
        </Button>
      </div>
    </form>
  );
}

export default LeaderboardForm;
