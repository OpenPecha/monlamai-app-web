// SubmitButton.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SubmitButton, CancelButton } from '../Buttons';
import uselitteraTranlation from '../hooks/useLitteraTranslation';

// Mock the hook
jest.mock('../hooks/useLitteraTranslation');

describe('SubmitButton', () => {
    beforeEach(() => {
        // Reset the mock before each test
        uselitteraTranlation.mockReset();
    });

    test('should render correctly with isEnglish true', () => {
        uselitteraTranlation.mockReturnValue({ isEnglish: true });

        render(<SubmitButton>Submit</SubmitButton>);

        const button = screen.getByRole('button', { name: /submit/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('font-poppins');
        expect(button).toHaveClass('bg-blue-500');
    });

    test('should render correctly with isEnglish false', () => {
        uselitteraTranlation.mockReturnValue({ isEnglish: false });

        render(<SubmitButton>Submit</SubmitButton>);

        const button = screen.getByRole('button', { name: /submit/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('font-monlam');
        expect(button).toHaveClass('bg-blue-500');
    });
    
    test('should render correctly with children', () => {
        render(<CancelButton>Cancel</CancelButton>);

        const div = screen.getByText(/cancel/i);
        expect(div).toBeInTheDocument();
        expect(div).toHaveClass('absolute');
        expect(div).toHaveClass('z-20');
        expect(div).toHaveClass('top-1');
        expect(div).toHaveClass('right-2');
    });
});
