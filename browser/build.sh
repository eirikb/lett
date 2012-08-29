top="lett = (function(){var exports={};module={};"
lett=$(cat ../corelib.js ../parser.js ../builder.js ../lett.js)
bottom="return module.exports;})()"
echo "$top $lett $bottom" | grep -vE 'require' | uglifyjs > lett.min.js
