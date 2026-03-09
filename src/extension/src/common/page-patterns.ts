interface PagePatterns {
    page: {
        stockOrder: RegExp;
    };
}

const patterns: PagePatterns = {
    page: {
        stockOrder: /https:\/\/www.tossinvest.com\/stocks\/(A[0-9]{6})\/order/,
    },
};

export { patterns, type PagePatterns };
