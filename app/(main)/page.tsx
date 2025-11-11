"use client";

import { useUserStore } from "@/store/slices/user/store";
import React from "react";
import { Button, Input, Switch } from "@/components/global";
import { Table } from "@/components/global/ThemeTable/Table";

function Home() {
  const state = useUserStore((state) => state);
  return (
    <>
      In Progess ..... 
    </>
  );
}

export default Home;
