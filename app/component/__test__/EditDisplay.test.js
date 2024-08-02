import { render, screen, fireEvent } from "@testing-library/react";
import EditDisplay from "../EditDisplay";

describe("EditDisplay component", () => {
    const mockSetEditText = jest.fn();

    test("renders the textarea with correct initial value", () => {
        render(
            <EditDisplay
                editText="Initial text"
                setEditText={mockSetEditText}
                targetLang="en"
            />
        );

        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveValue("Initial text");
    });

    test("updates value on change", () => {
        render(
            <EditDisplay
                editText="Initial text"
                setEditText={mockSetEditText}
                targetLang="en"
            />
        );

        const textarea = screen.getByRole("textbox");
        fireEvent.change(textarea, { target: { value: "New text" } });

        expect(mockSetEditText).toHaveBeenCalledWith("New text");
    });

    test("applies correct classes based on targetLang", () => {
        const { rerender } = render(
            <EditDisplay
                editText=""
                setEditText={mockSetEditText}
                targetLang="en"
            />
        );
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveClass("font-poppins");

        rerender(
            <EditDisplay
                editText=""
                setEditText={mockSetEditText}
                targetLang="bo"
            />
        );
        expect(textarea).toHaveClass("font-monlam");

        rerender(
            <EditDisplay
                editText=""
                setEditText={mockSetEditText}
                targetLang="fr"
            />
        );
        expect(textarea).toHaveClass("font-notosans");
    });

    test("applies correct font size based on editText length", () => {
        const { rerender } = render(
            <EditDisplay
                editText={generateText(4, 600)}
                setEditText={mockSetEditText}
                targetLang="en"
            />
        );
        let textarea = screen.getByRole("textbox");
        expect(textarea).toHaveClass("text-lg");

        rerender(
            <EditDisplay
                editText={generateText(600, 1000)}
                setEditText={mockSetEditText}
                targetLang="en"
            />
        );
        textarea = screen.getByRole("textbox");
        expect(textarea).toHaveClass("text-base");

        rerender(
            <EditDisplay
                editText={generateText(1001, 1200)}
                setEditText={mockSetEditText}
                targetLang="en"
            />
        );
        textarea = screen.getByRole("textbox");
        expect(textarea).toHaveClass("text-sm");
    });
})



function generateText(minLength, maxLength) {
    const lorem = "In the vast expanse of human experience, few things are as consistently transformative as the pursuit of knowledge. From the earliest days of recorded history, people have sought to understand the world around them, pushing the boundaries of what is known and exploring the depths of what is yet to be discovered. This journey, marked by curiosity and innovation, has led to incredible advancements in science, technology, and culture. The quest for understanding is not just about accumulating facts but about challenging existing paradigms and questioning the status quo. It is a process that drives progress and fosters a deeper appreciation for the complexity of the universe. As we continue to explore new frontiers, it is essential to recognize the value of this pursuit and the impact it has on our lives and society. By embracing the challenges and uncertainties that come with seeking knowledge, we open ourselves up to new possibilities and contribute to the collective advancement of humanity. This ongoing journey is both a personal and a shared endeavor, shaping our world and influencing future generations.";

    // Randomly select a starting point within the lorem text
    const start = Math.floor(Math.random() * (lorem.length - maxLength));

    // Ensure the text length is between minLength and maxLength
    const end = Math.min(start + minLength + Math.floor(Math.random() * (maxLength - minLength)), lorem.length);

    return lorem.substring(start, end);
}