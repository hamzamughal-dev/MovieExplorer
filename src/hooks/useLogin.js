import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

import useStore from '../store/authStore';
import { getSessionID, getAccountDetails, getRequestToken, getLoginDetails } from '../api/api';


import { loginSchema } from '../schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { data } from 'react-router-dom';

export function useLogin() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const sessionID = useStore(state => state.sessionID);
    const setSessionID = useStore(state => state.setSessionID);
    const setAccountID = useStore(state => state.setAccountID);

    const isLoggedIn = !!sessionID;

    const {
        mutate: login,
        isPending: isLoading
    } = useMutation({
        mutationKey: ['login'],
        mutationFn: async (data) => {

            const requestToken = await getRequestToken();
            const requestTokenValue = requestToken.data?.request_token;

            await getLoginDetails(data.userName, data.password, requestTokenValue);
            const sessionResponse = await getSessionID(requestTokenValue);
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
        },
        onSuccess: ({ sessionID, accountID }) => {
            setSessionID(sessionID);
            if (accountID) setAccountID(accountID);
        },
        onError: (error) => {
            toast.error("Invalid Credentials", { theme: "dark" });
            reset();
        }
    });

    const handleLogin = (data) => {

        login(data);
    };

    return {
        register,
        handleSubmit,
        errors,
        isLoggedIn,
        isLoading,
        handleLogin
    };
}
