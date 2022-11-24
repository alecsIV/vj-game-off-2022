module.exports = {
    "parser": "@babel/eslint-parser",
    "extends": "airbnb",
    "globals": {
        "window":   false,
        "document": false,
        "define":  true,
        "__": true,
        "___": true,
        "__lazyLoad": true,
        "DEV_SCAFFOLD": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module",
        "requireConfigFile": false,
    },
    "rules": { // override Airbnb here
        // ESLint knows nothing about our RequireJS paths setup, so will complain that it cannot find
        // the module you're trying to import. Would be nice to keep this linting in but not really
        // any good way of passing a RequireJS config to ESLint at time of writing.
        "import/no-unresolved": 0,
        "import/no-extraneous-dependencies": 0,
        "import/extensions": ["error", "never"],
        // Airbnb wants 2 spaces
        "indent": ["warn", 4],
        // Airbnb makes this error instead of warning.
        // More max-len config options at http://eslint.org/docs/rules/max-len
        "max-len": ["warn", 120],
        "no-unused-vars": ["warn"],
        "key-spacing": ["warn"],
        "quotes": ["warn"],
        // We often make use of property names in datasets that would make for invalid property names
        "dot-notation": 0,
        // Default is 1tbs; stroustrup is what you see in this file
        "brace-style": ["error", "stroustrup"],
        // Hybrid ES6 and AMD projects
        "import/no-amd": 0,
        // AMD support
        "no-new": 0,
        // disgusting
        "object-shorthand": 0,
        // leads to hoisting, but not an issue - and code is more readable
        "no-use-before-define": 0,
        // we already have the "no-var" rule, so it's useless to throw another error about a rogue var
        "vars-on-top": 0,
        // will only lead to more verbose code
        "no-mixed-operators": 0,
        // we have no-restricted-syntax enabled, no need to add another error
        "guard-for-in": 0,
        // gives an error when only one line is present in the function - which should not be an issue
        "arrow-body-style": 0,
        "arrow-parens": 0,
        "no-plusplus": ["warn", { "allowForLoopAfterthoughts": true }],
        "class-methods-use-this": 0,
    },
    "settings": {
        "import/resolver": {"node": {"extensions": [".js"]}}
    },
    "plugins": [
        "react",
        "jest",
    ],
    "env": {
        "browser": true,
        "jest": true,
    }
};
