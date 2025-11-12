import { PrismaClient } from '@prisma/client';
import { createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const contact = await prisma.contacts.create({ data: body });
        return contact;
    } catch (e) {
        console.error(e);
        return createError({ statusCode: 400, message: 'Contact creation failed' });
    }
});
