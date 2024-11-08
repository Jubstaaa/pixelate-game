import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  await prisma.character.updateMany({
    data: {
      todayActive: false,
    },
  });

  const totalCharacters = await prisma.character.count();
  const randomIndex = Math.floor(Math.random() * totalCharacters); // Rastgele bir index seçiyoruz

  // 3. Rastgele seçilen karakteri true yapıyoruz
  const randomCharacter = await prisma.character.findMany({
    skip: randomIndex, // Rastgele karakterin bulunduğu index'i geçiyoruz
    take: 1, // Yalnızca bir karakteri alıyoruz
  });

  if (randomCharacter.length > 0) {
    // Seçilen karakterin todayActive değerini true yapıyoruz
    await prisma.character.update({
      where: { id: randomCharacter[0].id },
      data: { todayActive: true },
    });
  }

  await prisma.device.updateMany({
    data: {
      easyCount: 0,
      hardCount: 0,
    },
  });

  return NextResponse.json({ ok: true });
}
