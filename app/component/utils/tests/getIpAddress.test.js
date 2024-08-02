import getIpAddressByRequest from '../getIpAddress';

describe('getIpAddressByRequest', () => {
    test('should extract IP from x-forwarded-for header', () => {
        const request = {
            headers: {
                get: (name) => name === 'x-forwarded-for' ? '192.168.1.1' : null
            },
            socket: null
        };
        expect(getIpAddressByRequest(request)).toBe('192.168.1.1');
    });

    test('should use x-real-ip header if x-forwarded-for is not available', () => {
        const request = {
            headers: {
                get: (name) => name === 'x-real-ip' ? '192.168.1.1' : null
            },
            socket: null
        };
        expect(getIpAddressByRequest(request)).toBe('192.168.1.1');
    });

    test('should fallback to socket remote address if headers are not available', () => {
        const request = {
            headers: {
                get: (name) => null
            },
            socket: {
                remoteAddress: '192.168.1.1'
            }
        };
        expect(getIpAddressByRequest(request)).toBe('192.168.1.1');
    });

    test('should return default message if IP is not available', () => {
        const request = {
            headers: {
                get: (name) => null
            },
            socket: null
        };
        expect(getIpAddressByRequest(request)).toBe('IP not available');
    });
});
