"use client";

import { Button, Input } from "@heroui/react";
import React, { useState } from "react";

import { useSaveDeviceMutation } from "@/lib/api/game-api";

function LeaderboardForm({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [saveDevice, { isLoading }] = useSaveDeviceMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = username;

    await saveDevice({ username: value }).unwrap();
    setUsername("");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-4">
      <Input
        label="Username"
        id="username"
        value={username}
        isDisabled={isLoading}
        required
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button type="submit" isDisabled={isLoading}>
        {isLoading ? "Joining..." : "Join"}
      </Button>
    </form>
  );
}

export default LeaderboardForm;
