class RulesBinder {
    constructor(prefix = "short", {
        redirectUrl = "https://github.com/",
        matchRegex = "(.*)",
        redirectRegexUrl = "https://github.com/$1"
    }) {
        let row = document.createElement("tr");
        for (let i of [prefix, redirectUrl, matchRegex, redirectRegexUrl]) {
            console.log(i);
            let col = document.createElement("td");
            let input = document.createElement("input");
            input.value = i;
            col.appendChild(input);
            row.appendChild(col);
        }

        let col = document.createElement("td");
        col.appendChild(this._delButton());
        row.appendChild(col);

        this._element = row;
    }

    _delButton() {
        let button = document.createElement('button');
        let icon = document.createElement('i');
        icon.appendChild(document.createTextNode("delete"));
        icon.className = "material-icons";
        componentHandler.upgradeElement(icon);
        button.appendChild(icon);
        button.className = 'mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect';
        componentHandler.upgradeElement(button);
        button.addEventListener("click", () => {
            this._element.remove();
        });
        return button;
    }

    row() {
        return this._element;
    }

    rule() {
        if (this._element == null)
            return {"": {}};
        return {
            [this._element.children[0].firstChild.value]: {
                redirectUrl: sanitiseURL(this._element.children[1].firstChild.value),
                matchRegex: this._element.children[2].firstChild.value,
                redirectRegexUrl: this._element.children[3].firstChild.value,
            }
        };
    }
}


const content = document.getElementById("table");
const newButton = document.getElementById("new");
const saveButton = document.getElementById("save");
const cancelButton = document.getElementById("cancel");

chrome.storage.local.get('rules', ({rules: rules}) => {
    if (!Object.keys(rules).length) {
        rules = {"": {}};
    }

    console.log(rules);

    let controllers = Object.keys(rules).map(key => {
        let controller = new RulesBinder(key, rules[key]);
        content.appendChild(controller.row());
        return controller;
    });

    newButton.addEventListener("click", () => {
        let controller = new RulesBinder("", {});
        content.appendChild(controller.row());
        controllers.push(controller);
    });

    saveButton.addEventListener("click", () => {
        let rules = {};
        controllers.forEach(c => {
            let value = c.rule();
            let keys = Object.keys(value);
            if (keys.indexOf("") === -1)
                Object.assign(rules, value);
        });
        chrome.storage.local.set({rules: rules}, () => chrome.runtime.reload());
    });

    cancelButton.addEventListener("click", () => {
        chrome.runtime.reload();
    });
});

function sanitiseURL(raw) {
    if (!raw.match(/^\S+:\/\//)) {
        return "https://" + raw;
    }
    return raw;
}












































