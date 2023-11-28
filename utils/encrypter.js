const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET_KEY, {
  pbkdf2Iterations: 10000,
  saltLength: 10,
});

const encrypt = (text) => {
  const encrypted = cryptr.encrypt(text);
  return encrypted;
};

const decrypt = (encrypted_text) => {
  const decrypted = cryptr.decrypt(encrypted_text);
  return decrypted;
};

module.exports = {
  decrypt,
  encrypt,
};
