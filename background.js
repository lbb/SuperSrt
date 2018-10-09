const rules = {
    "m": {
        redirectUrl: "https://mail.google.com",
        redirectRegexUrl: "https://mail.google.com/mail/u/0/#search/$1",
        matchRegex: "(.*)",
    },
    "c": {
        redirectUrl: "https://calendar.google.com",
        redirectRegexUrl: "https://calendar.google.com/calendar/r/search?q=$1",
        matchRegex: "(.*)",
    },
    "g": {
        redirectUrl: "https://github.com",
        redirectRegexUrl: "https://github.com/$1",
        matchRegex: "(.*)",
    },
    "t": {
        redirectUrl: "https://twitter.com",
        redirectRegexUrl: "https://twitter.com/$1",
        matchRegex: "(.*)",
    },
    "hn": {
        redirectUrl: "https://news.ycombinator.com",
        redirectRegexUrl: "https://hn.algolia.com/?query=$1&sort=byPopularity&prefix&page=0&dateRange=all&type=story",
        matchRegex: "(.*)",
    },
};


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = new URL(details.url);

        // move to static default before function
        let sr = null;
        if (syncedRule == null)
            sr = rules;
        else
            sr = syncedRule;

        const target = sr[url.host];
        if (target != null) {
            let redirectingURL = target.redirectUrl;
            if (url.pathname !== "/" && target.matchRegex !== "") {
                redirectingURL = url.pathname.substr(1).replace(new RegExp(target.matchRegex), target.redirectRegexUrl);
            }
            return {
                redirectUrl: redirectingURL,
            };
        }
        return {};
    },
    {urls: ["<all_urls>"]},
    ["blocking"],
);


chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.get('rules', ({rules: loadedRules}) => {
        if (loadedRules == null) chrome.storage.local.set({rules: rules});
    });
});


chrome.storage.local.get('rules', ({rules: loadedRules}) => {
    console.log("loaded rules");
    console.log(loadedRules);
    syncedRule = loadedRules;
});
