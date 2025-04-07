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
        /^(print)\((.+)\);$/i,
    ];

    const defaultVariableRegEx = [
        /^(int) (\w+) = (\d+);$/,
        /^(text) (\w+) = "([^"]+)";$/,
        /^(bool) (\w+) = (true|false|1|0);$/,
        /^(special) (\$\w+) = "(\w+)";$/
    ];

    const changeValueRegEx = [
        /^(\w+) = (int)\s*(\d+);$/,
        /^(\w+) = (text)\s*"([^"]+)"\;$/,
        /^(\w+) = (bool)\s*(true|false|1|0);$/,
        /^(\w+) = (special)\s*"(\w+)";$/
    ]

    const basicAritmetRegEx = [
        /^(int) (\w+) = (\d+|\w+) (\+) (\d+|\w+);$/,
        /^(int) (\w+) = (\d+|\w+) (-) (\d+|\w+);$/,
        /^(int) (\w+) = (\d+|\w+) (\*) (\d+|\w+);$/,
        /^(int) (\w+) = (\d+|\w+) (\/) (\d+|\w+);$/
    ]

    var orders = [];
    var variables = [];
    var stop = false;

    for (let line = 0; line < lineByLine.length; line++){
        let found = false;

        if (lineByLine[line][0] == "#" || lineByLine[line][0] == "/"){
            continue;
        }

        for (func of defaultFunctionRegEx){
            var match = lineByLine[line].match(func);
            if (match){
                orders.push({name : match[1], value : match[2], line : line+1, bonus : match[0], varChange : false, aritmetic : false})
                found = true;
            }
        }

        for (let variable of defaultVariableRegEx){
            var match = lineByLine[line].match(variable);
            if (match){
                orders.push({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[1]});
                variables.push(({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[3], varChange : false, aritmetic : false}));
                found = true;
            }
        }

        for (let variableChange of changeValueRegEx){
            var match = lineByLine[line].match(variableChange);
            if (match){
                orders.push({name : match[1], value : match[3], line : line+1, bonus : match[0], dataType : match[1], varChange : true, aritmetic : false});
                //variables.push(({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[3]}));
                found = true;
            }
        }

        for(let aritmetics of basicAritmetRegEx){
            var match = lineByLine[line].match(aritmetics);
            if (match){
                orders.push({name : match[2], value : {value1: match[3], value2 : match[5], aritmetic : match[4]}, line : line+1, bonus : match[0], dataType : match[1], varChange : true, aritmetic : true});
                //variables.push(({name : match[2], value : {value1: match[3], value2 : match[4], aritmetic : match[3]}, line : line+1, bonus : match[0], dataType : match[2], varChange : true, aritmetic : true}));
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
            
            if (order.varChange){
                if (!order.aritmetic){
                    for (let vars of variables){
                        if (vars.name == order.name){
                            vars = changeVariable(vars, order)
                        }
                    }
                }
                if (order.aritmetic){
                    var tempVar = variableConstructor(order, variables);
                    var changed = false;
                    for (let vars of variables){
                        if (vars.name == order.name){
                            vars.value = tempVar.value;
                            changed = true;
                        }
                    }

                    if (!changed){
                        variables.push(tempVar);
                    }
                }
            }

            count++;
        }
    }

    output.textContent += special["$end"]
}

function variableConstructor(objectToVar, variables){
    var sVariable = {};
    
    //console.log(objectToVar.value.value1, objectToVar.value.value2, variables)
    
    if (!nameToVar(objectToVar.value.value1, variables)){
        var tempNum1 = Number(objectToVar.value.value1);
    }
    else{
        var tempNum1 = Number(nameToVar(objectToVar.value.value1, variables));
    }

    if (!nameToVar(objectToVar.value.value2, variables)){
        var tempNum2 = Number(objectToVar.value.value2);
    }
    else{
        var tempNum2 = Number(nameToVar(objectToVar.value.value2, variables));
    }

    var operation = objectToVar.value.aritmetic;

    sVariable.name = objectToVar.name;
    sVariable.bonus = objectToVar.bonus;
    sVariable.dataType = objectToVar.dataType;
    sVariable.line = objectToVar.line;
    sVariable.varChange = false;

    if (operation == "+"){
        sVariable.value = tempNum1 + tempNum2;
    }
    else if (operation == "-"){
        sVariable.value = tempNum1 - tempNum2;
    }
    else if (operation == "*"){
        sVariable.value = tempNum1 * tempNum2;
    }
    else if (operation == "/"){
        if (tempNum2 == 0){
            sVariable.value = "undefined"
        }
        else{
            sVariable.value = tempNum1 / tempNum2;
        }
    }

    sVariable.value = parseInt(sVariable.value)

    return sVariable;
}
function changeVariable(vars, order){
    vars.name = order.name;
    vars.bonus = order.bonus;
    vars.dataType = order.dataType;
    vars.line = order.line;
    vars.value = order.value;
    vars.varChange = false;

    return vars;
}

function nameToVar(variable, variables){
    for (v of variables){
        if (variable == v.name){
            return v.value;
        }
    }

    return false;

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
    printOut(`"Line ${v.line}, name ${v.name}, datatype ${v.dataType}, value ${v.value}"`, vars)
}

function clearConsole(){
    var output = document.getElementById("output");
    output.textContent = "";
}

function raiseErr(errorMsg){
    var output = document.getElementById("output");

    output.textContent += `${errorMsg} \n`
}