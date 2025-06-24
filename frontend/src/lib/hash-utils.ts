import { HASH_ID_SECRET } from "@/constants";
import Hashids from "hashids";

export type HashIdType = "note" | "diary" | "user" | "text";

function getHashIds(type: HashIdType) {
  return new Hashids(
    HASH_ID_SECRET + type,
    8,
    "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
  );
}

export function encodeId(type: HashIdType, id: number) {
  const hashids = getHashIds(type);
  return hashids.encode(id);
}

export function encodeText(text: string) {
  const hashids = getHashIds("text");
  return hashids.encode(text);
}

export function decodeId(type: HashIdType, encodedId: string): number {
  const hashids = getHashIds(type);
  const decoded = hashids.decode(encodedId);
  return decoded.length > 0 ? Number(decoded[0]) : -1;
}

export const hashCode = function (text: string) {
  var hash = 0,
    i,
    chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
