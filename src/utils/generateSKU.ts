import { randomBytes } from "crypto";

export default function generateSKU() {
  return `PRD-${randomBytes(4).toString("hex").toUpperCase()}`;
}