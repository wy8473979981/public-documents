const md5 = require('./md5.min');
const JSEncrypt = require('./jsencrypt.min');
const CryptoJS = require('./crypto-js.min');

const iv = md5Encode(getNowTime(3)).slice(0, 16);
const key = md5Encode(getNowTime(6)).slice(0, 16);
const pubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJf5MqOyK/AwSdP3CofYiqq3r5Rk/9Ib2UPRRvAWBUvXrLkgHYIY3ItgNRbyC2hfOej5j1Pzmu9xpzRRWhYUY3uULTgzVTY4huKC/at1/e88b608peCUn6fZ+igIv94P5H1A+RWRJvAUd5dru450iIwo8DecVFjL9fzgkfZUHRSQIDAQAB";

// rsa 加密 
export function rsaEncrypt() {
  const str = JSON.stringify({
    iv,
    key,
    timestamp: new Date().getTime()
  });
  let encryptor = new JSEncrypt();
  encryptor.setPublicKey(pubKey);
  let encryptedStr = encryptor.encrypt(str);
  return encryptedStr;
}

// rsa 解密
export function rsaDecrypt(message) {
  let decrypt = new JSEncrypt();
  decrypt.setPrivateKey(PRIVATE_KEY)
  let decryptedStr = decrypt.decrypt(message);
  return decryptedStr;
}

// md5加密
export function md5Encode(message) {
  return md5(message);
}

// 时间戳加随机数
export function getNowTime(len) {
  let time = Date.now();
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let str = '';
  for (let i = 0; i < len; i++) {
    let pos = Math.floor(Math.random() * chars.length);
    str += chars[pos];
  }
  return time + str;
}
// 加密方法，使用CryptoJS库进行AES加密
export function argEncryptByDES(str) {
  const srcs = CryptoJS.enc.Utf8.parse(str);
  const encrypted = CryptoJS.AES.encrypt(
    srcs,
    CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  const encryptedText = encrypted.toString();
  return encryptedText;
}

// 解密方法，使用CryptoJS库进行AES解密
export function argDecryptByDES(str) {
  const decrypt = CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedText = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}