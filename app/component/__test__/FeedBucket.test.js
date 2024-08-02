import { render, screen, fireEvent } from '@testing-library/react';
import FeedBucket from '../FeedBucket';
import { useRouteLoaderData } from '@remix-run/react';

// Mock the useRouteLoaderData hook
jest.mock('@remix-run/react', () => ({
    useRouteLoaderData: jest.fn(),
}));

jest.mock("react-icons/md", () => ({
    MdFeedback:()=><>feedback</>
}))

jest.mock("react-icons/rx", () => ({
    RxCross2:()=><>close</>
}))
describe('FeedBucket component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the feedback button for eligible users', () => {
        useRouteLoaderData.mockReturnValue({
            user: { email: 'test@monlam.ai', username: 'testuser' },
            feedBucketAccess: JSON.stringify([]),
            feedbucketToken: 'test-token',
        });

        render(<FeedBucket />);

        const feedbackButton = screen.getByRole('button', { name: /feedback/i });
        expect(feedbackButton).toBeInTheDocument();
    });

    it('does not render the feedback button for ineligible users', () => {
        useRouteLoaderData.mockReturnValue({
            user: { email: 'test@otherdomain.com', username: 'testuser' },
            feedBucketAccess: JSON.stringify([]),
            feedbucketToken: 'test-token',
        });

        render(<FeedBucket />);

        const feedbackButton = screen.queryByRole('button', { name: /feedback/i });
        expect(feedbackButton).not.toBeInTheDocument();
    });

    it('shows and hides the feedbucket on button click', () => {
        useRouteLoaderData.mockReturnValue({
            user: { email: 'test@monlam.ai', username: 'testuser' },
            feedBucketAccess: JSON.stringify([]),
            feedbucketToken: 'test-token',
        });

        render(<FeedBucket />);

        const feedbackButton = screen.getByRole('button', { name: /feedback/i });
        fireEvent.click(feedbackButton);

        const closeButton = screen.getByRole('button', { name: /close/i });
        expect(closeButton).toBeInTheDocument();

        fireEvent.click(closeButton);

        expect(feedbackButton).toBeInTheDocument();
    });
});
