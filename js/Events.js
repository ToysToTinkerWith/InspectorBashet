function stringMatch(part, full) {
    var charPart = part.split("");
    var charFull = full.split("");

    for (var i = 0; i < charPart.length; i++){
        if(charPart[i] != charFull[i]) {
            return "";
        }
    }
    return full.substr(i);
}