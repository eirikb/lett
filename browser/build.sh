top="lett = (function(){var exports={};module={};"
lett=$(cat ../corelib.js ../parser.js ../lett.js)
bottom="parser=exports;builder=exports;return module.exports;})()"
echo "$top $lett $bottom" | grep -vE 'require' | uglifyjs > lett.min.js
