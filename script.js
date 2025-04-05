function runScript(){
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    var debugB = document.getElementById("debug").checked;

    var special = {}

    special["$start"] = '======= started =======' + "\n";
    special["$end"] = '======= finshed =======' + '\n' + "\n";

    special["$debugStart"] = "\n" + "====== debug started ======" + "\n";
    special["$debugEnd"] = "====== debug finished ======" + "\n" + "\n";

    var lineByLine = input.value.split("\n");

    const defaultFunctionRegEx = [
        /(print)\((.+)\);/i,
    ];

    const defaultVariableRegEx = [
        /(int) (\w+) = (\d+);/,
        /(text) (\w+) = "(\w+)";/,
        /(bool) (\w+) = (true|false|1|0);/,
        /(special) (\$\w+) = "(\w+)";/
    ];

    const changeValueRegEx = [
        /(\w+) = int\s*(\d+)/,
        /(\w+) = text\s*"(\w+)"/,
        /(\w+) = bool\s*(true|false|1|0)/,
        /(\w+) = special\s*"(\w+)"/
    ]

    var orders = [];
    var variables = [];
    var stop = false;

    for (let line = 0; line < lineByLine.length; line++){
        let found = false;

        for (func of defaultFunctionRegEx){
            var match = lineByLine[line].match(func);
            if (match){
                orders.push({name : match[1], value : match[2], line : line+1, bonus : match[0]})
                found = true;
            }
        }

        for (let variable of defaultVariableRegEx){
            var match = lineByLine[line].match(variable);
            if (match){
                orders.push({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[1]});
                variables.push(({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[3]}));
                found = true;
            }
        }

        if (!found){
            output.textContent += special["$start"]
            raiseErr(`error 2: couldn't find the meaning of line ${line+1}`)
            stop = true;
        }
    }
    if (!stop){
        output.textContent += special["$start"]
        
        var count = 1;

        for (let order of orders){
            if (order.name == "print"){
                printOut(order.value, variables, count);
            }
    
            if (order.dataType == "int"){
                if (debugB){
                    debugVariables(order, variables, count)
                }
            }
    
            if (order.dataType == "text"){
                if (debugB){
                    debugVariables(order, variables, count)
                }
            }
    
            if (order.dataType == "bool"){
                if (debugB){
                    debugVariables(order, variables, count)
                }
            }
    
            if (order.dataType == "special"){
                if (debugB){
                    debugVariables(order, variables, count)
                }
            }

            count++;
        }
    }

    output.textContent += special["$end"]
}

function printOut(print, vars, lineCount){
    var output = document.getElementById("output");

    var canWe = false;

    for (v of vars){
        if (print == v.name){
            canWe = true;
            print = v.value;
            break;
        }
    }

    if (!canWe && print[0] == '"' && print[print.length-1] == '"'){
        print = print.slice(1,-1)
        canWe = true;
    }
    else if(!canWe && (print[0] != '"' || print[print.length-1] != '"')){
        raiseErr(`error 1: forgot to use qutation marks on line ${lineCount}`);
    }

    if (canWe){
        output.textContent += print + "\n";
    }
}

function debugVariables(v, vars){
    printOut(`"Line ${v.line}, name ${v.name}, datatype ${v.dataType}"`, vars)
}

function clearConsole(){
    var output = document.getElementById("output");
    output.textContent = "";
}

function raiseErr(errorMsg){
    var output = document.getElementById("output");

    output.textContent += `${errorMsg} \n`
}