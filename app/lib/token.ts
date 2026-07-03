import { customAlphabet } from "nanoid";

// Unambiguous alphabet (no 0/O/1/I/l) for tokens that may be read aloud or typed.
const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
const generate = customAlphabet(alphabet, 32);

export function generateAccessToken(): string {
  return generate();
}
