import { randomBytes } from "node:crypto";
import base64url from "base64url";

// FIXME: add types

/**
 * Create a state which can include custom data.
 * @param payload
 */
export function createState(payload: any) {
  const stateObject = payload || {};
  stateObject.nonce = createNonce();
  return encodeState(stateObject);
}

/**
 * Generates a nonce value.
 */
function createNonce() {
  return randomBytes(16).toString("hex");
}

/**
 * Prepare a state object to send.
 */
function encodeState(stateObject: any) {
  return base64url.encode(JSON.stringify(stateObject));
}

/**
 * Decode a state value. */
export function decodeState(stateValue: any) {
  const decoded = base64url.decode(stateValue);

  // Backwards compatibility
  if (decoded.indexOf("{") !== 0) {
    return { nonce: stateValue };
  }

  return JSON.parse(base64url.decode(stateValue));
}

