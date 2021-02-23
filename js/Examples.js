const examples = {
    "Assignment": `;pi is predefined\ncls\na=3<5-2\nb="a"=="a":a0_A = 3 * -5\ncc = 15 and 7:xcv = "\q\\\\\a"\naäßé_µµ=5\ndump`,
    "Print": `cls:println "🍕" * 20 + "!"\nk=9:println "abc", 2, "rr" ,k\n\nprint "Hello\\n":println "World!"\nprintln ---3 * 2.5\n\n; cprint writes to the js console\ncprint "console.log emulation"`,
    "IfThen1": `cls\na = 5:if a > 0 then a_cond = "Ja"\nif a == 0 then result = "true" else result = "false"\ndump\nif 0 then print "Yes":print "Always"`,
    "IfThen2": `cls\nif 0 then print "true" else print "false"\nif 1 then print "true" else print "false"\nif 0\n print "true"\nelse\n print "false"\nendif\nif 1\n print "true"\nelse\n print "false"\nendif\n`,
    "While": `cls\na=10:while a>5 do a=a-1:println a\nprintln\na=10:while a>5\n\tprintln a\n\ta = a - 0.5\nendwhile\ndump`,
    "For": `cls\nk = 7500\nfor i=1 to 8\n    println i, " : ", k, " = ", k / i\nnext\n\nfor j = 50 to 20 step -2 do println j`,
    "List": `cls\na = []\na = [3, "Abc", 1] + [4]\nz=[10, 11, 12][-1]\nb = 0:x = [5, 0, -5, "Hallo"][b]\nb = 3:x = [5, 0, -5, "Hallo"][b]:dump\nprintln ["Ja", "Nein"][0]\nprintln a[0], ", ", a[3]\naz=[[5,4,3],[],"Test", [1,2,3]]:bz=az[0]:cz=az[-1]:dz=bz[2]:dump`,
    "Namespaces": `cls:a = 5:dump\n\nnamespace abc\nprintln "in 'abc'"\na = pi:dump\nendnamespace\nprintln "after 'abc'"\ndump`,
    "Function": `cls\nfunction test()\n  println "Hallo"\n  a = 5:dump\nendfunction\na = test()\ntest()`,
    "Function2": `cls\na=345:x=789\ndump\nfunction test(a, b, c)\n  b = x\n  dump\nendfunction\ntest(a * 5, 2, "Test")\ndump`,
    "Graphic": `color 200, 80, 255\npoint 10, 10\ncolor 20, 20, 80:line 20, 20, 80, 80`,
    "Error": `a=1a`
}
