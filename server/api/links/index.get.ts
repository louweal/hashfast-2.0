// server/api/links.get.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    if (!query.userId || typeof query.userId !== "string") {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing or invalid 'userId'",
        });
    }

    const userId = query.userId;

    try {
        const links = await prisma.link.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                payments: {
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        return links;
    } catch (e) {
        console.error(e);
        return createError({ statusCode: 400, message: "Link query failed" });
    }
});
