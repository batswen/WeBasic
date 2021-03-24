const examples = {
    "Assignment": `var a,b,a0_A,cc,xcv,aäßé_µµ\ncls\na=3<5-2\nb="a"=="a":a0_A = 3 * -5\ncc = 15 and 7:xcv = "\q\\\\\a"\naäßé_µµ=5\ndump`,
    "Print": `cls:println "🍕" * 20 + "!"\nprintln "🔥"\nprintln "\\q\\\\\\a"\nvar k:k=9:println "abc", 2, "rr" ,k\n\nprint "Hello ":println "World!"\nprintln ---3 * 2.5\n\n; cprint writes to the js console\ncprint "console.log emulation"`,
    "IfThen1": `var a, a_cond, result\ncls\na = 5:if a > 0 then a_cond = "Ja"\nif a == 0 then result = "true" else result = "false"\ndump\nif 0 then print "Yes":print "Always"`,
    "IfThen2": `cls\nif 0 then print "true" else print "false"\nif 1 then print "true" else print "false"\nif 0\n print "true"\nelse\n print "false"\nendif\nif 1\n print "true"\nelse\n print "false"\nendif\n`,
    "While": `var a\ncls\na=10:while a>5 do a=a-1:println a\nprintln\na=10:while a>5\n\tprintln a\n\ta = a - 0.5\nendwhile\ndump`,
    "For": `cls\nvar k, i, j\nk = 7500\nfor i=1.0 to 8.0\n    println k, " : ", i, " = ", k / i\nnext\n\nfor j = 50.0 to 20.0 step -2.0 do if int(j) % 4 == 0 then print j, " "`,
    "List": `cls\nvar a, b, x, z, az, bz, cz, dz\na = []\na = [3, "Abc", 1] + [4]:a[2] = 9\nz=[10, 11, 12][-1]\nb = 0:x = [5, 0, -5, "Hallo"][b]\nb = 3:x = [5, 0, -5, "Hallo"][b]:dump\nprintln ["Ja", "Nein"][0]\nprintln a[0], ", ", a[3]\naz=[[5,4,3],[],"Test", [1,2,3]]:bz=az[0]:cz=az[-1]:dz=bz[2]:dump`,
    //"Namespaces": `var a\ncls:a = 5:dump\n\nnamespace abc\nvar a:println "in 'abc'"\na = pi:dump\nendnamespace\nprintln "after 'abc'"\ndump`,
    "Function": `cls\nvar a\nfunction test()\n  var a\n  println "Hallo"\n  a = 5:dump\nendfunction\na = test()\ntest()`,
    "Function2": `cls\nfunction test(f)\n  return f()\nendfunction\nfunction abc()\n  return "Yes"\nendfunction\nprintln test(abc)`,
    "Graphic": `var x\nclear\n\nstrokecolor 200, 80, 255\nfor x = 10.0 to 100.0 step 5.0 do point x, 10\nstrokecolor 20, 20, 80:line 20, 20, 80, 80`,
    "Error": `a=1a`,
    "Text-Apfelmännchen": `# Taken from Rosetta Code
# http://rosettacode.org/wiki/Compiler/Sample_programs#Ascii_Mandlebrot

# Core i7-870 / 8 GB / Win 10 (64 Bit) 
# Average after 10 times:
# Firefox (86.0):          1560 ms
# Chrome (88.0.4324.190):  2661 ms
# Edge (88.0.705.81):      3474 ms

var left_edge, right_edge, top_edge, bottom_edge
var x_step, y_step, max_iter
var x0, y0, x, y, i, x_x, y_y
var the_char

cls

left_edge   = -420
right_edge  =  300
top_edge    =  300
bottom_edge = -300
x_step      =    7
y_step      =   15

max_iter    =  200

y0 = top_edge
while y0 > bottom_edge
    x0 = left_edge
    while x0 < right_edge
        y = 0
        x = 0
        the_char = " "
        i = 0
        while i < max_iter
            x_x = (x * x) / 200
            y_y = (y * y) / 200
            if x_x + y_y > 800
                if (i > 9)
                    the_char = "@"
                else
                    the_char = [".","-",":","+","=","*","$","%","#", "M"][i]
                endif
                i = max_iter
            endif
            y = x * y / 100 + y0
            x = x_x - y_y + x0
            i = i + 1
        endwhile
        print the_char
        x0 = x0 + x_step
    endwhile
    println
    y0 = y0 - y_step
endwhile
`
}
