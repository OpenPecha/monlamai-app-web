import { verifyDomain } from '../utils/verifyDomain';

describe('verifyDomain', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); 
        process.env = { ...OLD_ENV }; 
    });

    afterAll(() => {
        process.env = OLD_ENV; 
    });

    test('should return false if Referer header is not present', () => {
        const request = new Request('http://example.com', { headers: {} });
        process.env.ORIGIN = 'http://allowed.com';
        const result = verifyDomain(request);
        expect(result).toBe(false);
    });

    test('should return false if Referer does not match the allowed domain', () => {
        const request = new Request('http://example.com', {
            headers: { Referer: 'http://notallowed.com' },
        });
        process.env.ORIGIN = 'http://allowed.com';
        const result = verifyDomain(request);
        expect(result).toBe(false);
    });

    test('should return true if Referer matches the allowed domain', () => {
        const request = new Request('http://example.com', {
            headers: { Referer: 'http://allowed.com/path' },
        });
        process.env.ORIGIN = 'http://allowed.com';
        const result = verifyDomain(request);
        expect(result).toBe(true);
    });

    test('should handle Referer starting with allowed domain and having a path', () => {
        const request = new Request('http://example.com', {
            headers: { Referer: 'http://allowed.com/some/path' },
        });
        process.env.ORIGIN = 'http://allowed.com';
        const result = verifyDomain(request);
        expect(result).toBe(true);
    });

    test('should handle empty ORIGIN environment variable', () => {
        const request = new Request('http://example.com', {
            headers: { Referer: 'http://allowed.com/some/path' },
        });
        process.env.ORIGIN = '';
        const result = verifyDomain(request);
        expect(result).toBe(false);
    });

    test('should handle undefined ORIGIN environment variable', () => {
        const request = new Request('http://example.com', {
            headers: { Referer: 'http://allowed.com/some/path' },
        });
        delete process.env.ORIGIN;
        const result = verifyDomain(request);
        expect(result).toBe(false);
    });
});
