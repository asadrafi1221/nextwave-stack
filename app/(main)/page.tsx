"use client";

import { useUserStore } from "@/store/slices/user/store";
import React from "react";
import { Button, Input, Switch } from "@/components/global";

function Home() {
  const state = useUserStore((state) => state);
  const { accessToken } = state;
  return (
    <>
      <div className="bg-black text-white">
        <p>Helo</p>
        <Input placeholder="Email" />
        <Button variant="default">Button</Button>
        <Switch />
      </div>
      <p>{"asad khan"}</p>
    </>
  );
}

export default Home;
