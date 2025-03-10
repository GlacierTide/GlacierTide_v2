require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'tanush.shah.btech2022@sitpune.edu.in', // Replace with your email for testing
    from: process.env.SENDER_EMAIL, // Your verified sender email
    subject: 'Test Email',
    text: 'This is a test email from SendGrid',
};

sgMail
    .send(msg)
    .then(() => console.log('Test email sent successfully'))
    .catch((error) => console.error('Error:', error.response ? error.response.body : error));