import { render, screen,fireEvent } from "@testing-library/react"
import { NonEditModeActions, NonEditButtons } from "../ActionButtons"

jest.mock("react-icons/fa", () => ({
    FaRegThumbsDown:()=><button>thumbs down</button>,
    FaRegThumbsUp: ()=><button>thumbs up</button>
}))

jest.mock("react-icons/go", () => ({
    GoPencil:()=><button>pencil</button>
}))

jest.mock("~/styles/LikeDislike", () => ({
    __esModule: true,
    default: () => <button>LikeDislike</button>
}))
// Mock the necessary components and hooks
jest.mock("~/component/CopyToClipboard", () => ({
    __esModule: true,
    default: ({ textToCopy, onClick }) => (
        <button onClick={onClick}>Copy</button>
    ),
}));

jest.mock("~/component/ReactionButtons", () => ({
    __esModule: true,
    default: ({ fetcher, output, sourceText, inferenceId, clickEdit }) => (
        <div>
            <button onClick={() => fetcher("like")}>Like</button>
            <button onClick={() => fetcher("dislike")}>Dislike</button>
            {clickEdit && <button onClick={clickEdit}>Edit</button>}
        </div>
    ),
}));

jest.mock("~/component/ShareLink", () => ({
    __esModule: true,
    default: ({ inferenceId }) => <button>Share</button>,
}));

jest.mock("~/component/Speak", () => ({
    __esModule: true,
    default: ({ text }) => <button>Speak</button>,
}));

jest.mock("@remix-run/react", () => ({
    ...jest.requireActual("@remix-run/react"),
    useFetcher: jest.fn(),
}));

describe("NonEditModeActions", () => {
    const likefetcher = { data: { vote: { liked: false, disliked: false } } };

    test("renders correctly with text and selected tool", () => {
        render(
            <NonEditModeActions
                selectedTool="text"
                likefetcher={likefetcher}
                sourceText="source"
                inferenceId="1"
                setEdit={() => { }}
                setEditText={() => { }}
                text="translated text"
                handleCopy={() => { }}
                sourceLang="en"
            />
        );

        expect(screen.getByRole("button", { name: "Speak" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Copy"})).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Share"})).toBeInTheDocument();
    });

    test("does not render if output text is null", () => {
        render(
            <NonEditModeActions
                selectedTool="text"
                likefetcher={likefetcher}
                sourceText="source"
                inferenceId="1"
                setEdit={() => { }}
                setEditText={() => { }}
                text=""
                handleCopy={() => { }}
                sourceLang="en"
            />
        );

        expect(screen.queryByText("Speak")).not.toBeInTheDocument();
        expect(screen.queryByText("Copy")).not.toBeInTheDocument();
        expect(screen.queryByText("Share")).not.toBeInTheDocument();
    });

    test("triggers setEdit and setEditText on edit click", () => {
        const setEdit = jest.fn();
        const setEditText = jest.fn();
        const handleCopy = jest.fn();

        render(
            <NonEditModeActions
                selectedTool="text"
                likefetcher={likefetcher}
                sourceText="source"
                inferenceId="1"
                setEdit={setEdit}
                setEditText={setEditText}
                text="translated text"
                handleCopy={handleCopy}
                sourceLang="en"
            />
        );

        // Ensure the trigger for the dropdown is rendered
        const dropdownTrigger = screen.getByTitle("Rate this translation");
        expect(dropdownTrigger).toBeInTheDocument();

        // Simulate click to open the dropdown
        fireEvent.click(dropdownTrigger);

        // Ensure the dropdown item is rendered
        const suggestEditItem = screen.getByText("Suggest an edit");
        expect(suggestEditItem).toBeInTheDocument();

        // Simulate click event on the dropdown item
        fireEvent.click(suggestEditItem);

        // Verify the edit action was triggered
        expect(setEdit).toHaveBeenCalledWith(true);
        expect(setEditText).toHaveBeenCalledWith("translated text");
        screen.debug()
    });
});

describe("NonEditButtons", () => {
    const likefetcher = { data: { vote: { liked: false, disliked: false } } };

    test("renders correctly with text and selected tool", () => {
        render(
            <NonEditButtons
                selectedTool="text"
                likefetcher={likefetcher}
                sourceText="source"
                inferenceId="1"
                setEdit={() => { }}
                setEditText={() => { }}
                text="translated text"
                handleCopy={() => { }}
                sourceLang="en"
            />
        );

        expect(screen.getByText("Speak")).toBeInTheDocument();
        expect(screen.getByText("Copy")).toBeInTheDocument();
        expect(screen.getByText("Share")).toBeInTheDocument();
    });

    test("does not render if output text is null", () => {
        render(
            <NonEditButtons
                selectedTool="text"
                likefetcher={likefetcher}
                sourceText="source"
                inferenceId="1"
                setEdit={() => { }}
                setEditText={() => { }}
                text=""
                handleCopy={() => { }}
                sourceLang="en"
            />
        );

        expect(screen.queryByText("Speak")).not.toBeInTheDocument();
        expect(screen.queryByText("Copy")).not.toBeInTheDocument();
        expect(screen.queryByText("Share")).not.toBeInTheDocument();
    });

    test("triggers setEdit and setEditText on edit click", () => {
        const setEdit = jest.fn();
        const setEditText = jest.fn();

        render(
            <NonEditButtons
                selectedTool="text"
                likefetcher={likefetcher}
                sourceText="source"
                inferenceId="1"
                setEdit={setEdit}
                setEditText={setEditText}
                text="translated text"
                handleCopy={() => { }}
                sourceLang="en"
            />
        );

        fireEvent.click(screen.getByText("Edit"));

        expect(setEdit).toHaveBeenCalledWith(true);
        expect(setEditText).toHaveBeenCalledWith("translated text");
    });
});
