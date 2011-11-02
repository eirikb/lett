lett
-

"lett" stands for Lett Is Not a Language

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

