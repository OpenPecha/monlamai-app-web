import { render, screen, fireEvent, act } from '@testing-library/react';
import TranslationSwitcher from '../TranslationSwitcher';
import useLocalStorage from '../hooks/useLocaleStorage';
import uselitteraTranlation from '../hooks/useLitteraTranslation';
import { useLitteraMethods } from '@assembless/react-littera';

// Mock hooks
jest.mock('../hooks/useLitteraTranslation');
jest.mock('../hooks/useLocaleStorage');
jest.mock('@assembless/react-littera');

describe('TranslationSwitcher', () => {
    let setCurrentMock, setLocaleMock;

    beforeEach(() => {
        setCurrentMock = jest.fn();
        setLocaleMock = jest.fn();

        useLocalStorage.mockImplementation((key, initial) => {
            if (initial === 'bo_TI') {
                return ['bo_TI', setCurrentMock];
            } else {
                return ['en_US', setCurrentMock];
            }
        });

        uselitteraTranlation.mockImplementation(() => {
            const current = useLocalStorage()[0];
            return {
                isEnglish: current === 'en_US',
                isTibetan: current === 'en_US',
            };
        });

        useLitteraMethods.mockReturnValue({ setLocale: setLocaleMock });

        jest.clearAllMocks();
    });

    test('renders Tibetan and English options based on current language', () => {
        render(<TranslationSwitcher />);
        expect(screen.getByText('དབྱིན་ཡིག')).toBeInTheDocument();
    });

    test('toggles language on click', () => {
        render(<TranslationSwitcher />);

        fireEvent.click(screen.getByText('བོད་ཡིག'));

        expect(setCurrentMock).toHaveBeenCalledWith('en_US');
        expect(setLocaleMock).toHaveBeenCalledWith('en_US');
    });

    test('correctly toggles language and updates text', async () => {
        render(<TranslationSwitcher />);
        expect(screen.getByText('བོད་ཡིག')).toBeInTheDocument();

        // Simulate clicking to switch to English
        await act(async () => {
            fireEvent.click(screen.getByText('བོད་ཡིག'));
        });

        // Ensure the mock function was called with 'en_US'
        expect(setCurrentMock).toHaveBeenCalledWith('en_US');
        expect(setLocaleMock).toHaveBeenCalledWith('en_US');

        // Update the mock return value to simulate the state change
        useLocalStorage.mockImplementation(() => ['en_US', setCurrentMock]);
        uselitteraTranlation.mockImplementation(() => ({
            isEnglish: true,
            isTibetan: false,
        }));

        // Re-render the component to reflect the state change
        await act(async () => {
            render(<TranslationSwitcher />);
        });

        // Check updated rendering with English language
        expect(screen.getByText('དབྱིན་ཡིག')).toBeInTheDocument();
    });
});
