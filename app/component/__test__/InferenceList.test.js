import React from 'react';
import { render, screen } from '@testing-library/react';
import { useLoaderData } from '@remix-run/react';
import useSocket from '../hooks/useSocket';
import { EachInference } from '../EachInference';
import { InferenceList } from '../InferenceList';

// Mock the necessary hooks and components
jest.mock('@remix-run/react', () => ({
    useLoaderData: jest.fn(),
}));

jest.mock('../hooks/useSocket', () => jest.fn());

jest.mock('../EachInference', () => ({
    EachInference: jest.fn(({ inference, progress }) => <div>Mocked EachInference {inference.name}</div>),
}));

describe('InferenceList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the list of inferences', () => {
        const mockInferences = [
            { id: '1', name: 'Inference 1' },
            { id: '2', name: 'Inference 2' },
        ];

        const mockUseLoaderData = useLoaderData;
        mockUseLoaderData.mockReturnValue({ inferences: mockInferences });

        const mockUseSocket = useSocket;
        mockUseSocket.mockReturnValue({
            isConnected: true,
            progress: 50,
            socket: {},
        });

        render(<InferenceList />);

        // Check if EachInference is rendered with the correct props
        expect(EachInference).toHaveBeenCalledTimes(2);
        expect(EachInference).toHaveBeenCalledWith(
            expect.objectContaining({
                inference: mockInferences[0],
                progress: 50,
            }),
            {}
        );
        expect(EachInference).toHaveBeenCalledWith(
            expect.objectContaining({
                inference: mockInferences[1],
                progress: 50,
            }),
            {}
        );

        // Check if the mocked EachInference component is rendered correctly
        expect(screen.getByText("Mocked EachInference Inference 1")).toBeInTheDocument()
        expect(screen.getByText("Mocked EachInference Inference 2")).toBeInTheDocument()
    });

    it('renders a message when there are no inferences', () => {
        const mockUseLoaderData = useLoaderData;
        mockUseLoaderData.mockReturnValue({ inferences: [] });

        render(<InferenceList />);
        // it can show blank but having a message would be better
        expect(screen.getByText('No inferences found')).toBeInTheDocument();
    });
});
