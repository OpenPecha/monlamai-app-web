import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReactionButtons from "../ReactionButtons";

const mockFetcher = {
    state: "idle",
    data: {
        vote: { liked: false, disliked: false },
    },
    formData: null,
    submit: jest.fn(),
};

const mockClickEdit = jest.fn();

const defaultProps = {
    fetcher: mockFetcher,
    output: "some output",
    sourceText: "some source text",
    inferenceId: "test-id",
    clickEdit: mockClickEdit,
};

jest.mock("react-icons/fa", () => ({
    FaRegThumbsDown: () => <>thumbs down</>,
    FaRegThumbsUp: ()=><>thumbs up</>
}))
jest.mock("react-icons/fa6", () => ({
    FaPencil: () => <>pencil</>
}))

describe("ReactionButtons component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders the reaction buttons correctly", () => {
        render(<ReactionButtons {...defaultProps} />);

        expect(screen.getByRole("button", { name: /pencil/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /thumbs up/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /thumbs down/i })).toBeInTheDocument();
    });
    test("should render null if inferenceId is not provided", () => {
        const { container } = render(<ReactionButtons {...defaultProps} inferenceId = {null} />); 
        expect(container.firstChild).toBeNull();    
    });

    test("handles like button click correctly", async () => {
        render(<ReactionButtons {...defaultProps} />);

        fireEvent.click(screen.getByRole("button", { name: /thumbs up/i }));

        expect(mockFetcher.submit).toHaveBeenCalledWith(
            { inferenceId: "test-id", action: "liked" },
            { method: "POST", action: "/api/feedback" }
        );
    });

    test("handles dislike button click correctly", async () => {
        render(<ReactionButtons {...defaultProps} />);

        fireEvent.click(screen.getByRole("button", { name: /thumbs down/i }));

        expect(mockFetcher.submit).toHaveBeenCalledWith(
            { inferenceId: "test-id", action: "disliked" },
            { method: "POST", action: "/api/feedback" }
        );
    });

    test("shows the spinner when loading", () => {
        const formData = new FormData();
        formData.append("action", "someAction");
        render(
            <ReactionButtons
                {...defaultProps}
                fetcher={{
                    ...mockFetcher,
                    state: "loading",
                    formData
                }}
            />
        );

        expect(screen.getByRole("status")).toBeInTheDocument();
        screen.debug()
    });

    test("handles clickEdit correctly", () => {
        render(<ReactionButtons {...defaultProps} />);

        fireEvent.click(screen.getByRole("button", { name: /pencil/i }));
        expect(mockClickEdit).toHaveBeenCalled();
    });

    test("Should not render pencil icon if clickEdit is not provided", () => {
        const { container } = render(<ReactionButtons {...defaultProps} clickEdit={null}/>);
        expect(container.firstChild).not.toContainHTML("pencil");
    })
    test("Should not render pencil icon if clickEdit is not provided", () => {
        const { container } = render(<ReactionButtons {...defaultProps} clickEdit={undefined} />);
        expect(container.firstChild).not.toContainHTML("pencil");
    })
});
