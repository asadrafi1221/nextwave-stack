"use client";

import { useUserStore } from "@/store/slices/user/store";
import React from "react";
import { Button, Input, Switch } from "@/components/global";
import Tooltip from "@/components/global/Tooltip";
import Badge from "@/components/global/Badge";
import Card from "@/components/global/Card";
import Accordion from "@/components/global/Accordion";

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
          content={<p>Tooltip</p>}
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

        <div className="px-20">
          <Accordion
            className="mt-20"
            type="multiple"
            options={[
              {
                title: "Accordion 1",
                content: <p>Content 1</p>,
              },
              {
                title: "Accordion 2",
                content: (
                  <div className="flex flex-col gap-5">
                    <p>heli</p>
                    <p>juuu</p>
                  </div>
                ),
              },
              {
                title: "Accordion 3",
                content: <p>Content 3</p>,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default Home;
