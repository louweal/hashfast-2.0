// send email using sendgrid
import fs from "fs";
import path from "path";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const network = process.env.HEDERA_NETWORK as string;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, accountId, payerAccountId, amount, currency, paymentDate } = body;

    console.log("sending email");
    // sgMail.setDataResidency('eu');

    const subject = `Payment received: +${amount} ${currency}`;

    const textContent = `Good news!

Your payment request has been paid by ${payerAccountId}.

Details:
- Sender Wallet: ${payerAccountId}
- Your Wallet: ${accountId}
- Amount: ${amount} ${currency}
- Date: ${paymentDate}

Thank you for using HashFast!`;

    const templatePath = path.resolve("server/emails/payment-received.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    const htmlContent = htmlTemplate
        .replace(/{{payerAccountId}}/g, payerAccountId)
        .replace(/{{accountId}}/g, accountId)
        .replace(/{{amount}}/g, amount)
        .replace(/{{currency}}/g, currency)
        .replace(/{{paymentDate}}/g, paymentDate)
        .replace(/{{network}}/g, network);

    const msg = {
        to: email,
        from: process.env.SENDGRID_SENDER,
        subject: subject,
        text: textContent,
        html: htmlContent,
    };
    sgMail
        .send(msg as any)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
});
