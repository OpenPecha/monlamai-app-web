import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShareLink from "../ShareLink";

// Mock useMemo to return a constant link
jest.spyOn(React, 'useMemo').mockImplementation((fn) => fn());

jest.mock("react-icons/fa", () => ({
    FaShareAlt:()=><button>ShareBtn</button>
}))

jest.mock("react-icons/fa6", () => ({
    FaFacebook: () => <>facebook</>,
    FaXTwitter: () => <>xtwitter</>,
    FaWhatsapp: () => <>whatsapp</>,
}))

jest.mock("react-icons/md", () => ({
    MdContentCopy:()=><>copy</>
}))

Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
});
// Mock window.open
global.open = jest.fn();

describe("ShareLink component", () => {
    const inferenceId = "12345";
    const link = `${window.location.origin}/share/${inferenceId}`;

    test("renders the dropdown and share buttons correctly", () => {
        render(<ShareLink inferenceId={inferenceId} />);

        // Check if share icon is rendered
        const shareBtn = screen.getByRole("button", { name: /sharebtn/i })
        expect(shareBtn).toBeInTheDocument();
        // Simulate clicking on the share icon to open the dropdown
        fireEvent.click(shareBtn);
        
        // Check if the share link text input is rendered
        expect(screen.getByDisplayValue(link)).toBeInTheDocument();
        
        // Check if the social share buttons are rendered
        expect(screen.getByRole("button", { name: /facebook/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /xtwitter/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /whatsapp/i })).toBeInTheDocument();
    });

    test("copies the share link to clipboard", () => {
        render(<ShareLink inferenceId={inferenceId} />);

        // Simulate clicking on the share icon to open the dropdown
        fireEvent.click(screen.getByRole("button", { name: /sharebtn/i }));

        // Simulate clicking on the copy to clipboard button
        const copyButton = screen.getByRole("button", { name: /copy/i });
        fireEvent.click(copyButton);

        // Check if the link is copied to the clipboard (mocking clipboard functionality)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link);
        screen.debug()
    });

    test("opens the share link in a new window", () => {
        render(<ShareLink inferenceId={inferenceId} />);

        // Simulate clicking on the share icon to open the dropdown
        fireEvent.click(screen.getByRole("button", { name: /sharebtn/i }));

        // Simulate clicking on the Facebook share button
        const facebookButton = screen.getByRole("button", { name: /facebook/i });
        fireEvent.click(facebookButton);

        // Check if window.open is called with the correct URL
        expect(global.open).toHaveBeenCalledWith(expect.stringContaining("facebook.com"), "_blank");
    });

    // Add similar tests for Twitter and WhatsApp buttons
});
