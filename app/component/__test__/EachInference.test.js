import { render, screen, fireEvent } from "@testing-library/react";
import { EachInference } from "../EachInference";
import { useFetcher } from "@remix-run/react";

// Mock necessary modules
jest.mock("@remix-run/react", () => ({
    useFetcher: jest.fn(),
}));
jest.mock("../utils/timeSince", () => jest.fn(()=>"3 days ago"));
jest.mock("../AudioToggle", () => jest.fn(() => <div>AudioToggle Component</div>));
jest.mock("../Progress", () => ({
    __esModule: true,
    Progress: ({ progress }) => <div>Progress: {progress}</div>,
}));
jest.mock("react-icons/md", () => ({
    MdDeleteForever: () => <div>Delete Icon</div>,
}));
jest.mock("react-icons/fa", () => ({
    FaDownload: () => <div>Download Icon</div>,
}));

describe("EachInference", () => {
    const mockInference = {
        id: "1",
        model: "tts",
        input: "somepath/TTS/input/filename.mp3",
        updatedAt: "2023-01-01T00:00:00.000Z",
        output: "outputpath.mp3",
    };
    const mockProgress = 50;
    const mockSubmit = jest.fn();

    beforeEach(() => {
        useFetcher.mockReturnValue({ submit: mockSubmit });
        // timeSince.mockReturnValue("3 days ago");
    });

    test("renders correctly when there is no error and output is complete", () => {
        render(<EachInference inference={mockInference} progress={mockProgress} />);

        // Check if the filename is displayed correctly
        // expect(screen.getByText("filename.mp3")).toBeInTheDocument();

        // Check if the time since updated is displayed correctly
        expect(screen.getByText("3 days ago")).toBeInTheDocument();

        // Check if the AudioToggle component is rendered
        expect(screen.getByText("AudioToggle Component")).toBeInTheDocument();

        // Check if the Download icon is rendered
        expect(screen.getByText("Download Icon")).toBeInTheDocument();
    });

    test("renders correctly when there is an error", () => {
        const mockErrorInference = {
            ...mockInference,
            output: "error: something went wrong",
        };

        render(
            <EachInference inference={mockErrorInference} progress={mockProgress} />
        );

        // Check if the error message is displayed
        expect(screen.getByText("Error")).toBeInTheDocument();
    });

    test("renders progress correctly when output is not complete", () => {
        const mockIncompleteInference = {
            ...mockInference,
            output: "",
        };

        render(
            <EachInference
                inference={mockIncompleteInference}
                progress={mockProgress}
            />
        );

        // Check if the Progress component is rendered with correct progress
        expect(screen.getByText(`Progress: ${mockProgress}`)).toBeInTheDocument();
    });

    test("handles delete button click correctly", () => {
        render(<EachInference inference={mockInference} progress={mockProgress} />);

        const deleteButton = screen.getByText("Delete Icon");
        fireEvent.click(deleteButton);

        // Check if the submit function is called with the correct parameters
        expect(mockSubmit).toHaveBeenCalledWith(
            {},
            {
                method: "DELETE",
                action: "/api/inference/1",
            }
        );
    });
});
