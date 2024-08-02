import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ToolWraper from "../ToolWraper"; // Adjust the import path as needed
import { models } from "~/helper/models";
import uselitteraTranlation from "../hooks/useLitteraTranslation";

jest.mock("../hooks/useLitteraTranslation");


// Mock the models
jest.mock("~/helper/models", () => ({
    models: [{ name: "TestModel" }, { name: "AnotherModel" }]
}));

describe("ToolWraper component", () => {
    beforeEach(() => {
        uselitteraTranlation.mockReturnValue({
            translation: { home: "Home", TestModel: "Test Model" },
            locale: "en_US",
        });
    });

    it("renders the breadcrumb and children correctly", () => {
        const { container } = render(
            <BrowserRouter>
                <ToolWraper title="TestModel">
                    <div>Child content</div>
                </ToolWraper>
            </BrowserRouter>
        );

        // Check if breadcrumb items are rendered
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Test Model")).toBeInTheDocument();

        // Check if children content is rendered
        expect(screen.getByText("Child content")).toBeInTheDocument();

        // Check if the wrapper has the correct font class
        expect(container.firstChild).toHaveClass("font-poppins");
    });

    it("applies the correct font class based on locale", () => {
        uselitteraTranlation.mockReturnValue({
            translation: { home: "Home", TestModel: "Test Model" },
            locale: "bo",
        });

        const { container } = render(
            <BrowserRouter>
                <ToolWraper title="TestModel">
                    <div>Child content</div>
                </ToolWraper>
            </BrowserRouter>
        );

        // Check if the wrapper has the correct font class for non-English locale
        expect(container.firstChild).toHaveClass("font-monlam");
    });
});
