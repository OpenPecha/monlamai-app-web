import { render, screen } from "@testing-library/react"
import Index from "../TermsAndConditions"
import { useLocation } from "@remix-run/react";
import { MemoryRouter } from 'react-router-dom';

jest.mock("@remix-run/react", () => ({
    ...jest.requireActual('@remix-run/react'),
    useLocation: jest.fn(),
}))

describe("Terms and Conditons component", () => {
    test('should render component', () => { 
        useLocation.mockReturnValue({
            pathname:"/"
        })
        render(
            <MemoryRouter>
            <Index />
            </MemoryRouter>
        )
        expect(screen.getByRole("heading", { name: "བཀོལ་སྤྱོད་ཆ་རྐྱེན།" })).toBeInTheDocument()
    })
    
    test('should render link if path includes "terms"', () => {
        useLocation.mockReturnValue({
            pathname: "/terms"
        })
         render(
            <MemoryRouter>
            <Index />
            </MemoryRouter>
        )
        expect(screen.getByRole("link", { name: /visit home/i })).toBeInTheDocument()
    })
    test('should have class "overflow-y-scroll" if path includes "steps"', () => {
        useLocation.mockReturnValue({
            pathname: "/steps"
        })
         render(
            <MemoryRouter>
            <Index />
            </MemoryRouter>
        )
        const container = document.querySelector(".text-slate-900")
        expect(container).toHaveClass("overflow-y-scroll")
    })
})