import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

import useAuth from './useAuth';
import { getSessionID, getAccountDetails, getRequestToken, getLoginDetails } from '../api/api';

export function useLogin() {
    const { isLoggedIn, setSessionID, setAccountID } = useAuth();

    const performLogin = async (data) => {
        const requestToken = await getRequestToken();
        const requestTokenValue = requestToken.data?.request_token;

        const loginResponse = await getLoginDetails(data.userName, data.password, requestTokenValue);
        const validateRequestToken = loginResponse.data.request_token;

        const sessionResponse = await getSessionID(validateRequestToken);
        const sessionIdValue = sessionResponse.data?.session_id;

        if (!sessionIdValue) {
            throw new Error("Failed to generate session ID");
        }

        let accountID = null;
        try {
            const accountDetails = await getAccountDetails(sessionIdValue);
            accountID = accountDetails?.id ?? null;
        } catch (error) {
            console.error("Could not fetch account details:", error);
        }

        return { sessionID: sessionIdValue, accountID };
    };

    const {
        mutate: login,
        isPending: isLoading
    } = useMutation({
        mutationKey: ['login'],
        mutationFn: performLogin,
        onSuccess: ({ sessionID, accountID }) => {
            setSessionID(sessionID);
            if (accountID) setAccountID(accountID);
        },
        onError: (error) => {
            toast.error("Invalid Credentials", { theme: "dark" });
        }
    });

    const handleLogin = (data, onSuccessCallback) => {
        login(data, {
            onSuccess: () => {
                if (onSuccessCallback) onSuccessCallback();
            }
        });
    };

    return {
        isLoggedIn,
        isLoading,
        handleLogin
    };
}

