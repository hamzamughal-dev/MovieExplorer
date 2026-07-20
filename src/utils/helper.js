export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatRuntime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};

export const isValid = (val) => {
    if (val === null || val === undefined || Number.isNaN(val)) return false;

    if (typeof val === 'string') {
        const trimmed = val.trim().toUpperCase();
        return trimmed !== '' && trimmed !== 'N/A';
    }

    if (typeof val === 'number') {
        return val > 0;
    }

    if (Array.isArray(val)) {
        return val.length > 0;
    }

    return true;
};
