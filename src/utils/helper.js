
import crypto from 'crypto'
import twilio from "twilio/lib/rest/Twilio.js";

const encryptData = (data, key, iv) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    console.log("encrypted "+encrypted);
    return encrypted;
};

  const decryptData = (encryptedData, key, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};


const sendSMS = (msg,mobile) => {

    // Create a Twilio client
    const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    // Send SMS
    client.messages.create({
    body: msg,
    from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number
    to: '+91'+mobile    // Recipient's phone number
    })
    .then((message) => {
    console.log('Message sent successfully!');
    console.log('Message SID: ' + message.sid);  // SID of the sent message
    })
    .catch((error) => {
    console.error('Error occurred:', error);
    });

}

export  {
    encryptData,decryptData,sendSMS
}