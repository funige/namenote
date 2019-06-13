module.exports = {
  'root': true,
  'env': {
    'node': false,
    'browser': true,
    'jquery': true
  },
  'globals': {
    'APP': true // グローバル変数を警告対象から外す
  },
  'extends': [
    'airbnb-base/legacy',
  ],
  'rules': {
    /*
    'func-names': [ 'off' ],
    'linebreak-style': [ 'error', 'unix' ],
    'no-unused-vars': [ 'error', { 'args': 'none' } ],
    'no-console': [ 'off' ],
    'no-use-before-define': [ 'off' ],
    'vars-on-top': [ 'off' ],
    'no-underscore-dangle': [ 'off' ],
    'no-plusplus': [ 'off' ],
    'spaced-comment': ['error', 'always', { 'markers': ['/'] }],
    'no-param-reassign': ['error', { 'props': false }]
    */
  },
  
  "parserOptions": {
    "sourceType": "module"
  }
};
