var lineByLine;

function runScript(){
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    var debug = document.getElementById("debug").checked;

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

    for (let line = 0; line < lineByLine.length; line++){
        for (func of defaultFunctionRegEx){
            var match = lineByLine[line].match(func);
            if (match){
                orders.push({name : match[1], value : match[2], line : line+1, bonus : match[0]})
            }
        }

        for (let variable of defaultVariableRegEx){
            var match = lineByLine[line].match(variable);
            if (match){
                orders.push({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[1]});
                variables.push(({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[3]}));
            }
        }
    }

    output.textContent += special["$start"]


    for (let order of orders){
        if (order.name == "print"){
            printOut(order.value, variables);
        }

        if (order.dataType == "int"){
            if (debug){
                debugVariables(order)
            }
        }

        if (order.dataType == "text"){
            if (debug){
                debugVariables(order)
            }
        }

        if (order.dataType == "bool"){
            if (debug){
                debugVariables(order)
            }
        }

        if (order.dataType == "special"){
            if (debug){
                debugVariables(order)
            }
        }
    }

    output.textContent += special["$end"]
}

function printOut(print, vars){
    var output = document.getElementById("output");

    var canWe = false;

    for (v of vars){
        if (print == v){
            canWe = true;
            break;
        }
    }

    if (!canWe && print[0] == '"' && print[print.length-1] == '"'){
        print = print.slice(1,-1)
        canWe = true;
    }

    if (canWe){
        output.textContent += print + "\n";
    }
}

function debugVariables(v){
    printOut(`Line ${v.line}, ${v.name}, datatype ${v.value}`)
}

function clearConsole(){
    var output = document.getElementById("output");
    output.textContent = "";
}