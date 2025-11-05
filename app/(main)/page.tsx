"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/slices/user/store";
import React from "react";

function Home() {
 const state = useUserStore((state) => state);
 const {accessToken} = state;
  return (
    <div className="bg-black min-h-screen ">
      <Input
        placeholder="Email"
        className="border border-white bg-black text-white "
      />
      
    </div>
  );
}

export default Home;
