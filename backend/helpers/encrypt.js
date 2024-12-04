import fs from "fs";
function lzssCompress(data) {
  return lzString.compress(data);
}

function lzssDecompress(data) {
  return lzString.decompress(data);
}

function offsetCipherEncrypt(data, key) {
  return data
    .split("")
    .map((char, index) => {
      const shift = (key + index) % 256;
      return String.fromCharCode((char.charCodeAt(0) + shift) % 256);
    })
    .join("");
}

function offsetCipherDecrypt(data, key) {
  return data
    .split("")
    .map((char, index) => {
      const shift = (key + index) % 256;
      return String.fromCharCode((char.charCodeAt(0) - shift + 256) % 256);
    })
    .join("");
}

async function saveEncryptedData(filename, data, key) {
  const compressedData = lzssCompress(data);
  const encryptedData = offsetCipherEncrypt(compressedData, key);
  await fs.promises.writeFile(filename, encryptedData, "utf-8");
}

async function readEncryptedData(filename, key) {
  const encryptedData = await fs.promises.readFile(filename, "utf-8");
  const compressedData = offsetCipherDecrypt(encryptedData, key);
  return lzssDecompress(compressedData);
}
