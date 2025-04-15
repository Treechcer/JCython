var debugB = document.getElementById("debug").checked;

function runScript(){
    var input = document.getElementById("input");
    var output = document.getElementById("output");

    var special = {}

    special["$start"] = '======= started =======' + "\n";
    special["$end"] = '======= finished =======' + '\n' + "\n";

    special["$debugStart"] = "\n" + "====== debug started ======" + "\n";
    special["$debugEnd"] = "====== debug finished ======" + "\n" + "\n";

    var lineByLine = input.value.split("\n");

    const defaultFunctionRegEx = [
        /^(print)\((.+)\);$/i,
    ];

    const defaultVariableRegEx = [
        /^(int) (\w+) = (\d+|\w+);$/,
        /^(text) (\w+) = ("*[^"]+"*);$/,
        /^(bool) (\w+) = (true|false|1|0|\w+);$/,
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

        if (lineByLine[line][0] == "#" || lineByLine[line][0] == "/" || lineByLine[line].trim() == ""){
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
                variables.push(({name : match[2], value : match[3], line : line+1, bonus : match[0], dataType : match[1], varChange : false, aritmetic : false}));
                found = true;

                //console.log(orders[line].value);

                if (orders[line].name == "$start"){
                    special["$start"] = orders[line].value + "\n";
                }

                if (orders[line].name == "$end"){
                    special["$end"] = orders[line].value + "\n";
                }

                if (orders[line].name == "$debugStart"){
                    special["$debugStart"] = orders[line].value + "\n";
                }

                if (orders[line].name == "$debugEnd"){
                    special["$debugEnd"] = orders[line].value + "\n";
                }
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
            return;
        }
    }

    output.textContent += special["$start"];

    if (debugB){
        output.textContent += special["$debugStart"];
    }

    if (!stop){
        var count = 1;

        for (let order of orders){
            if (order.name == "print"){
                printOut(order.value, variables, count);
            }
    
            if (order.dataType == "int"){
                if (isNaN(Number(order.value))){
                    //document.writeln("cc")
                    orders[count-1] = variableNameToValue(order, variables);
                    if (orders[count-1] == "error"){
                        raiseErr(`error 4: varible not found on line ${count}`);
                        return;
                    }
                    else if (orders[count-1] == "error 2"){
                        raiseErr(`error 5: different data types on asignment on line ${count}`)
                        return;
                    }
                    else{
                        for(let i = 0; i < variables.length; i++){
                            if (orders[count-1].name == variables[i].name){
                                variables[i] = orders[count-1]
                            }
                        }
                    }
                }
                if (debugB){
                    debugVariables(order, variables, count)
                }
            }
    
            if (order.dataType == "text"){
                if (order.value[0] != '"' && order.value[order.value.length-1] != '"'){
                    orders[count-1] = variableNameToValue(order, variables);
                    if (orders[count-1] == "error"){
                        raiseErr(`error 4: varible not found on line ${count}`);
                        return;
                    }
                    else{
                        for(let i = 0; i < variables.length; i++){
                            if (orders[count-1].name == variables[i].name){
                                variables[i] = orders[count-1]
                            }
                        }
                    }
                }

                if (debugB){
                    debugVariables(order, variables, count)
                }
            }
    
            if (order.dataType == "bool"){
                if (order.value != "true" && order.value != "false" && order.value != "0" && order.value != "1"){
                    orders[count-1] = variableNameToValue(order, variables);
                    if (orders[count-1] == "error"){
                        raiseErr(`error 4: varible not found on line ${count}`);
                        return;
                    }
                    else if (orders[count-1] == "error 2"){
                        raiseErr(`error 5: different data types on asignment on line ${count}`)
                        return;
                    }
                    else{
                        for(let i = 0; i < variables.length; i++){
                            if (orders[count-1].name == variables[i].name){
                                variables[i] = orders[count-1]
                            }
                        }
                    }
                }
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
                    if (!tempVar){
                        raiseErr(`error 3: not valid variable`);
                        return;
                    }
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

    if (debugB){
        output.textContent += special["$debugEnd"];
    }

    output.textContent += special["$end"]
}

function variableNameToValue(variable, vars){
    for (let names of vars){
        if (variable.value == names.name && variable.dataType == names.dataType){
            variable.value = names.value;
            return variable;
        }
        else if (variable.value == names.name && !(variable.dataType == names.dataType)){
            return "error 2"
        }
    }

    return "error";
}

function variableConstructor(objectToVar, variables){
    var sVariable = {};
    var E = false;

    //console.log(objectToVar.value.value1, objectToVar.value.value2, variables)
    
    if (!nameToVar(objectToVar.value.value1, variables)){
        var tempNum1 = Number(objectToVar.value.value1);
        if (Number.isNaN(tempNum1)){
            E = true;
        }
    }
    else if(nameToVar(objectToVar.value.value1, variables)){
        var tempNum1 = Number(nameToVar(objectToVar.value.value1, variables));
    }

    if (!nameToVar(objectToVar.value.value2, variables)){
        var tempNum2 = Number(objectToVar.value.value2);
        if (Number.isNaN(tempNum2)){
            E = true;
        }
    }
    else if(nameToVar(objectToVar.value.value2, variables)){
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

    if (!E){
        return sVariable;
    }
    else{
        return false;
    }
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
            if (v.dataType == "text"){
                print = v.value.slice(1,-1);
            }
            else{
                print = v.value;
            }
            break;
        }
    }

    if (!canWe && print[0] == '"' && print[print.length-1] == '"'){
        print = print.slice(1,-1)
        canWe = true;
    }
    else if(!canWe && (print[0] != '"' || print[print.length-1] != '"')){
        raiseErr(`error 1: forgot to use qutation marks on line ${lineCount}`);
        return;
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
    var special = {}

    special["$start"] = '======= started =======' + "\n";
    special["$end"] = '======= finished =======' + '\n' + "\n";

    special["$debugStart"] = "\n" + "====== debug started ======" + "\n";
    special["$debugEnd"] = "====== debug finished ======" + "\n" + "\n";

    var output = document.getElementById("output");

    output.textContent += `${errorMsg} \n`

    if (debugB){
        output.textContent += special["$debugEnd"];
    }

    output.textContent += special["$end"]

    return;
}