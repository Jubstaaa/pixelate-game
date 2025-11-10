"use server";

import * as CategoryService from "./category-service";

import prisma from "@/lib/prisma";

export async function listByCategory(categoryId) {
  return prisma.character.findMany({
    where: {
      categoryId: Number(categoryId),
    },
    select: {
      id: true,
      name: true,
      characterImage: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function findAll() {
  return prisma.character.findMany({
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function findById(id) {
  const character = await prisma.character.findUnique({
    where: { id: Number(id) },
    include: {
      DeviceScore: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!character) {
    throw new Error("Character not found");
  }

  return character;
}

export async function create(data) {
  await CategoryService.findById(data.categoryId);

  return prisma.character.create({
    data,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function update(id, data) {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("No valid fields to update");
  }

  await findById(id);

  if (data.categoryId) {
    await CategoryService.findById(data.categoryId);
  }

  return prisma.character.update({
    where: { id: Number(id) },
    data,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function remove(id) {
  const character = await findById(id);

  if (character.DeviceScore && character.DeviceScore.length > 0) {
    throw new Error("Cannot delete character with associated scores");
  }

  return prisma.character.delete({
    where: { id: Number(id) },
  });
}

export async function createBulk(characters) {
  if (!Array.isArray(characters) || characters.length === 0) {
    throw new Error("Characters payload must be a non-empty array");
  }

  const categoryIds = [...new Set(characters.map((char) => Number(char.categoryId)))];

  for (const categoryId of categoryIds) {
    await CategoryService.findById(categoryId);
  }

  return prisma.$transaction(
    characters.map((char) =>
      prisma.character.create({
        data: char,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
    ),
  );
}
