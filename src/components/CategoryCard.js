"use client";
import Link from "next/link";
import React from "react";

import Image from "@/components/Image";

const CategoryCard = ({ item }) => {
  return (
    <div
      className={`flex items-center gap-4 overflow-hidden rounded-2xl border border-default bg-content1 p-4${!item.isActive ? " opacity-40" : ""}`}
    >
      <div className="shrink-0 rounded-xl bg-primary/10 p-3">
        <Image
          src={item.icon}
          alt={`${item.name} Logo`}
          width={128}
          height={128}
          className="h-11 w-11 object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2.5">
        <h3 className="text-[17px] font-bold text-foreground">{item.name}</h3>
        {item.isActive ? (
          <div className="flex gap-2">
            <Link
              href={`/${item.slug}/easy`}
              className="rounded-lg border border-success/25 bg-success/10 px-4 py-1.5 text-[12px] font-semibold text-success"
            >
              Easy
            </Link>
            <Link
              href={`/${item.slug}/hard`}
              className="rounded-lg border border-warning/25 bg-warning/10 px-4 py-1.5 text-[12px] font-semibold text-warning"
            >
              Hard
            </Link>
          </div>
        ) : (
          <span className="self-start rounded-lg border border-default px-3 py-1.5 text-[12px] text-muted-foreground">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
