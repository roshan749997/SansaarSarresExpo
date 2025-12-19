// utils/generateHash.js
import crypto from "crypto";

export function generateHash(payload, salt) {
  const keys = Object.keys(payload).sort();
  const hashString = keys.map(k => payload[k]).join("|") + "|" + salt;

  return crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex")
    .toUpperCase();
}



