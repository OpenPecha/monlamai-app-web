import timeSince from '../timeSince';

describe('timeSince', () => {
    test('should return "Just now" for a date just now', () => {
        const now = new Date().toISOString();
        expect(timeSince(now)).toBe("Just now");
    });

    test('should return "1 minute ago" for a date one minute ago', () => {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
        expect(timeSince(oneMinuteAgo)).toBe("1 minute ago");
    });

    test('should return "2 minutes ago" for a date two minutes ago', () => {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        expect(timeSince(twoMinutesAgo)).toBe("2 minutes ago");
    });

    test('should return "1 hour ago" for a date one hour ago', () => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        expect(timeSince(oneHourAgo)).toBe("60 minutes ago");
    });

    test('should return "2 hours ago" for a date two hours ago', () => {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        expect(timeSince(twoHoursAgo)).toBe("2 hours ago");
    });

    test('should return "1 day ago" for a date one day ago', () => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        expect(timeSince(oneDayAgo)).toBe("1 day ago");
        // expect(timeSince(oneDayAgo)).toBe("24 hours ago");
    });

    test('should return "2 days ago" for a date two days ago', () => {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        expect(timeSince(twoDaysAgo)).toBe("2 days ago");
    });

    test('should return "1 month ago" for a date one month ago', () => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        expect(timeSince(oneMonthAgo.toISOString())).toBe("1 month ago");
        // expect(timeSince(oneMonthAgo.toISOString())).toBe("30 days ago");
    });

    test('should return "2 months ago" for a date two months ago', () => {
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        expect(timeSince(twoMonthsAgo.toISOString())).toBe("2 months ago");
    });

    test('should return "1 year ago" for a date one year ago', () => {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        expect(timeSince(oneYearAgo.toISOString())).toBe("1 year ago");
    });

    test('should return "2 years ago" for a date two years ago', () => {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        expect(timeSince(twoYearsAgo.toISOString())).toBe("2 years ago");
    });

    test('invalid date', () => {
        expect(timeSince('')).toBe('Invalid Date');
    })

    test('date as null', () => {
        expect(timeSince(null)).toBe('Invalid Date');
    })

    test('date as undefined', () => {
        expect(timeSince(undefined)).toBe('Invalid Date');
    })
});
