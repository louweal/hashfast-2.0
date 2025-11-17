// send email using sendgrid

//@ts-ignore
import htmlTemplateFree from '../emails/payment-received-free.html';
//@ts-ignore
import htmlTemplatePro from '../emails/payment-received-pro.html';

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, name, amount, currency, paymentDate, pro, transactionId, requestId } = body;
    const network = process.env.HEDERA_NETWORK as string;
    const subdomain = network === 'testnet' ? 'testnet' : 'www';

    const subject = `Payment received: +${amount} ${currency}`;

    let textContent = `Payment Received: +${amount} ${currency}

Your payment request has been paid!

Request URL:
https://${subdomain}.hashfast.app/pay/${requestId}

Transaction URL:
https://hashscan.io/${network}/transaction/${transactionId}

Date: ${paymentDate}

Thank you for using HashFast!
`;

    if (pro) {
        textContent = `Payment Received: +${amount} ${currency}

Your payment request for '${name}' has been paid!

Request URL:
https://${subdomain}.hashfast.app/pay/${requestId}

Transaction URL:
https://hashscan.io/${network}/transaction/${transactionId}

Date: ${paymentDate}

Thank you for using HashFast!`;
    }

    let templateName;

    if (pro) {
        templateName = '/emails/payment-received-pro.html';
    } else {
        templateName = '/emails/payment-received-free.html';
    }

    const htmlTemplate = pro ? htmlTemplatePro : htmlTemplateFree;

    const htmlContent = htmlTemplate
        .replace(/{{name}}/g, name)
        .replace(/{{amount}}/g, amount)
        .replace(/{{currency}}/g, currency)
        .replace(/{{requestId}}/g, requestId)
        .replace(/{{transactionId}}/g, transactionId)
        .replace(/{{paymentDate}}/g, paymentDate)
        .replace(/{{network}}/g, network)
        .replace(/{{subdomain}}/g, subdomain);

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
            console.log('Email sent from ' + process.env.SENDGRID_SENDER + ' to ' + email);
        })
        .catch((error) => {
            console.error(error);
        });
});
