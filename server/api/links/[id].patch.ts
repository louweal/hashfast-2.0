import { PrismaClient } from "@prisma/client";
import { createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { id } = event.context.params ?? {};
    const body = await readBody(event);

    try {
        const link = await prisma.link.update({
            where: { id },
            data: body,
        });
        return link;
    } catch (e) {
        return createError({ statusCode: 400, message: "Link update failed" });
    }
});
