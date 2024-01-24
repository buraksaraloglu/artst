import "dotenv-flow/config";
import prisma from "@/lib/prisma";

async function main() {
  const users = await prisma.link.groupBy({
    by: ["userId"],
    _count: {
      id: true,
    },
    where: {
      domain: {
        in: ["artst.io", "chatg.pt", "spti.fi", "amzn.id"],
      },
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 100,
  });
  const usersWithEmails = await Promise.all(
    users
      .filter(({ userId }) => userId !== null)
      .map(async (user) => {
        const u = await prisma.user.findUnique({
          where: {
            id: user.userId!,
          },
          select: {
            email: true,
          },
        });
        if (!u) {
          return user;
        }
        return {
          email: u.email,
          links: user._count.id,
        };
      }),
  );
  console.table(usersWithEmails);
}

main();
