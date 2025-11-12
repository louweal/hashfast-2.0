// server/api/links.get.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params ?? {};

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Missing ID' });
    }

    try {
        await prisma.contacts.delete({
            where: { accountId: id },
        });
        return;
    } catch (e) {
        return createError({ statusCode: 400, message: 'Contact deletion failed' });
    }
});
