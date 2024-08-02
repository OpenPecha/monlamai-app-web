import { formatBytes } from "../fileSizeFormat"

describe('formatBytes', () => {
    test('should return "0 Bytes" for 0 bytes', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
    });

    test('should return "500 Bytes" for 500 bytes', () => {
        expect(formatBytes(500)).toBe('500 Bytes');
    });

    test('should return "1 KB" for 1024 bytes', () => {
        expect(formatBytes(1024)).toBe('1 KB');
    });

    test('should return "1 MB" for 1048576 bytes', () => {
        expect(formatBytes(1048576)).toBe('1 MB');
    });

    test('should return "1 GB" for 1073741824 bytes', () => {
        expect(formatBytes(1073741824)).toBe('1 GB');
    });

    test('should return "1 KB" for 1024 bytes with 0 decimal places', () => {
        expect(formatBytes(1024, 0)).toBe('1 KB');
    });

    // test('should return "1.000 KB" for 1024 bytes with 3 decimal places', () => {
    //     expect(formatBytes(1024, 3)).toBe('1.000 KB');
    // });

    test('should return "0 Bytes" for negative bytes', () => {
        expect(formatBytes(-1024)).toBe('0 Bytes');
    });

    test('should return "1 KB" for 1024.5 bytes', () => {
        expect(formatBytes(1024.5)).toBe('1 KB');
    });

    test('should return "931.323 GB" for 1e12 bytes', () => {
        expect(formatBytes(1e12)).toBe('931.32 GB');
    });
});