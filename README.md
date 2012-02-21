[lett](http://eirikb.github.com/lett)
===

"lett" stands for Lett is Not a Language  
  
It's JS interpreting text and trying to execute it.  
Using the lexical parser called substring.  
Not to be confused with CoffeeScript, it's not the same in any way.

How it works
---

lett is suppose to be a feature-less language without keywords and few symbols.  
Current symbols are:

    . ( ) { } ' "


### Creating objects

    hello 'world!'

    welcome { 
        to 'the world'
        and {
            the 'rest'
            year 2012
        }
    } 

### Calling functions

    console.log('hello' 'world)

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
