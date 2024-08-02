import { base64ToBuffer } from '../base64ToBuffer';

describe('base64ToBuffer', () => {
    test('should convert a Base64-encoded string to a Buffer', () => {
        const base64String = 'data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=';
        const expectedBuffer = Buffer.from('UklGRmQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=', 'base64');

        const resultBuffer = base64ToBuffer(base64String);

        expect(resultBuffer).toEqual(expectedBuffer);
    });

    test('should handle strings without the prefix', () => {
        const base64String = 'UklGRmQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=';
        const expectedBuffer = Buffer.from(base64String, 'base64');

        const resultBuffer = base64ToBuffer(base64String);

        expect(resultBuffer).toEqual(expectedBuffer);
    });

    test('should return an empty buffer for an empty input string', () => {
        const base64String = '';
        const expectedBuffer = Buffer.from('');

        const resultBuffer = base64ToBuffer(base64String);

        expect(resultBuffer).toEqual(expectedBuffer);
    });

    test('should return an empty buffer for null input', () => {
        const resultBuffer = base64ToBuffer(null);
        const expectedBuffer = Buffer.from('');

        expect(resultBuffer).toEqual(expectedBuffer);
    });

    test('should return an empty buffer for undefined input', () => {
        const resultBuffer = base64ToBuffer(undefined);
        const expectedBuffer = Buffer.from('');

        expect(resultBuffer).toEqual(expectedBuffer);
    });
});
