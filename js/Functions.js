function myFunction(result) {
    var text = parseResult(result);
    console.log(tree);
    
    document.getElementById("demo").innerHTML = text;
    }

function parseResult(result) {

    var command;
    var tag;
    var args = [];

    var output;

    var splitRes = result.split(" ");

    command = splitRes[0];

    if (splitRes.length > 1) {
    
        if (splitRes[1].charAt(0).localeCompare('-') == 0) {
            tag = splitRes[1];
        }
        else {
            tag = "none";
            args.push(splitRes[1]);
        }

        for (var i = 2; i < splitRes.length; i++) {
            args.push(splitRes[i]);
        }

    }
    if (command != null) {
        console.log(command);
    }
    if (tag != null) {
        console.log(tag);
    }
    if (args != null) {
        console.log(args);
    }

    /*-----------------------------------*/

    output = executeCommands(command, tag, args);

    return output;

}

function executeCommands(command, tag, args) {
    // Outputs room/story text 
    var textOutput;

    textOutput = associateCommands(command, tag, args);
    // Do stuff

    return textOutput;
}

function associateCommands(command, tag, args) {
    // If cd -> find currentRoom's children, select room=args
    // If ls -> Display all children rooms
    //

    var output = "";
    var children = getChildren(tree, currentRoom);

    var parent = getParent(tree, currentRoom);

    switch(command) {
        case "cd":
            if (args[0].localeCompare("..") == 0) {
                    currentRoom = parent;
            } 
            else {
                if (verifyChild(args[0], children)) {
                    currentRoom = args[0];
                }
                else {
                    output = "Room is not a child of current room";
                } 
            }
            break;
        case "ls":
            var room = findRoom(currentRoom);
            var items = room.items;
            for (var i = 0; i < items.length; i++) {
                output = output + items[i].name + '<br />';
                //output.push(items[i].name);
            }
            var people = room.people;
            for (var j = 0; j < people.length; j++) {
                output = output + people[j].name + '<br />';
                //output.push(people[j].name);
            }
            for (var k = 0; k < children.length; k++) {
                output = output + children[k].name + '<br />';
                //output.push(people[j].name);
            }

            break;
        default:
            return "Could not recognize command";

    }

    return output;
}

function findRoom(roomName) {

    for(var i = 0; i < house.length; i++) {
        if (house[i].name.localeCompare(roomName) == 0) {
            console.log(house[i]);
            return house[i];
        }
    }

    return null;

}

function verifyChild(childRoom, children) {
    for (var i = 0; i < children.length; i++) {
        if (children[i].name.localeCompare(childRoom)) {
            return true;
        }
    }

    return false;
}


// function myFunction() {
//     var text = document.getElementById("input").value;
//     document.getElementById("demo").innerHTML = text;
//     }
    
//     document.addEventListener('keypress', logkey);
    
//     function logkey(e) {
//         if(e.key === 'Enter') {
//             myFunction();
//             document.getElementById('input').value = "";
//         }
//     }
    
    