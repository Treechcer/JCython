var lineByLine;

function runScript(){
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    var debug = document.getElementById("debug").checked;

    var special = {}

    special["$start"] = "======= started =======" + "\n";
    special["$end"] = "======= finshed =======" + "\n" + "\n";

    special["$debugStart"] = "\n" + "====== debug started ======" + "\n";
    special["$debugEnd"] = "====== debug finished ======" + "\n" + "\n";

    var lineByLine = input.value.split("\n");

    const defaultFunctionRegEx = [
        /print\((.+)\);/i,
    ];

    const defaultVariableRegEx = [
        /(int) (\w+) = (\d+);/,
        /(text) (\w+) = "(\w+)";/,
        /(bool) (\w+) = (true|false|1|0);/,
        /(special) (\$\w+) = "(\w+)";/
    ];

    var calls = [];
    var variables = [];

    for (let j = 0; j < defaultFunctionRegEx.length; j++){
        calls[j] = searchRegEx(defaultFunctionRegEx[j], lineByLine);
    }

    var isError = false;
    var index;

    for (let i = 0; i < defaultVariableRegEx.length; i++){
        variables[i] = searchRegExVariables(defaultVariableRegEx[i], lineByLine);
        try {
            if (variables[i].duplicate){
                isError = true;
                index = variables[i].line;  
            }
        }
        catch(myBad){

        }
    }

    if (!isError){
        var special = changeStartEndVars(variables);
    }
    output.textContent += special["$start"];

    var stop = errChech(lineByLine, -1, NaN);

    if (isError){
        stop = true;
        errChech(lineByLine, 5, `Line ${index} error 3 reasigning value incorectly\n`);
    }

    if (!stop){
        printingOut(calls[0], variables);

        if (debug){
            output.textContent += special["$debugStart"];
            debugVar(variables);
            debuger(calls);
            output.textContent += special["$debugEnd"];
        }
    }

    scrollToBottom();

    output.textContent += special["$end"];
}

function changeStartEndVars(variables){
    var retrunVar = {}
    retrunVar["$start"] = "======= started =======" + "\n";
    retrunVar["$end"] = "======= finshed =======" + "\n" + "\n";
    retrunVar["$debugStart"] = "\n" + "====== debug started ======" + "\n";
    retrunVar["$debugEnd"] = "====== debug finished ======" + "\n" + "\n";
    for (let varArr of variables){
        for (let singleVar of varArr){
            if (singleVar.dataType == "special"){
                if (singleVar.name == "$start"){
                    retrunVar["$start"] = singleVar.value + "\n";
                }
                if (singleVar.name == "$end"){
                    retrunVar["$end"] = singleVar.value + "\n";
                }
                if (singleVar.name == "$debugStart"){
                    retrunVar["$debugStart"] = singleVar.value + "\n";
                }
                if (singleVar.name == "$debugEnd"){
                    retrunVar["$debugEnd"] = singleVar.value + "\n";
                }
            }
        }
    }

    return retrunVar;
}

function searchRegEx(regEx, lineByLine){
    var returnThing = [];
    for (let i = 0; i < lineByLine.length; i++) {
        if (lineByLine[i][0] == "#" || lineByLine[i][0] == "/"){
            continue;
        }
        let match = lineByLine[i].match(regEx);
        if (match) {
            returnThing.push({line : match[0], pos : i, inside : match[1]});
        }
    }

    return returnThing;
}

function searchRegExVariables(regEx, lineByLine){
    var returnThing = [];
    for (let i = 0; i < lineByLine.length; i++) {
        if (lineByLine[i][0] == "#" || lineByLine[i][0] == "/"){
            continue;
        }
        let match = lineByLine[i].match(regEx);
        if (match) {

            let tempObj = {name : match[2], pos : i, value : match[3], dataType : match[1]};
            for (let j = 0; j < returnThing.length; j++) {
                if (tempObj["name"] == returnThing[j]["name"]) {
                    return {duplicate : true, line : i};
                }
            }
            returnThing.push({name : match[2], pos : i, value : match[3], dataType : match[1]});
        }
    }

    return returnThing;
}

function printingOut(printCall, variables){
    for (p of printCall){
        var out = fVarCheck(p, variables);
        if (out != "err"){
            output.textContent += out + "\n";
        }
        else{
            errChech(lineByLine, p.line+1, `Line ${p.pos + 1} error 2 (this variable doesn't exist, maybe you forgot to use ")` + "\n")
        }
    }
}

function fVarCheck(isThisVar, vars){
    var strCheck = /"(\w+)"/
    var numCheck = /(\d+)/
    isThisVar = isThisVar.inside
    var match = isThisVar.match(strCheck);
    if (match){
        return match[1];
    }
    var match = isThisVar.match(numCheck);
    if (match){
        return match[1];
    }
    for (let varArr of vars){
        for(let varS of varArr){
            if (isThisVar == varS.name){
                return varS.value;
            }
        }
    }

    return "err";
}

function debuger(calls){
    
}

function debugVar(variables){
    for (let varArr of variables) {
        for (let vars of varArr) {
            output.textContent += `Line ${vars.pos + 1}: ${vars.name}, value: ${vars.value}, dataType: ${vars.dataType}\n`;
        }
    }
}

function scrollToBottom() {
    let textarea = document.getElementById("output");
    textarea.scrollTop = textarea.scrollHeight;
}

function errChech(lineByLine, lineIfFound, errMsg){
    var err = false;
    let out = document.getElementById("output");
    if (lineIfFound != -1){
        out.textContent += errMsg;
    }
    if (lineIfFound == -1){
        for (let i = 0; i < lineByLine.length; i++){
            if (lineByLine[i][lineByLine[i].length-1] != ";" && lineByLine[i].match(/^\S+/)){
                out.textContent += `Line ${i + 1} error 1 (no semicolon)` + "\n"
                err = true;
            }
        }
    }

    return err;
}