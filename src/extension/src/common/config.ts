export const Config = {
    helper: {
        host: import.meta.env.VITE_HELPER_HOST,
    },
    toss: {
        wts: {
            certHost: import.meta.env.VITE_TOSS_WTS_CERT_HOST,
            infoHost: import.meta.env.VITE_TOSS_WTS_INFO_HOST,
        },
    },
};
