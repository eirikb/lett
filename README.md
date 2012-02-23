[lett](http://eirikb.github.com/lett)
===

"lett" stands for Lett is Not a Language  
  
It's JS interpreting text and trying to execute it.  
Using the lexical parser called substring.  
Not to be confused with CoffeeScript, it's not the same in any way.

Usage
---

```bash
npm install lett
```

```JavaScript
var lett = require('lett'),
script = '+(1 2)';

console.log(lett(script));
```

Or add it to your webpage

```HTML
<script src="https://raw.github.com/eirikb/lett/master/lett.min.js"></script>

<script>
    window.onload = function() {
        console.log(lett('+(1 2)'));
    };
</script>
```

Benefits
---

* You do things differently, hence you are cool
* Use it before it's known to reach hipster status
* Cleaner code
* More readable code (I approve)
* Almost works
* One-time interpreting (not that slow)
* Semi-integration of underscore.js without augmenting
* Small footprint

How it works
---

lett is suppose to be a feature-less language (err library) without keywords and few symbols.  
Current symbols are:

    . ( ) { } ' "


### Creating objects

    hello 'world!'


    welcome { 
        to 'the world'
        and {
            in 'the'
            year 2012
        }
    } 

### Calling functions

    console.log('hello' 'world')

### Creating functions

    ()

### Functions with arguments

    (a b c console.log(a b c))

### Function bodies
Last value is returned

    (a b c (
        console.log('Adding: ' a b c)
        +(a b c)))
 
### Chaining

    array(1 2 3).map(
        (i +(i i)))

### Semi-integration with underscore

    last(array(1 2 3))

Underscore
---

Is awesome.  
If underscore is available you can call it directly, like this

    first(array(1 2 3))

For documentation on underscore please see http://documentcloud.github.com/underscore  
I have no idea what works and what fails.  

__Simple dump of some functions__:  

"each(list, iterator, [context])  
map(list, iterator, [context])  
reduce(list, iterator, memo, [context])  
reduceRight(list, iterator, memo, [context])  
find(list, iterator, [context])  
filter(list, iterator, [context])  
reject(list, iterator, [context])  
all(list, iterator, [context])  
any(list, [iterator], [context])  
include(list, value)  
invoke(list, methodName, [*arguments])  
pluck(list, propertyName)  
max(list, [iterator], [context])  
min(list, [iterator], [context])  
sortBy(list, iterator, [context])  
groupBy(list, iterator)  
sortedIndex(list, value, [iterator])  
shuffle(list)  
toArray(list)  
size(list)  
first(array, [n])  
initial(array, [n])  
last(array, [n])  
rest(array, [index])  
compact(array)  
flatten(array, [shallow])  
without(array, [*values])  
union(*arrays)  
intersection(*arrays)  
difference(array, *others)  
uniq(array, [isSorted], [iterator])  
zip(*arrays)  
indexOf(array, value, [isSorted])  
lastIndexOf(array, value)  
range([start], stop, [step])  
bind(function, object, [*arguments])  
bindAll(object, [*methodNames])  
memoize(function, [hashFunction])  
delay(function, wait, [*arguments])  
defer(function)  
throttle(function, wait)  
debounce(function, wait)  
once(function)  
after(count, function)  
wrap(function, wrapper)  
compose(*functions)  
keys(object)  
values(object)  
functions(object)  
extend(destination, *sources)  
defaults(object, *defaults)  
clone(object)  
tap(object, interceptor)  
has(object, key)  
isEqual(object, other)  
isEmpty(object)  
isElement(object)  
isArray(object)  
isArguments(object)  
isFunction(object)  
isString(object)  
isNumber(object)  
isBoolean(object)  
isDate(object)  
isRegExp(object)  
isNaN(object)  
isNull(object)  
isUndefined(variable)  
noConflict()  
identity(value)  
times(n, iterator)  
mixin(object)  
uniqueId([prefix])  
escape(string)  
template(templateString, [context])  
chain(obj)
