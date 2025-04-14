# JCython

this repository is about my programming language I'm making in JS, HTML and CSS, this language is inspired by Python, C-based langs and other languages I've learned

# documentation

here's the documentation for this language and what it contains

# Comments

You can make comments with using `#` or `/`, either are fine and are one line comment, your line of code must start with them or you'll run into error. You can also skip lines with only new line or with whitespace, both shouldn't raise any errors.

## default functions

these functions are made by default and can be use (you can't yet make your own functions)

### print

if you write "print( + anything + )" it will print out everything between the brackets (you variables and it'll print anything you put there it needs to be surrounded by quotes)

## variables

you can make variables:
  - int - whole number
  - text - string in other languages
  - bool - true (1) or false (0) value
  - special - these variable type is special, they always start with $, it'll be used to change the programming language, not yet added

variables are made like this:
```cpp
int name = 10;
```

variables can be changed like this:
```cpp
name = int 10;
```

you can do basic arithmetic operations with variables like this, you can do all basic arithmetic operations (+,-,*,/):
```cpp
int name = 10 * 10;
```

with variables:
```js
int a = 10;
int b = a + 10;
print(b);
#output is 20, you can use all arithmetic operations for int in this example
```

//you can use anything from int, text or bool for now, name can be any alphanumeric values for any non 0 length, and int can have any whole number value for int

### special variables

Special variables are variables that has the `special` data type and all of the variables start with `$`, they do special stuff. Here are all the special variables you can use for now.
  - $start
    - $start can change the starting message when your code starts.
    - you can declare it as: 
      ```cpp 
      special $start = "hello";
      ```
      this will make it that your code starts with "hello" instead of the default.
    - default value: 
      ```js
      special["$start"] = '======= started =======' + "\n";
      ```

  - $end
    - $end can change the ending message when your code ends.
    - you can declare it as: 
      ```cpp 
      special $end = "bye";
      ```
      this will make it that your code ends with "bye" instead of the default.
    - default value: 
      ```js
      special["$end"] = '======= finished =======' + '\n' + "\n";
      ```
  - $debugStart
    - $debugStart can change the starting debug message when debug starts.
    - you can declare it as: 
      ```cpp 
      special $debugStart = "debug started :3";
      ```
      this will make it that your debug message starts with "debug started :3" instead of the default.
    - default value: 
      ```js
      special["$debugStart"] = "\n" + "====== debug started ======" + "\n";
      ```
  - $debugEnd
    - $debugEnd can change the ending debug message when debug ends.
    - you can declare it as: 
      ```cpp 
      special $start = "bai";
      ```
      this will make it that your debug message ends with "bai" instead of the default.
    - default value: 
      ```js
      special["$debugEnd"] = "====== debug finished ======" + "\n" + "\n";
      ```