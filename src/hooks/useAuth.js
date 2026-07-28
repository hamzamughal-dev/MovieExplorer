import useStore from '../store/authStore';

export function useAuth() {
    const sessionID = useStore((state) => state.sessionID);
    const accountID = useStore((state) => state.accountID);
    const setSessionID = useStore((state) => state.setSessionID);
    const setAccountID = useStore((state) => state.setAccountID);

    const isLoggedIn = !!sessionID;

    const logout = () => {
        setAccountID(0);
        setSessionID("");
        localStorage.removeItem("auth-storage");
    };

    return {
        sessionID,
        accountID,
        isLoggedIn,
        setSessionID,
        setAccountID,
        logout,
    };
}

export default useAuth;
