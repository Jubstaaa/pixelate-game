"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CategoryCard = ({ item }) => {
  const t = useTranslations();

  return (
    <motion.div
      whileHover={{ scale: item.isActive && 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className={`overflow-hidden ${
          !item.isActive && "opacity-40 cursor-not-allowed"
        }`}
      >
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src={item.icon}
              alt={`${item.name} Logo`}
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
                  <span className="flex items-center">{t("Easy")}</span>
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/${item.slug}/hard`}>
                  <span className="flex items-center">{t("Hard")}</span>
                </Link>
              </Button>
            </>
          )}

          {!item.isActive && (
            <Badge variant="outline" className="mb-2">
              {t("Coming Soon")}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
