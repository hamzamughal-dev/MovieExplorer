import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

import useStore from '../store/authStore';
import { getSessionID, getAccountDetails } from '../api/api';
import { LOGIN_USERNAME, LOGIN_PASSWORD } from '../utils/constants';

import { loginSchema } from '../schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';

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
        mutationFn: async () => {
            const response = await getSessionID();
            const guestSessionID = response.data?.guest_session_id;

            if (!guestSessionID) {
                throw new Error("Failed to generate guest session ID");
            }

            let accountID = null;
            try {
                const accountDetails = await getAccountDetails();
                accountID = accountDetails?.id ?? null;
            } catch (error) {
                console.error("Could not fetch account details:", error);
            }

            return { guestSessionID, accountID };
        },
        onSuccess: ({ guestSessionID, accountID }) => {
            setSessionID(guestSessionID);
            if (accountID) setAccountID(accountID);
        },
        onError: (error) => {
            toast.error(error.message, { theme: "dark" });
            reset();
        }
    });

    const handleLogin = (data) => {
        if (data.userName !== LOGIN_USERNAME || data.password !== LOGIN_PASSWORD) {
            toast.error("Invalid Credentials", { theme: "dark" });
            reset();
            return;
        }
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
