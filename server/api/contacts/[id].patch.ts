import { PrismaClient } from '@prisma/client';
import { createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params ?? {};
    const body = await readBody(event);

    try {
        const link = await prisma.contacts.update({
            where: { accountId: id },
            data: body,
        });
        return link;
    } catch (e) {
        return createError({ statusCode: 400, message: 'Contact update failed' });
    }
});
