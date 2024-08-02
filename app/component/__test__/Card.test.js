import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
    test('renders the Card component with children', () => {
        render(
            <Card>
                <span>Card Content</span>
            </Card>
        );

        // Check that the card content is rendered
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    test('sets focus class when card is clicked', () => {
        const {container} = render(
            <Card focussed={true}>
                <span>Card Content</span>
            </Card>
        );
        const cardContainer = container.querySelector("div")
        expect(cardContainer).toBeInTheDocument()
        // // Use act to wrap the click event
        act(() => {
            fireEvent.click(cardContainer);
        });

        // // Check that the card has the focused class
        expect(cardContainer).toHaveClass(
            'border border-1 border-secondary-100 dark:border-primary-900 dark:border-opacity-40 lg:rounded-bl-lg'
        );
    });

    test('removes focus class when clicking outside the card', () => {
        const { container } = render(
            <Card focussed={true}>
                <span>Card Content</span>
            </Card>
        );
        const cardContainer = container.querySelector("div")
        expect(cardContainer).toBeInTheDocument()
        // // Use act to wrap the click event
        act(() => {
            fireEvent.click(cardContainer);
        });

        // // Check that the card has the focused class
        expect(cardContainer).toHaveClass(
            'border border-1 border-secondary-100 dark:border-primary-900 dark:border-opacity-40 lg:rounded-bl-lg'
        );
        // Use act to wrap the click event outside the card
        act(() => {
            fireEvent.mouseDown(document.body);
        });

        // Check that the card does not have the focused class anymore
        expect(cardContainer).not.toHaveClass(
            'border border-1 border-secondary-100 dark:border-primary-900 dark:border-opacity-40 lg:rounded-bl-lg'
        );
    });
});