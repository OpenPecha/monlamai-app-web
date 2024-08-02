import { render, screen } from '@testing-library/react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import LocationComponent from '../LocationDetect'; 

// Mocking useFetcher and useLoaderData hooks
jest.mock('@remix-run/react', () => ({
    useFetcher: jest.fn(),
    useLoaderData: jest.fn(),
}));

// Mocking global fetch
global.fetch = jest.fn();

describe('LocationComponent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('fetches and submits location data if user city is not available', async () => {
        // Mock the useLoaderData hook to return a user without city information
        useLoaderData.mockReturnValue({ user: { id: 'user1' } });

        // Mock the useFetcher hook
        const submitMock = jest.fn();
        useFetcher.mockReturnValue({ submit: submitMock });

        // Mock the fetch function to return a successful response
        const mockResponse = {
            city: 'New York',
            country: 'US',
        };
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockResponse),
        });

        // Render the component
        render(<LocationComponent />);

        await screen.findAllByText(''); // Since the component returns nothing, we just need to wait for effects to complete

        // Assertions
        expect(global.fetch).toHaveBeenCalledWith('https://ipapi.co/json');
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(submitMock).toHaveBeenCalledWith(
            {
                _action: 'update_location',
                city: 'New York',
                country: 'US',
                user_id: 'user1',
            },
            {
                action: '/api/user',
                method: 'POST',
            }
        );
        expect(submitMock).toHaveBeenCalledTimes(1);
    });

    test('does not fetch or submit location data if user city is already available', async () => {
        // Mock the useLoaderData hook to return a user with city information
        useLoaderData.mockReturnValue({ user: { id: 'user1', city: 'Existing City' } });

        // Mock the useFetcher hook
        const submitMock = jest.fn();
        useFetcher.mockReturnValue({ submit: submitMock });

        // Render the component
        render(<LocationComponent />);

        // Assertions
        expect(global.fetch).not.toHaveBeenCalled();
        expect(submitMock).not.toHaveBeenCalled();
    });

    test('handles fetch error gracefully', async () => {
        // Mock the useLoaderData hook to return a user without city information
        useLoaderData.mockReturnValue({ user: { id: 'user1' } });

        // Mock the useFetcher hook
        const submitMock = jest.fn();
        useFetcher.mockReturnValue({ submit: submitMock });

        // Mock fetch to throw an error
        global.fetch.mockRejectedValue(new Error('Fetch error'));

        // Render the component
        render(<LocationComponent />);

        // Assertions
        expect(global.fetch).toHaveBeenCalledWith('https://ipapi.co/json');
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(submitMock).not.toHaveBeenCalled();
    });
});
