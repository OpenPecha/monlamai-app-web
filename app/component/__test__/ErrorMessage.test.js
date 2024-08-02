import { render, act } from "@testing-library/react";
import { ErrorMessage, ModalErrorMessage } from "../ErrorMessage";
import { toast } from "react-toastify";
import { useNavigate } from "@remix-run/react";

// Mock the toast function
jest.mock("react-toastify", () => {
    const toast = jest.fn();
    toast.POSITION = {
        BOTTOM_CENTER: "bottom-center",
        TOP_RIGHT: "top-right",
        // Add other positions as needed
    };
    toast.onChange = jest.fn()
    return {
        toast,
        ToastContainer: () => null, 
    };
});
jest.mock("@remix-run/react", () => ({
    useNavigate: jest.fn(),
}));

describe("ErrorMessage", () => {
    it("should call toast with the correct message and type", () => {
        const mockHandleClose = jest.fn();
        const message = "An error occurred";
        const type = "error";

        render(<ErrorMessage message={message} handleClose={mockHandleClose} type={type} />);

        expect(toast).toHaveBeenCalledWith(message, {
            type,
            position: toast.POSITION.BOTTOM_CENTER,
            closeOnClick: true,
        });
    });

    it("should call handleClose when toast is removed", () => {
        const mockHandleClose = jest.fn();
        const message = "An error occurred";
        const type = "error";

        render(<ErrorMessage message={message} handleClose={mockHandleClose} type={type} />);

        // Simulate toast removal
        toast.onChange.mockReturnValue({ status: "removed" });

        expect(toast.onChange).toHaveBeenCalled();
    });
});

describe("ModalErrorMessage", () => {
    it("should call toast with the correct message and type", () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        const message = "An error occurred";
        const type = "error";

        render(<ModalErrorMessage message={message} type={type} />);

        expect(toast).toHaveBeenCalledWith(message, {
            type,
            position: "bottom-center",
            autoClose: 2000,
            closeOnClick: true,
        });
    });

    it("should navigate to the homepage after 2 seconds", () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);

        jest.useFakeTimers(); // Mock timers
        render(<ModalErrorMessage message="error" type="error" />);

        act(() => {
            jest.advanceTimersByTime(2000); // Fast-forward time by 2 seconds
        });

        expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
        jest.useRealTimers(); // Restore real timers
    });
});

