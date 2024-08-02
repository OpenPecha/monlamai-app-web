import { getBrowser } from '../getBrowserDetail';

describe('getBrowser', () => {
    // Define navigator globally
    global.navigator = {
        userAgent: 'default'
    };

    // Store the original userAgent value
    const originalUserAgent = global.navigator.userAgent;

    // Restore the original userAgent after each test
    afterEach(() => {
        Object.defineProperty(global.navigator, 'userAgent', {
            value: originalUserAgent,
            configurable: true,
        });
    });

    // Function to set a mocked userAgent
    const setUserAgent = (userAgent) => {
        Object.defineProperty(global.navigator, 'userAgent', {
            value: userAgent,
            configurable: true,
        });
    };

    test('should detect Chrome', () => {
        setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        expect(getBrowser()).toBe('Chrome');
    });

    test('should detect Edge', () => {
        setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 Edg/91.0.864.48');
        expect(getBrowser()).toBe('Edge');
    });

    test('should detect Firefox', () => {
        setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
        expect(getBrowser()).toBe('Firefox');
    });

    test('should detect Safari', () => {
        setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15');
        expect(getBrowser()).toBe('Safari');
    });

    test('should detect Explorer', () => {
        setUserAgent('Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko');
        expect(getBrowser()).toBe('Explorer');
    });

    test('should return Unknown for unrecognized user agents', () => {
        setUserAgent('Some random user agent string');
        expect(getBrowser()).toBe('Unknown');
    });
});
