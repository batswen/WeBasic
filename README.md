# WeBasic

A BASIC interpreter for websites

Very early stage

No documentation, look in grammar.txt

Blog: [webasiclang.blogspot.com](https://webasiclang.blogspot.com/)

Live demo: [WeBasic.bplaced.net](http://webasic.bplaced.net)

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
