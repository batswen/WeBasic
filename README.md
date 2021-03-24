# WeBasic

A BASIC interpreter for websites


No documentation yet, look in grammar.txt

Live demo: [batswen.github.io](http://batswen.github.io)

### Known bugs
* List access (r/w) isn't recursive
* Namespaces can be declared but not accessed

### Variable assignment
var = value

#### Variables
First character must be $_a-zA_Z, then $_0-9\p{L}

#### List
[expr, expr, ...]

Read access: [...][index]

Write access: a[index]=...


#### Integer
12345

#### Float
12345.6789

#### Strings
"Must be in quotes."

Escapes:

|Esc|Replaced with|
|-|-|
|`\n`|`newline`|
|`\\`|`\`|
|`\q`|`"`|
|`\a`|`'`|
