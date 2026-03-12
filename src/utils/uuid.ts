import { getRandomValues } from './random';

/**
 * Generate a v4 UUID using the browser's native crypto API.
 *
 * Uses crypto.randomUUID() when available (Chrome 92+, Firefox 95+,
 * Safari 15.4+). Falls back to a manual implementation using
 * getRandomValues() for older browsers — reusing the same utility
 * the rest of the codebase uses (which includes the msCrypto fallback).
 *
 * This replaces the `uuid` npm package with ~20 lines of code.
 */
export const v4 = (): string => {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID();
    }
    return uuidFromRandomValues();
};

/**
 * Manual v4 UUID generation using getRandomValues().
 * Produces a RFC 4122 compliant UUID: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * where y is one of [8, 9, a, b].
 */
const uuidFromRandomValues = (): string => {
    const bytes = getRandomValues(new Uint8Array(16));

    // Set version (4) and variant (RFC 4122) bits
    // eslint-disable-next-line no-bitwise
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // eslint-disable-next-line no-bitwise
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
    return [
        hex.slice(0, 4).join(''),
        hex.slice(4, 6).join(''),
        hex.slice(6, 8).join(''),
        hex.slice(8, 10).join(''),
        hex.slice(10).join('')
    ].join('-');
};
