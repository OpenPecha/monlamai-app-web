import { render, screen, fireEvent,waitFor } from "@testing-library/react"
import FileUpload from "../FileUpload"
import { toast } from 'react-toastify';
import axios from "axios"
import { isJSDocSeeTag } from "typescript";

jest.mock('react-toastify', () => {
    const toast = jest.fn();
    toast.info = jest.fn();
    toast.error = jest.fn();
    toast.POSITION = {
        BOTTOM_RIGHT: 'bottom-right'
    };
    return {
        toast
    };
});

jest.mock("axios")

jest.mock('react-dropzone', () => {
    return {
        useDropzone: jest.fn(({ onDrop, accept, multiple }) => ({
            getRootProps: jest.fn(() => ({
                onClick: jest.fn(),
                onDrop: (event) => {
                    onDrop(event.dataTransfer.files);
                },
            })),
            getInputProps: jest.fn(),
            isDragActive: false,
            acceptedFiles: []
        })),
    };
});



describe("file upload component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const mockSetFile = jest.fn()
    const mockSetInputUrl = jest.fn()
    const supported = [".txt", ".docs"]
    
    test("should render file input when no file is uploaded", () => {
        render(<FileUpload
            setFile={mockSetFile}
            setInputUrl={mockSetInputUrl}
            supported={supported}
            model="mt" />)
        const uploadIcon = screen.getByRole("img")
        expect(uploadIcon).toBeInTheDocument()
    })

    test("should render and handle file drop", () => {
        const { container } = render(
            <FileUpload
                setFile={mockSetFile}
                setInputUrl={mockSetInputUrl}
                supported={supported}
                model="mt" />
        );

        const dropzone = container.querySelector('.flex-1.flex.cursor-pointer');

        const file = new File(['content'], 'example.txt', { type: 'text/plain' });

        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: [file],
            },
        });

        expect(mockSetFile).toHaveBeenCalledWith(file);
        expect(screen.getByRole("button",{name:/x/i})).toBeInTheDocument()
    })

    test("handle upload file and progress correctly", async () => { 
        const mockResponse = { data: { url: "https://example.com/upload" } }
        axios.post.mockResolvedValueOnce(mockResponse);
        axios.put.mockResolvedValueOnce({ status: 200, config: { url: 'https://example.com/upload' } });

        const { container } = render(
            <FileUpload
                setFile={mockSetFile}
                setInputUrl={mockSetInputUrl}
                supported={supported}
                model="mt" />
        );

        const dropzone = container.querySelector('.flex-1.flex.cursor-pointer');
        const file = new File(['content'], 'example.txt', { type: 'text/plain' });

        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: [file],
            },
        });
        await waitFor(() => {
            expect(mockSetFile).toHaveBeenCalledWith(file);
            expect(axios.post).toHaveBeenCalledWith('/api/get_presigned_url', expect.any(FormData));
            expect(axios.put).toHaveBeenCalledWith('https://example.com/upload', file, expect.any(Object));
            expect(mockSetInputUrl).toHaveBeenCalledWith('https://example.com/upload');
        });
    })
    test("should toast msg if upload unsupported file",()=> {
        const { container } = render(
            <FileUpload
                setFile={mockSetFile}
                setInputUrl={mockSetInputUrl}
                supported={supported}
                model="mt" />
        );

        const dropzone = container.querySelector('.flex-1.flex.cursor-pointer');

        const file = new File(['content'], 'example.pdf', { type: 'application/pdf' });

        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: [file],
            },
        });
        expect(mockSetFile).toHaveBeenCalledWith(file);
        expect(toast.info).toHaveBeenCalledWith("Unsupported file type.", {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    })
})