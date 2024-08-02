module.exports = {
    preset: "ts-jest",
    transform: {
        "^.+\.(ts|tsx)?$": "ts-jest",
        "^.+\.(js|jsx)$": "babel-jest",
    },   
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/app/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    reporters: [
        "default",
        ["jest-html-reporter", {
            "pageTitle": "Test Report",
            "outputPath": "reports/test-report.html",
            "includeFailureMsg": true,
            "includeConsoleLog": true
        }]
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!(@web3-storage/multipart-parser|@another-module)/)',
    ],
    globals: {
        'ts-jest': {
            diagnostics: {
                warnOnly: true // This will turn TypeScript errors into warnings
            },
        },
    },
};
