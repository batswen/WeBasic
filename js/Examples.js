const examples = {
    "Assignment": `;pi is predefined\na=3<5-2\nb="a"=="a":a0_A = 3 * -5\ncc = 15 and 7:xcv = "\q\\\\\a"\naäßé_µµ=5\ndump`,
    "Print": `k=9:println "abc" * 3 + "xyz", 2, "rr" ,k\n\nprint "Hello\\n":println "World!"\nprintln ---3 * 2.5\n\n\nprint "🍕!\\n"\n; cprint writes to the js console\ncprint "console.log emulation"`,
    "IfThen1": `a = 5:if a > 0 then a_cond = "Ja"\nif a == 0 then result = "true" else result = "false"\ndump\nif 0 then print "Yes":print "Always"`,
    "IfThen2": `if 0 then print "true" else print "false"\nif 1 then print "true" else print "false"\nif 0\n print "true"\nelse\n print "false"\nendif\nif 1\n print "true"\nelse\n print "false"\nendif\n`,
    "While": `a=10:while a>5 do a=a-1:println a\nprintln\na=10:while a>5\n\tprintln a\n\ta = a - 0.5\nendwhile\ndump`,
    "List": `a=[]:dump\na=[3,2,1]:dump\nb = 0:x = [5, 0, -5, "Hallo"][b]:dump\nb = 3:x = [5, 0, -5, "Hallo"][b]:dump\nprintln ["Ja", "Nein"][0]\nprintln a[0]`,

    "Error": `a=1a`
}
