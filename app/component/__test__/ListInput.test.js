import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListInput from '../ListInput';
import { toast } from 'react-toastify';
import { Form, useRouteLoaderData } from '@remix-run/react';

jest.mock('@remix-run/react', () => ({
    Form: jest.fn(),
    useRouteLoaderData: jest.fn(),
}));
jest.mock('../hooks/useLitteraTranslation', () => jest.fn(() => ({
    translation: { login: 'Login', login_message: 'Please log in', beta: 'Beta' },
    locale: 'en',
    isTibetan: false,
})));
jest.mock('react-toastify', () => {
    const toast = jest.fn()
    toast.info = jest.fn(()=>{})
    toast.POSITION = {
        BOTTOM_CENTER:"bottom-center"
    }
    return {
        toast
    }
});

describe('ListInput', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const setSelectedTool = jest.fn();
    const reset = jest.fn();

    const options = ['text', 'document', 'recording', 'image', 'zip', 'PDF', 'file'];
    
    const renderComponent = (isUserLoggedIn, fileUploadEnable) => {
        useRouteLoaderData.mockReturnValue({
            user: isUserLoggedIn ? { name: 'Test User' } : null,
            file_upload_enable: fileUploadEnable,
        });

        render(
            <ListInput
                selectedTool="text"
                setSelectedTool={setSelectedTool}
                options={options}
                reset={reset}
            />
        );
    };

    test('renders correctly with given options', () => {
        renderComponent(true, true);
        options.forEach(option => {
            const tab = screen.getByText(new RegExp(option, 'i'));
            expect(tab).toBeInTheDocument();
        });
    });

    test('calls setSelectedTool and reset when allowed tab is clicked', () => {
        renderComponent(true, true);
        const tab = screen.getByText(/text/i);
        fireEvent.click(tab);
        expect(setSelectedTool).toHaveBeenCalledWith('text');
        expect(reset).toHaveBeenCalled();
    });

    test('displays toast notification for non-allowed tabs when not logged in', () => {
        renderComponent(false, true);
        const tab = screen.getByText(/document/i);
        fireEvent.click(tab);
        expect(toast.info).toHaveBeenCalled();
    });

    test.skip('Add "opacity-50 cursor-not-allowed" class for non-allowed tabs when not logged in', () => {
        renderComponent(false, true);
        const tab = screen.getByText(/document-icon/i);
        screen.debug()
        // expect(tab).toHaveClass(
        //     'text-sm',
        //     'capitalize',
        //     'flex',
        //     'items-center',
        //     'opacity-50',
        //     'cursor-not-allowed'
        // );
    });

    test('does not display non-beta tabs when file_upload_enable is false', () => {
        renderComponent(true, false);
        const tab = screen.queryByText(/document/i);
        expect(tab).toBeNull();
    });

    test('does not call toast when allowed tab is clicked by non-logged in user', () => {
        renderComponent(false, true);
        const tab = screen.getByText(/recording/i);
        fireEvent.click(tab);
        expect(toast.info).not.toHaveBeenCalled();
        expect(setSelectedTool).toHaveBeenCalledWith('recording');
    });
});
