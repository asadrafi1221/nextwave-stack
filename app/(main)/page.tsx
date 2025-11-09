"use client";

import { useUserStore } from "@/store/slices/user/store";
import React from "react";
import { Button, Input, Switch } from "@/components/global";
import Tooltip from "@/components/global/Tooltip";
import Badge from "@/components/global/Badge";
import Card from "@/components/global/Card";
import Accordion from "@/components/global/Accordion";
import { Table } from "@/components/global/ThemeTable/Table";

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
      <div className="mt-20">
        <Tooltip
          content={"kina mara"}
          side="bottom"
          align="center"
          animation="retro"
        >
          <p className="bg-red-900 text-white inline-block">
            {"Ui Components Updated"}
          </p>
        </Tooltip>
        <Badge variant="outline">Default</Badge>
        <Card className="">
          <Card.Header>
            <p>Header</p>
          </Card.Header>
          <Card.Content>
            <p>Content</p>
          </Card.Content>
          <Card.Footer>
            <p>Footer</p>
          </Card.Footer>
        </Card>

        

        <div className="px-44 mt-20 pb-20">
          <Table
            data={[
              {
                name: "John Doe",
                age: 30,
                email: "john.doe@example.com",
              },
              {
                name: "Jane Doe",
                age: 25,
                email: "jane.doe@example.com",
              },
              {
                name: "John Doe",
                age: 30,
                email: "john.doe@example.com",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
