import { PrismaClient } from '@prisma/client';
import { createError } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const payment = await prisma.payment.create({ data: body });
        return payment;
    } catch (e) {
        console.error(e);
        return createError({ statusCode: 400, message: 'Payment creation failed' });
    }
});
