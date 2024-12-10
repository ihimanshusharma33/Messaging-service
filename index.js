import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();
const port = process.env.PORT || 8080;
const app = express();
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.get('/', (req, res) => {
    res.send('home page');
})
app.post('/mail', async (req, res) => {
    try {
        const { name,email, message } = req.body;
        if(!name || !email || !message){
            return res.status(400).json({error:'All fields are required'});
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPassword
            }
        });

        const mailOptions = {
            from: emailUser,
            to: 'hs991009@gmail.com',
            subject: 'Mail from Portfolio website',
            text: `Name:${name}\n
            Email:${email}\n
            Message:-${message}`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

app.listen(port, () => {
    console.log('server is running on the', port);
})