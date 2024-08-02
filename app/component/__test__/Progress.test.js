import { render, screen, waitFor } from "@testing-library/react";
import { useRevalidator } from "@remix-run/react";
import { Progress } from "../Progress";

// Mock useRevalidator
jest.mock("@remix-run/react", () => ({
    useRevalidator: jest.fn()
}));

describe("Progress Component", () => {
    let revalidatorMock;

    beforeEach(() => {
        revalidatorMock = {
            revalidate: jest.fn()
        };
        useRevalidator.mockReturnValue(revalidatorMock);
    });

    test("renders correctly with progress", () => {
        const progress = { 1: "complete" };
        const inferenceId = 1;

        render(<Progress progress={progress} inferenceId={inferenceId} />);

        expect(screen.getByText("complete")).toBeInTheDocument();
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    test("sets progressed state based on progress and triggers revalidation when complete", async () => {
        const progress = { 1: "complete" };
        const inferenceId = 1;

        render(<Progress progress={progress} inferenceId={inferenceId} />);

        // Verify initial rendering
        expect(screen.getByText("complete")).toBeInTheDocument();

        // Wait for the revalidation to be triggered
        await waitFor(() => {
            // Check that revalidation was called after 2 seconds
            expect(revalidatorMock.revalidate).toHaveBeenCalled();
        }, { timeout: 3000 }); // wait up to 3 seconds to account for the 2-second delay
    });

    test("does not trigger revalidation when progress is not complete", () => {
        const progress = { 1: "in-progress" };
        const inferenceId = 1;

        render(<Progress progress={progress} inferenceId={inferenceId} />);

        // Verify that revalidation was not triggered
        expect(revalidatorMock.revalidate).not.toHaveBeenCalled();
    });

    test("updates progressed state correctly", () => {
        const progress = { 1: "in-progress" };
        const inferenceId = 1;

        render(<Progress progress={progress} inferenceId={inferenceId} />);

        // Check that the state is initially "in-progress"
        expect(screen.getByText("in-progress")).toBeInTheDocument();
    });

    test("should handle null inferenceId", () => {
        const progress = { 1: "in-progress" };
        const inferenceId = null;

        const { container } = render(<Progress progress={progress} inferenceId={inferenceId} />);

        // Check that the component is not rendered
        expect(container.firstChild).toBeNull();
    });

    test("should handle null progress", () => {
        const progress = null;
        const inferenceId = 1;

        const { container } = render(<Progress progress={progress} inferenceId={inferenceId} />);

        // Check that the component is not rendered
        expect(container.firstChild).toBeNull();
    });

    test("should handle if inferenceId is not in progress", () => {
        const progress = { 2: "in-progress" };
        const inferenceId = 1;

        const { container } = render(<Progress progress={progress} inferenceId={inferenceId} />);

        // Check that the component is not rendered
        expect(container.firstChild).toBeNull();
    });
});
