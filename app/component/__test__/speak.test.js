import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Speak from '../Speak';
import { useFetcher } from '@remix-run/react';
import React from 'react';

// Mock hooks
jest.mock('@remix-run/react', () => ({
    ...jest.requireActual('@remix-run/react'),
    useFetcher: jest.fn(),
}));

jest.mock("react-icons/fa6", () => ({
    FaPause:()=><button>pause</button>
}))

jest.mock("react-icons/hi2", () => ({
    HiMiniSpeakerWave:()=><button>play</button>
}))

describe('Speak Component', () => {
    let fetcherMock;
    let audioPlayMock;
    let audioPauseMock;

    beforeEach(() => {
        fetcherMock = {
            data: null,
            state: 'idle',
            submit: jest.fn(),
        };
        useFetcher.mockReturnValue(fetcherMock);

        audioPlayMock = jest.fn();
        audioPauseMock = jest.fn();

        window.HTMLMediaElement.prototype.play = audioPlayMock;
        window.HTMLMediaElement.prototype.pause = audioPauseMock;

        jest.clearAllMocks();
    });

    test('renders the play button initially', () => {
        render(<Speak text="Hello world" />);
        screen.debug()
        expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    });

    test('submits the form on play button click', () => {
        render(<Speak text="Hello world" />);

        fireEvent.click(screen.getByRole('button', { name: /play/i }));

        expect(fetcherMock.submit).toHaveBeenCalledWith({ sourceText: 'Hello world' }, { action: '/api/tts', method: 'POST' });
    });

    test('displays loading state while fetching', async () => {
        fetcherMock.state = 'submitting';
        render(<Speak text="Hello world" />);
        screen.debug()
        // expect(screen.getByRole('button', { name: /play/i })).toHaveClass('animate-pulse');
        expect(document.querySelector('.speaker_loading')).toBeInTheDocument()
    });

    test('plays the audio when fetcher data is available', async () => {
        fetcherMock.data = { data: 'audio_url' };
        render(<Speak text="Hello world" />);

        // Wait for the effect to play the audio
        await waitFor(() => expect(audioPlayMock).toHaveBeenCalled());
        expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });

    test('pauses the audio when the pause button is clicked', async () => {
        fetcherMock.data = { data: 'audio_url' };
        render(<Speak text="Hello world" />);

        // Wait for the effect to play the audio
        await waitFor(() => expect(audioPlayMock).toHaveBeenCalled());

        fireEvent.click(screen.getByRole('button', { name: /pause/i }));
        expect(audioPauseMock).toHaveBeenCalled();
    });
    test('getText should call', async () => {
        // fetcherMock.data = { data: 'audio_url' };
        mockGetText = jest.fn().mockReturnValue('Text from get text');
        render(<Speak text="Hello world" getText={mockGetText} />);
        fireEvent.click(screen.getByRole('button', { name: /play/i }));
        await waitFor(() => expect(mockGetText).toHaveBeenCalled());
        expect(fetcherMock.submit).toHaveBeenCalledWith({ sourceText: 'Text from get text' }, { action: '/api/tts', method: 'POST' });
    });
});
