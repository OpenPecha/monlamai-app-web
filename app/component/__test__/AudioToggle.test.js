import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AudioToggle from '../AudioToggle';

jest.mock("react-icons/fa", () => ({
    FaPause: () => <div role="img" aria-label="Pause icon">pause</div>,
    FaPlay: () => <div role="img" aria-label="Play icon">play</div>
}))
describe('AudioToggle Component', () => {

    test('renders the play button when output is provided', () => {
        render(<AudioToggle output="test-audio.mp3" />);
        screen.debug()
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
        const playIcon = screen.getByRole('img', { name: /Play icon/i });
        expect(playIcon).toBeInTheDocument()

    });

    test('disables the button when output is an empty string', () => {
        render(<AudioToggle output="" />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    test('does not render anything when output is null', () => {
        render(<AudioToggle output={null} />);

        const button = screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    });

    test('toggles play and pause', () => {
        render(<AudioToggle output="test-audio.mp3" />);

        const button = screen.getByRole('button');
        const audio = document.querySelector('audio');

        // Mock the play and pause methods of the audio element
        audio.play = jest.fn();
        audio.pause = jest.fn();

        // Simulate clicking the play button
        act(() => {
            fireEvent.click(button);
        });

        expect(audio.play).toHaveBeenCalled();
        expect(button).toContainHTML('<div role="img" aria-label="Pause icon">pause</div>'); // Check if the button icon has changed to pause

        // Simulate clicking the pause button
        act(() => {
            fireEvent.click(button);
        });

        expect(audio.pause).toHaveBeenCalled();
        expect(button).toContainHTML('<div role="img" aria-label="Play icon">play</div>'); // Check if the button icon has changed to play
    });
});
