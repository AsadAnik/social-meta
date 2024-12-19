import { toast } from 'react-toastify';

export const handleApiError = (error, customMessage = 'Something went wrong.') => {
    console.error(customMessage, error.message);
    toast.error(customMessage);
    return error.response?.data?.message || customMessage;
};
