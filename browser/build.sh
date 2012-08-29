cat top.js ../corelib.js ../parser.js ../builder.js  bottom.js | grep -vE 'require' | uglifyjs > lett.min.js
