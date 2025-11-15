// server/api/links/[id].ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    console.log('route params:', event.context.params);

    const { userId, accountId } = event.context.params ?? {};

    if (!userId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing userId' });
    }
    if (!accountId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing accountId' });
    }

    const contact = await prisma.contacts.findFirst({
        where: {
            accountId,
            userId,
        },
    });

    if (!contact) {
        throw createError({ statusCode: 404, statusMessage: 'Contact not found' });
    }

    return contact;
});
