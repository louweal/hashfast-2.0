// server/api/links/[id].ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params ?? {};

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Missing ID' });
    }

    const contact = await prisma.contacts.findUnique({
        where: { accountId: id },
    });

    if (!contact) {
        throw createError({ statusCode: 404, statusMessage: 'Contact not found' });
    }

    return contact;
});
