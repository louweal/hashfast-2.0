import { PrismaClient } from '@prisma/client';
import { createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { userId, accountId } = event.context.params ?? {};

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing userId' });
    }
    if (!accountId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing accountId' });
    }

    const body = await readBody(event);

    try {
        const link = await prisma.contacts.update({
            where: {
                accountId_userId: {
                    accountId,
                    userId,
                },
            },
            data: body,
        });
        return link;
    } catch (e) {
        return createError({ statusCode: 400, message: 'Contact update failed' });
    }
});
