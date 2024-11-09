"use client";
import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardFooter,
  Image,
} from "@nextui-org/react";
import Link from "next/link";

function CategoryCard({ item }) {
  return (
    <Card key={item.id} isFooterBlurred radius="lg" className="border-none">
      <Image
        removeWrapper
        alt="Woman listing to music"
        className="w-full h-full object-contain p-4"
        src={item.icon}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 flex-col lg:flex-row gap-1">
        <p className="text-tiny">{item.name}</p>
        <ButtonGroup>
          <Button
            className="text-tiny text-white bg-black/20"
            variant="flat"
            color="primary"
            radius="lg"
            size="sm"
            href={`/${item.slug}/easy`}
            as={Link}
          >
            Easy
          </Button>
          <Button
            className="text-tiny text-white bg-black/20"
            variant="flat"
            color="primary"
            radius="lg"
            size="sm"
            href={`/${item.slug}/hard`}
            as={Link}
          >
            Hard
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default CategoryCard;
