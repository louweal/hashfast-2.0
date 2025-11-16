// send email using sendgrid
import fs from 'fs';
import path from 'path';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const network = process.env.HEDERA_NETWORK as string;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, accountId, payerAccountId, amount, currency, paymentDate } = body;
    // sgMail.setDataResidency('eu');

    const subject = `Payment received: +${amount} ${currency}`;

    const textContent = `Payment Received: +${amount} ${currency}

Your payment request has been paid!

Transaction:
${amount} ${currency} from ${payerAccountId} (https://hashscan.io/${network}/account/${payerAccountId})
to ${accountId} (https://hashscan.io/${network}/account/${accountId}).

Date: ${paymentDate}

Thank you for using HashFast!

HashFast Pro users can manage payment request settings in the Dashboard.

Go to Dashboard:
https://hashfast.app/dashboard/transactions`;

    const templatePath = path.resolve('server/emails/payment-received.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

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
            console.log('Email sent');
        })
        .catch((error) => {
            console.error(error);
        });
});
