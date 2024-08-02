import React from 'react';
import { render, screen,fireEvent,waitFor } from '@testing-library/react';
import CopyToClipboard from '../CopyToClipboard';

// Mock the ReactionButton component
jest.mock('../ReactionButtons', () => ({
    ReactionButton: ({ onClick, className }) => (
        <button onClick={onClick} className={className}>Copy</button>
    ),
}));

Object.assign(
    navigator,{
        clipboard: {
            writeText:jest.fn()
        }
    }
)
describe('CopyToClipboard component', () => {
    test('renders correctly', () => {
        render(<CopyToClipboard textToCopy="Tashi Delek" />);
        const button = screen.getByText("Copy");
        expect(button).toBeInTheDocument();
    });

    test('updates state on button click', async () => {
        render(<CopyToClipboard textToCopy="Hello, World!" />);

        const button = screen.getByText('Copy');
        expect(button).not.toHaveClass('copy-success');
        fireEvent.click(button);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello, World!');
        expect(button).toHaveClass('copy-success');

        // Wait for the state to revert back after the timeout
        await waitFor(() => expect(button).not.toHaveClass('copy-success'), { timeout: 2500 });
    });
});
