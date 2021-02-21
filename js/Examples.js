const examples = {
    "Assignment": `;pi is predefined\na=3<5-2\nb="a"=="a":a0_A = 3 * -5\ncc = 15 and 7:xcv = "\q\\\\\a"\naäßé_µµ=5\ndump`,
    "Print": `println "abc" * 3 + "xyz"\n\nprint "Hello\\n":println "World!"\nprintln ---3 * 2.5\n\n\nprint "🍕!\\n"\n; cprint writes to the js console\ncprint "console.log emulation"`,
    "IfThen1": `a = 5:if a > 0 then a_cond = "Ja"\nif a == 0 then result = "true" else result = "false"\ndump`,
    "IfThen2": `if 0 then print "true" else print "false"\nif 1 then print "true" else print "false"\nif 0\n print "true"\nelse\n print "false"\nendif\nif 1\n print "true"\nelse\n print "false"\nendif\n`,
    "While": `a=10:while a>5 do a=a-1:println a\nprintln\na=10:while a>5\n\tprintln a\n\ta = a - 0.5\nendwhile\ndump`,
    

    "Error": `a=1a`
}
