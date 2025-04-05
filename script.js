var lineByLine;

function runScript(){
    var input = document.getElementById("input");
    var output = document.getElementById("output");
    var debug = document.getElementById("debug").checked;

    var lineByLine = input.value.split("\n");

    const defaultFunctionRegEx = [
        /print\((.+)\);/i,
    ];

    const defaultVariableRegEx = [
        /int (\w+) = (\d+);/,
        /text (\w+) = "(\w+)";/,
        /bool (\w+) = (true|false);/,
    ];

    var calls = [];
    var variables = [];

    for (let j = 0; j < defaultFunctionRegEx.length; j++){
        calls[j] = searchRegEx(defaultFunctionRegEx[j], lineByLine);
    }

    for (let i = 0; i < defaultVariableRegEx.length; i++){
        variables[i] = searchRegExVariables(defaultVariableRegEx[i], lineByLine);
    }

    errChech(lineByLine);

    printingOut(calls[0]);

    if (debug){
        debugVar(variables);
        debug(calls);
    }

    scrollToBottom();
}

function searchRegEx(regEx, lineByLine){
    var returnThing = [];
    lineByLine.trimStart();
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
    lineByLine.trimStart();
    for (let i = 0; i < lineByLine.length; i++) {
        if (lineByLine[i][0] == "#" || lineByLine[i][0] == "/"){
            continue;
        }
        let match = lineByLine[i].match(regEx);
        if (match) {
            returnThing.push({name : match[1], pos : i, value : match[2]});
        }
    }

    return returnThing;
}

function printingOut(printCall){
    for (p of printCall){
        output.textContent += p.inside + "\n";
    }
}

function debug(calls){
    for (let callArr of calls) {
        for (let call of callArr) {
            output.textContent += `Line ${call.pos + 1}: ${call.line}\n`;
        }
    }
}

function debugVar(variables){
    for (let varArr of variables) {
        for (let vars of varArr) {
            output.textContent += `Line ${vars.pos + 1}: ${vars.name}, value: ${vars.value}\n`;
        }
    }
}

function scrollToBottom() {
    let textarea = document.getElementById("output");
    textarea.scrollTop = textarea.scrollHeight;
}

function errChech(lineByLine){
    let out = document.getElementById("output");
    for (let i = 0; i < lineByLine.length; i++){
        if (lineByLine[i][lineByLine[i].length-1] != ";" && lineByLine[i].match(/^\S+/)){
            out.textContent += `Line ${i + 1} error 1 (no semicolon)` + "\n"
        }
    }
}