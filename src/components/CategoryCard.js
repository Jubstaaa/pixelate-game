"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";

const CategoryCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`overflow-hidden ${!item.isActive && "opacity-40"}`}>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={item.icon}
              alt={item.name}
              width={300}
              height={300}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        </CardContent>
        <CardFooter className="bg-secondary/10 p-4 flex justify-center gap-4">
          {item.isActive && (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href={`/${item.slug}/easy`}>
                  <span className="flex items-center">Easy</span>
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/${item.slug}/hard`}>
                  <span className="flex items-center">Hard</span>
                </Link>
              </Button>
            </>
          )}

          {!item.isActive && (
            <Badge variant="outline" className="mb-2">
              Coming Soon
            </Badge>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
