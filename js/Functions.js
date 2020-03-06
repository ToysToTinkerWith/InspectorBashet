var evidenceFolder;
var hasFoundKey = false;
var hasMadeEvidence = false;
var inEvidence = false;
var hasKey = false;
var hasLetterFirst = false;
var hasLetterSecond = false;

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
    // if (command != null) {
    //     console.log(command);
    // }
    // if (tag != null) {
    //     console.log(tag);
    // }
    // if (args != null) {
    //     console.log(args);
    // }

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

    var room = findRoom(currentRoom);

    switch(command) {
        case "cd":
            if (args[0].localeCompare("..") == 0) {
                if(currentRoom.localeCompare("Grand_Foyer") != 0) {
                    currentRoom = parent;
                }
                else if (inEvidence) {
                    inEvidence = false;
                }
            }
            else {
                if (verifyChild(args[0], children)) {
                    currentRoom = args[0];
                }
                else if (args[0].localeCompare(evidenceFolder.name) != 0) {
                    output = "Room is not a child of current room";
                }
            }
            if (hasMadeEvidence) {
              if (args[0].localeCompare(evidenceFolder.name) == 0) {
                  inEvidence = true;
                  for (var i = 0; i < evidenceFolder.items.length; i++) {
                      output = output + evidenceFolder.items[i].name + '<br />';                    }
              }
            }
            break;
        case "ls":
            if (room.items) {
              var items = room.items;
              for (var i = 0; i < items.length; i++) {
                  output = output + items[i].name + '<br />';
              }
            }
            if (room.people) {
              var people = room.people;
              for (var j = 0; j < people.length; j++) {
                  output = output + people[j].name + '<br />';
              }
            }
            for (var k = 0; k < children.length; k++) {
                output = output + children[k].name + '<br />';
            }
            if (hasMadeEvidence) {
                output = output + '<br />' + evidenceFolder.name + '<br />';
            }

            break;
        case "touch":
            if (room.items) {
                var items = room.items;
                if(args[0]) {
                    for (var i = 0; i < items.length; i++) {
                        if(args[0].localeCompare(items[i].name) == 0) {
                            output = output + items[i].descript + '<br />' + '<br />';
                            if (items[i].act.localeCompare(" none ") == 0) {
                                output = output + "Nothing special about this thing" + '<br />';
                            }
                            else {
                                output = output + items[i].act + '<br />';

                                if (items[i].name.localeCompare("Spring_Terror") == 0) {
                                    var key = new Item("Key", "Seems like it unlocks something..", "This might be useful");
                                    room.items.push(key);
                                    hasFoundKey = true;
                                }
                            }
                            break;
                        }
                    }
                    if (room.people) {
                        var people = room.people;
                            for (var i = 0; i < people.length; i++) {
                                if(args[0].localeCompare(people[i].name) == 0) {
                                    output = output + "Hey! Don't touch me! <br />";
                                }
                            }
                    }
                }
            }
            break;

        case "echo":
            if (room.people) {
                var people = room.people;
                if(args[0]) {
                    for (var i = 0; i < people.length; i++) {
                        if(args[0].localeCompare(people[i].name) == 0) {
                            output = output + people[i].descript + '<br />' + people[i].dia + '<br />';
                        }
                    }
                }
            }
            break;

        case "mkdir":
            if (!hasMadeEvidence) {
                // var tempItemList;
                evidenceFolder = new Room(args[0], [], []);
                hasMadeEvidence = true;
            }
            break;

        case "mv":
            var item = args[0];

            // Remove from current room
            if (room.items) {
                var items = room.items;
                for (var i = 0; i < items.length; i++) {
                    if(item.localeCompare(items[i].name) == 0) {
                        // Add to folder
                        evidenceFolder.items.push(items[i]);
                        room.items.splice(i,1);
                    }
                }
            }
            break;

        case "Key":
          if (currentRoom.localeCompare("Dressing_Room") == 0) {
            if (hasMadeEvidence) {
              if (evidenceFolder.items) {
                var items = evidenceFolder.items;
                for (var i = 0; i < items.length; i++) {
                  if (items[i].name.localeCompare("Key") == 0) {
                    hasKey = true;
                  }
                }
                if (hasKey) {
                  if ((args[0]) && (args[1])) {
                    if ((args[0].localeCompare("|") == 0) && (args[1].localeCompare("Box") == 0)) {
                      output = output + "You found the letter" + '<br />';
                      var letterSecond = new Item("Letter_SecondPiece", "..S#3," + '<br />' + " I always have." + '<br />' + "~Penelope", "Looks like the letter was torn in half");
                      room.items.push(letterSecond);
                      hasLetterSecond = true;
                    }
                  }
                } else {
                  output = output + "You don't have the key for this" + '<br />';
                }
              }
            } else {
              output = output + "You don't have the key for this" + '<br />';
            }
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
            return house[i];
        }
    }

    return null;

}

function verifyChild(childRoom, children) {
    for (var i = 0; i < children.length; i++) {
        if (children[i].name.localeCompare(childRoom) == 0) {
            return true;
        }
    }

    return false;
}

function stringMatch(part, full) {
    var charPart = part.split("");
    var charFull = full.split("");

    if (charPart.length == 0) {
        return "";
    }

    for (var i = 0; i < charPart.length; i++){
        if(charPart[i] != charFull[i]) {
            return "";
        }
    }

    return full.substr(i);
}
