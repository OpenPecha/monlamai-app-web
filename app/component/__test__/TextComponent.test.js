import { render, screen, fireEvent,act } from '@testing-library/react';
import TextComponent from '../TextComponent';
import userEvent from '@testing-library/user-event'
import uselitteraTranlation from '~/component/hooks/useLitteraTranslation';
import sanitizeHtml from 'sanitize-html';

jest.mock('~/component/hooks/useLitteraTranslation');

describe('TextComponent', () => {
    let setSourceTextMock;

    beforeEach(() => {
        setSourceTextMock = jest.fn();
        uselitteraTranlation.mockReturnValue({
            translation: {
                inputPlaceholder: 'Enter text...',
            },
            isEnglish: true,
        });
    });

    test('renders with initial state and placeholder', () => {
        render(
            <TextComponent
                sourceText=""
                setSourceText={setSourceTextMock}
                sourceLang="en"
            />
        );
        expect(screen.getByText('Enter text...')).toBeInTheDocument();
    });

    test('updates HTML and sourceText on change', async() => {
        render(
            <TextComponent
                sourceText=""
                setSourceText={setSourceTextMock}
                sourceLang="en"
            />
        );

        // const contentEditable = screen.getByRole('article');
        const contentEditable = screen.getByRole('article', { contentEditable: 'true' });
        expect(contentEditable).toBeInTheDocument();
        const inputValue = '<div>Test</div>';
        screen.debug()
        await act(async () => {
            fireEvent.input(contentEditable, {
                target: { innerHtml: inputValue },
            });
        })
        // userEvent.type(contentEditable, inputValue)
        expect(setSourceTextMock).toHaveBeenCalledWith('Test');
    });

    test('applies correct classes based on sourceLang and sourceText length', () => {
        render(
            <TextComponent
                sourceText="Test text"
                setSourceText={setSourceTextMock}
                sourceLang="bo"
            />
        );

        const contentEditable = screen.getByRole('article');
        expect(contentEditable).toHaveClass('leading-loose');
        expect(contentEditable).toHaveClass('font-monlam');
        expect(contentEditable).toHaveClass('text-lg');
    });

    test('sanitizes input HTML correctly', () => {
        render(
            <TextComponent
                sourceText=""
                setSourceText={setSourceTextMock}
                sourceLang="en"
            />
        );

        const contentEditable = screen.getByRole('article');
        const inputValue = '<div><script>alert("XSS")</script>Test</div>';

        fireEvent.input(contentEditable, {
            target: { html: inputValue },
        });

        const sanitizedHtml = sanitizeHtml(inputValue, {
            allowedTags: ['div'],
            allowedIframeHostnames: ['www.youtube.com'],
        });

        const cleanText = sanitizedHtml.replace(/<div>/g, '\n').replace(/<\/div>/g, '');

        expect(setSourceTextMock).toHaveBeenCalledWith(cleanText);
    });
});
