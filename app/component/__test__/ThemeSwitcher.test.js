import { render, screen, fireEvent } from "@testing-library/react";
import ThemeSwitcher from "../ThemeSwitcher";
import useLitteraTranslation from "../hooks/useLitteraTranslation";
import useLocalStorage from "../hooks/useLocaleStorage";
import { useLittera, useLitteraMethods } from "@assembless/react-littera";

jest.mock('../hooks/useLitteraTranslation', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../hooks/useLocaleStorage', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('@assembless/react-littera', () => ({
    __esModule: true,
    useLittera: jest.fn(),
    useLitteraMethods: jest.fn()
}));

jest.mock("react-icons/md", () => ({
    MdOutlineLightMode: () => <div role="light-mode-icon" />,
    MdDarkMode: () => <div role="dark-mode-icon" />,
}));

describe("ThemeSwitcher Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should render light mode when isDarkMode is false", () => {
        useLocalStorage.mockReturnValue([false, jest.fn()]);
        useLittera.mockReturnValue({
            lightmode: 'Light Mode',
            darkmode: 'Dark Mode'
        });
        useLitteraTranslation.mockReturnValue({
            translation: {
                lightmode: 'Light Mode',
                darkmode: 'Dark Mode'
            },
            isTibetan: false
        });

        render(<ThemeSwitcher />);

        expect(screen.getByText('Dark Mode')).toBeInTheDocument();
        screen.debug()
        expect(screen.getByRole('dark-mode-icon', { name: "" })).toBeInTheDocument(); 
    });

    test("should render dark mode when isDarkMode is true", () => {
        useLocalStorage.mockReturnValue([true, jest.fn()]);
        useLittera.mockReturnValue({
            lightmode: 'Light Mode',
            darkmode: 'Dark Mode'
        });
        useLitteraTranslation.mockReturnValue({
            translation: {
                lightmode: 'Light Mode',
                darkmode: 'Dark Mode'
            },
            isTibetan: false
        });

        render(<ThemeSwitcher />);

        expect(screen.getByText('Light Mode')).toBeInTheDocument();
        expect(screen.getByRole('light-mode-icon', { name: "" })).toBeInTheDocument(); 
        screen.debug()
    });

    test("should toggle dark mode on click", () => {
        const setIsDarkModeMock = jest.fn();
        useLocalStorage.mockReturnValue([false, setIsDarkModeMock]);
        useLittera.mockReturnValue({
            lightmode: 'Light Mode',
            darkmode: 'Dark Mode'
        });
        useLitteraTranslation.mockReturnValue({
            translation: {
                lightmode: 'Light Mode',
                darkmode: 'Dark Mode'
            },
            isTibetan: false
        });

        render(<ThemeSwitcher />);

        const themeSwitcher = screen.getByText('Dark Mode');
        fireEvent.click(themeSwitcher);

        expect(setIsDarkModeMock).toHaveBeenCalledWith(true);
    });

    test("should position text correctly for Tibetan language", () => {
        useLocalStorage.mockReturnValue([false, jest.fn()]);
        useLittera.mockReturnValue({
            lightmode: 'འཆར་ངོས་དཀར་པོ།',
            darkmode: 'འཆར་ངོས་ནག་པོ།'
        });
        useLitteraTranslation.mockReturnValue({
            translation: {
                lightmode: 'འཆར་ངོས་དཀར་པོ།',
                darkmode: 'འཆར་ངོས་ནག་པོ།'
            },
            isTibetan: true
        });

        render(<ThemeSwitcher />);

        const darkModeText = screen.getByText('འཆར་ངོས་ནག་པོ།');
        expect(darkModeText).toHaveStyle('position: relative; top: 3px');
    });
});
