import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorPage, ErrorBoundary } from "../ErrorPages";
import { toast } from "react-toastify";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { API_ERROR_MESSAGE } from "~/helper/const";

// Mock toast and its static properties
jest.mock("react-toastify", () => {
    const toast = jest.fn();
    toast.POSITION = {
        BOTTOM_RIGHT: "bottom-right",
    };
    toast.warn = jest.fn();
    return {
        toast,
        ToastContainer: () => null,
    };
});

jest.mock('../ErrorMessage', () => ({
    ModalErrorMessage: jest.fn(() => <div data-testid="modal-error-message" />),
}));
// Mock useRouteError from remix-run/react
jest.mock("@remix-run/react", () => ({
    useRouteError: jest.fn(),
    isRouteErrorResponse:jest.fn(),
}));
describe("ErrorPage", () => {
    it("displays the correct message for different error statuses", () => {
        const errors = [
            { status: 404, message: "Not Found" },
            { status: 403, message: "Forbidden" },
            { status: 400, message: "Bad Request" },
            { status: 500, message: "Internal Server Error" },
            { status: 502, message: "Bad Gateway" },
            { status: 503, message: "Service Unavailable" },
        ];

        errors.forEach((error) => {
            render(<ErrorPage error={error} />);
            expect(screen.getByText(error.message)).toBeInTheDocument();
            switch (error.status) {
                case 404:
                    expect(
                        screen.getByText(
                            "Oops! The page you're looking for doesn't exist. It might have been moved or deleted."
                        )
                    ).toBeInTheDocument();
                    break;
                case 403:
                    expect(
                        screen.getByText(
                            "Sorry, you don't have permission to access this page. Please check your credentials or contact support."
                        )
                    ).toBeInTheDocument();
                    break;
                case 400:
                    expect(
                        screen.getByText(
                            "It seems there's an issue with your request. Please check and try again."
                        )
                    ).toBeInTheDocument();
                    break;
                case 500:
                    expect(
                        screen.getByText(
                            "Something went wrong on our end. We're working to fix it. Please try again later."
                        )
                    ).toBeInTheDocument();
                    break;
                case 502:
                    expect(
                        screen.getByText(
                            "We're experiencing some technical issues. Please try refreshing the page."
                        )
                    ).toBeInTheDocument();
                    break;
                case 503:
                    expect(
                        screen.getByText(
                            "We're currently undergoing maintenance. Please check back soon."
                        )
                    ).toBeInTheDocument();
                    break;
                default:
                    expect(
                        screen.getByText("An unexpected error has occurred.")
                    ).toBeInTheDocument();
                    break;
            }
        });
    });
});

describe("ErrorBoundary", () => {
    it("displays a toast message and calls handleClose when a route error occurs", () => {
        const error = { status: 404, message: "Not Found" };
        useRouteError.mockReturnValue(error);
        isRouteErrorResponse.mockReturnValue(true)
        render(<ErrorBoundary />);

        expect(toast.warn).toHaveBeenCalledWith(API_ERROR_MESSAGE, {
            position: "bottom-right",
            closeOnClick: true,
        });
    });

    it("renders ModalErrorMessage when error is not a route error", () => {
        const error = new Error("Test error message");
        useRouteError.mockReturnValue(error);
        isRouteErrorResponse.mockReturnValue(false)
        render(<ErrorBoundary />);

        expect(screen.getByTestId('modal-error-message')).toBeInTheDocument();
    });
});
