import { render, screen,fireEvent, } from "@testing-library/react"
import ReleaseAnnouncement from "../Countdown"

describe('ReleaseAnnouncement Component', () => {
    test('renders the component and countdown', () => {
        render(<ReleaseAnnouncement />);

        // Check for the initial render
        expect(screen.getByText(/New Version Releasing on July 6th/i)).toBeInTheDocument();

        // Check that the countdown is rendered
        expect(screen.getByText(/0d 0h 0m 0s/i)).toBeInTheDocument();
    });

    test('closes the announcement when the close button is clicked', () => {
        render(<ReleaseAnnouncement />);

        // Check that the component is initially rendered
        expect(screen.getByText(/New Version Releasing on July 6th/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /×/i }));
        expect(screen.queryByText(/New Version Releasing on July 6th/i)).not.toBeInTheDocument();
    });
});