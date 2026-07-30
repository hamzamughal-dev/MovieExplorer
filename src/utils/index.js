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

export const getRatingColor = (rating) => {
    if (rating >= 7) return { text: 'text-green-400', border: 'border-green-400/20' };
    if (rating >= 5) return { text: 'text-yellow-400', border: 'border-yellow-400/20' };
    return { text: 'text-red-400', border: 'border-red-400/20' };
};

export const formatRating = (voteAverage, digits = 1) => {
    if (voteAverage === null || voteAverage === undefined || Number.isNaN(Number(voteAverage)) || Number(voteAverage) <= 0) {
        return 'N/A';
    }
    return Number(voteAverage).toFixed(digits);
};


