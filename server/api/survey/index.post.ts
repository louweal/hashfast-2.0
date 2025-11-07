import { PrismaClient } from "@prisma/client";
import { createError } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        console.log(body);
        const entry = await prisma.survey.create({ data: body });
        return entry;
    } catch (e) {
        console.error(e);
        return createError({ statusCode: 400, message: "Survey entry creation failed" });
    }
});
