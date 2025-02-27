
import crypto from 'crypto'

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

export  {
    encryptData,decryptData
}