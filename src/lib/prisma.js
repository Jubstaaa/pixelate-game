import { PrismaClient } from "@prisma/client";

let prisma;

// Geliştirme modunda Prisma istemcisini tekrar kullanabilir hale getirmek için global değişken kullanıyoruz
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
