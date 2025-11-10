"use server";

import prisma from "@/lib/prisma";

const DEFAULT_ORDER = [{ isActive: "desc" }, { createdAt: "asc" }];

export async function list(args = {}) {
  return prisma.category.findMany({
    ...args,
    orderBy: DEFAULT_ORDER,
  });
}

export async function getBySlug(slug) {
  return prisma.category.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });
}

export async function findAll() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function findById(id) {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: {
      characters: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function create(data) {
  return prisma.category.create({
    data,
  });
}

export async function update(id, data) {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("No valid fields to update");
  }

  await findById(id);

  return prisma.category.update({
    where: { id: Number(id) },
    data,
  });
}

export async function remove(id) {
  const category = await findById(id);

  if (category.characters && category.characters.length > 0) {
    throw new Error("Cannot delete category with associated characters");
  }

  return prisma.category.delete({
    where: { id: Number(id) },
  });
}
