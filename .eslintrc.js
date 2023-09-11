module.exports = {
    extends: 'eslint:recommended',
    env: {
        commonjs: false,
        es2020: true,
        node: true
    },
    perserOptions: {
        ecmaVersion: 12
    },
    rules: {
        quotes: ['error', 'double']
    }
};