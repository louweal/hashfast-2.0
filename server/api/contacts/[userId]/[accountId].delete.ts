// server/api/links.get.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { userId, accountId } = event.context.params ?? {};

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing userId' });
    }
    if (!accountId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing accountId' });
    }

    try {
        await prisma.contacts.delete({
            where: {
                accountId_userId: {
                    accountId,
                    userId,
                },
            },
        });
        return;
    } catch (e) {
        return createError({ statusCode: 400, message: 'Contact deletion failed' });
    }
});
