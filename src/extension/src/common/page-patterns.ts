interface PagePatterns {
    page: {
        stockOrder: RegExp;
        mainPage: RegExp;
    };
}

const patterns: PagePatterns = {
    page: {
        stockOrder: /https:\/\/www.tossinvest.com\/stocks\/(A[0-9]{6})\/order/,
        mainPage: /^https:\/\/www\.tossinvest\.com\/?(\?[^#]*)?$/,
    },
};

export { patterns, type PagePatterns };
