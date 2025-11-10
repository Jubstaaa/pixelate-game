"use client";
import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ scale: item.isActive && 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`overflow-hidden ${!item.isActive && "cursor-not-allowed opacity-40"}`}>
        <CardBody className="flex flex-col items-center p-6">
          <div className="relative mb-4 h-24 w-24">
            <Image
              src={item.icon}
              alt={`${item.name} Logo`}
              width={300}
              height={300}
              className="h-full w-full object-contain"
            />
          </div>
          <h3 className="mb-2 text-lg font-semibold">{item.name}</h3>
        </CardBody>
        <CardFooter className="bg-secondary/10 flex justify-center gap-4 p-4">
          {item.isActive && (
            <>
              <Button as={Link} href={`/${item.slug}/easy`} asChild size="sm" variant="bordered">
                <span className="flex items-center">Easy</span>
              </Button>
              <Button as={Link} href={`/${item.slug}/hard`} asChild size="sm" variant="bordered">
                <span className="flex items-center">Hard</span>
              </Button>
            </>
          )}

          {!item.isActive && (
            <Chip variant="bordered" className="mb-2">
              Coming Soon
            </Chip>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
