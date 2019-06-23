module.exports = {
  'root': true,
  'env': {
    'node': false,
    'browser': true,
    'jquery': true
  },
  'globals': {
    'T': true,
    '$': true,
    'LOG': true,
    'WARN': true,
    'ERROR': true,
    'Sortable': true,
    'Mousetrap': true
  },
  'extends': [
    'airbnb-base/legacy'
  ],
  
  "env": {
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2017
  },
  'rules': {
    'no-console': [ 'off' ],
    'func-names': [ 'off' ],
    'class-methods-use-this': [ 'off' ],
    'no-param-reassign': ['error', { 'props': false }],

    /*
    'linebreak-style': [ 'error', 'unix' ],
    'no-unused-vars': [ 'error', { 'args': 'none' } ],
    'no-use-before-define': [ 'off' ],
    'vars-on-top': [ 'off' ],
    'no-underscore-dangle': [ 'off' ],
    'no-plusplus': [ 'off' ],
    'spaced-comment': ['error', 'always', { 'markers': ['/'] }],
    */
  },
};
