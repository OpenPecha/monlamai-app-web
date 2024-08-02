import { render, screen } from "@testing-library/react";
import Devider from "../Devider";

describe("Devider Component", () => {
    test("renders with correct classes", () => {
        const { container } = render(<Devider />);
        const deviderElement = container.querySelector('div');

        expect(deviderElement).toHaveClass('inline-block');
        expect(deviderElement).toHaveClass('h-0.5');
        expect(deviderElement).toHaveClass('w-auto');
        expect(deviderElement).toHaveClass('lg:h-auto');
        expect(deviderElement).toHaveClass('lg:min-h-[1em]');
        expect(deviderElement).toHaveClass('lg:w-0.5');
        expect(deviderElement).toHaveClass('bg-neutral-100');
        expect(deviderElement).toHaveClass('dark:bg-[--card-border]');
    });
});
