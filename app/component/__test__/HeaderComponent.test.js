import { render, screen } from "@testing-library/react";
import HeaderComponent from "../HeaderComponent";
import useLitteraTranslation from "../hooks/useLitteraTranslation";
import { useLittera, useLitteraMethods } from "@assembless/react-littera";

jest.mock('../hooks/useLitteraTranslation', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('@assembless/react-littera', () => ({
    __esModule: true,
    useLittera: jest.fn(),
    useLitteraMethods: jest.fn()
}));

describe("HeaderComponent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render text header with English locale and file selected', () => {
        useLitteraTranslation.mockReturnValue({
            translation: {
                text: 'Text',
                audio: 'Audio',
                recording: 'Recording',
                transcript: 'Transcript',
                file: 'File'
            },
            locale: "en_US"
        });

        useLittera.mockReturnValue({
            text: 'Text',
            audio: 'Audio',
            recording: 'Recording',
            transcript: 'Transcript',
            file: 'File'
        });
        useLitteraMethods.mockReturnValue({
            setLocale: jest.fn(),
            getLocale: jest.fn(() => 'en_US'),
            getLocales: jest.fn()
        });

        // Render the component
        render(<HeaderComponent model="TTS" selectedTool="file" />);


        // Check that the component displays the expected text
        expect(screen.getByText('Text')).toBeInTheDocument();
        expect(screen.getByText('File')).toBeInTheDocument();
    });

    test('should render recording header with Tibetan locale and file selected', () => {
        // Mock useLitteraTranslation hook
        useLitteraTranslation.mockReturnValue({
            translation: {
                text: 'ཡིག་རྐྱང་།', // Tibetan for "Text"
                audio: 'སྒྲ།', // Tibetan for "Audio"
                recording: 'སྒྲ་འབེབས།', // Tibetan for "Recording"
                transcript: 'ཡི་གེ།', // Tibetan for "Transcript"
                file: 'ཡིག་ཆ།'
            },
            locale: "bo_TI"
        });

        // Mock useLittera hook
        useLittera.mockReturnValue({
            text: 'ཡིག་རྐྱང་།', // Tibetan for "Text"
            audio: 'སྒྲ།', // Tibetan for "Audio"
            recording: 'སྒྲ་འབེབས།', // Tibetan for "Recording"
            transcript: 'ཡི་གེ།', // Tibetan for "Transcript"
            file: 'ཡིག་ཆ།'
        });

        // Mock useLitteraMethods hook
        useLitteraMethods.mockReturnValue({
            setLocale: jest.fn(),
            getLocale: jest.fn(() => 'bo_TI'),
            getLocales: jest.fn()
        });

        // Render the component
        render(<HeaderComponent model="STT" selectedTool="file" />);
        expect(screen.getByText('སྒྲ་འབེབས།')).toBeInTheDocument(); 
        expect(screen.getByText('ཡིག་ཆ།')).toBeInTheDocument(); 
    });
});
