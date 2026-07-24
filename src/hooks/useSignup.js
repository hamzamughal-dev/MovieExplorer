import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import useStore from '../store/authStore';
import { signupSchema } from '../schemas/signupSchema';

export function useSignup() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: { gender: 'male' },
    });
    const [isLoading, setIsLoading] = useState(false);

    const sessionID = useStore(state => state.sessionID);
    const isLoggedIn = !!sessionID;

    const handleSignup = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.info("Registration demo: Please use your .env credentials on Login.", { theme: "dark" });
        }, 1200);
    };

    return {
        register,
        handleSubmit,
        errors,
        isLoading,
        isLoggedIn,
        handleSignup
    };
}
