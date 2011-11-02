lett
-

"lett" stands for Lett Is Not a Language  
  
It's another hipster language, except that it is 
interpreted with JS, so it is probably ultraslow and horrible.  
Not to be confused with CoffeeScript, it's not the same in any way.

Run example
--

   node example/test.js example/helloworld.lett

Example
--

    my.lett-lib: {
        a: 'hello', 
        b: 'world', 
        i: 1337, 
        t: true, 

        add[a b]: +(a b),

        total-apples: my.lett-lib.add(100 200)
    }

