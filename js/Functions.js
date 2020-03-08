var evidenceFolder;
var hasFoundKey = false;
var hasMadeEvidence = false;
var inEvidence = false;
var hasKey = false;
var hasLetterFirst = false;
var hasLetterSecond = false;
var hasTalkedToServant = false;
var hasCombination = false;
var hasTouchedPoolStick = false;
var hasCrackedVault = false;

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
    var output = "";
    var children = getChildren(tree, currentRoom);
    var parent = getParent(tree, currentRoom);
    var room = findRoom(currentRoom);

    // Game Command Logic
    switch(command) {
        case "cd":
            // No longer viewing evidence
            if (inEvidence) {
              inEvidence = false;
            }
            // If cd .. -> set current room to the parent
            if (args[0].localeCompare("..") == 0) {
                if(currentRoom.localeCompare("Grand_Foyer") != 0) {
                    currentRoom = parent;
                }
            }
            // If Billard Room, track story completion
            else if (args[0].localeCompare("Billard_Room") == 0) {
              if (!hasTalkedToServant) {
                output = output + "The Billard_Room is locked for some reason." + '<br />';
              }
              else {
                if (verifyChild(args[0], children)) {
                    currentRoom = args[0];
                }
              }
            }
            // If cd attempt to any other room, verify valid room
            else {
                if (verifyChild(args[0], children)) {
                    currentRoom = args[0];
                }
                // cd evidenceFolder should always be accessible, but shouldn't return an error
                else if (hasMadeEvidence) {
                  if (args[0].localeCompare(evidenceFolder.name) != 0) {
                    output = '<span style="color:red">' + "Room is not a child of current room" + '</span>';
                  }
                }
                else {
                  output = '<span style="color:red">' + "Room is not a child of current room" + '</span>';
                }

            }
            ////////////////////////////////////////////////////////////////////////////////////////
            // Can always access evidenceFolder
            if (hasMadeEvidence) {
              if (args[0].localeCompare(evidenceFolder.name) == 0) {
                  inEvidence = true;
                  for (var i = 0; i < evidenceFolder.items.length; i++) {
                      output = output + '<span style="color:yellow">' + evidenceFolder.items[i].name + '</span>' + '<br />';
                  }
              }
            }
            break;
        case "ls":
            if (inEvidence) {
              inEvidence = false;
            }
            var items = room.items;
            for (var i = 0; i < items.length; i++) {
                output = output + '<span style="color:yellow">' + items[i].name + '</span>' + '<br />';
            }
            var people = room.people;
            for (var j = 0; j < people.length; j++) {
                output = output + '<span style="color:pink">' + people[j].name + '</span>' + '<br />';
            }
            for (var k = 0; k < children.length; k++) {
                output = output + children[k].name + '<br />';
            }
            if (hasMadeEvidence) {
                output = output + '<br />' + '<span style="color:tan">' + evidenceFolder.name + '</span>' + '<br />';
            }

            break;
        case "touch":
            // Check to see if player is trying to touch evidence evidenceFolder
            if (hasMadeEvidence) {
              if (args[0]) {
                if (args[0].localeCompare(evidenceFolder.name) == 0) {
                  output = output + '<span style="color:red">' + "Cannot touch your evidence folder" + '</span>' + '<br />';
                }
              }
            }
            // Check to see if player is in evidence
            if (inEvidence) {
              var evidenceItems = evidenceFolder.items;
              if (args[0]) {
                  for (var i = 0; i < evidenceItems.length; i++) {
                      if(args[0].localeCompare(evidenceItems[i].name) == 0) {
                          output = output + '<span style="color:tan">' + evidenceItems[i].descript + '</span>' + '<br />';
                      }
                }
              }
            }
            // Check to see if player wants to touch a room
            var items = room.items;
            var notARoom = true;
            for (var i = 0; i < nameList.length; i++) {
              if (args[0].localeCompare(nameList[i]) == 0) {
                notARoom = false;
              }
            }

            // If player wants to touch something, execute..
            if (args[0]) {
              if (notARoom) {
                for (var i = 0; i < items.length; i++) {
                    if(args[0].localeCompare(items[i].name) == 0) {
                        output = output + items[i].descript + '<br />' + '<br />';
                        if (items[i].act.localeCompare(" none ") == 0) {
                            output = output + '<span style="color:limegreen">' + "Doesn't feel very special" + '</span>' + '<br />';
                        }
                        else {

                            if ((items[i].name.localeCompare("Spring_Terror") == 0) && !hasFoundKey) {
                                output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                                var key = new Item("Key", "Seems like it unlocks something..", "Might be useful");
                                room.items.push(key);
                                hasFoundKey = true;
                            }
                            else if (items[i].name.localeCompare("Box") == 0) {
                              output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                            }
                            else if ((items[i].name.localeCompare("Wall_Mounted_Paper_Target") == 0) && !hasLetterFirst) {
                              output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                              var letterFirst = new Item("Letter_FirstPiece", "My Love," + '<br />'
                              + "We shall be together soon despite our current hardships." + '<br />'
                              + "This is only a letter but I needed to send you my feelings." + '<br />'
                              + "I love you, ..." + '<br />', "Looks like the letter was torn.");
                              room.items.push(letterFirst);
                              hasLetterFirst = true;
                            }
                            else if ((items[i].name.localeCompare("Bed") == 0) && !hasCombination) {
                              output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                              var note = new Item("Note", "33-05-76", "Might be useful");
                              room.items.push(note);
                              hasCombination = true;
                            }
                            else if ((items[i].name.localeCompare("Stick#3") == 0) && !hasTouchedPoolStick) {
                              output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                              var vault = new Item("Vault", "A high security safe.", "This can only be opened with a combination");
                              room.items.push(vault);
                              hasCrackedVault = true;
                            }
                        }
                        break;
                    }
                }
              }
              else {
                output = output + '<span style="color:red">' + "Cannot touch a room" + '</span>' + '<br />';
              }
              var people = room.people;
                  for (var i = 0; i < people.length; i++) {
                      if(args[0].localeCompare(people[i].name) == 0) {
                          output = output + '<span style="color:limegreen">' + "Hey! Don't touch me!" + '</span>' + '<br />';
                      }
                  }
            }
            break;

        case "echo":
            var people = room.people;
            var person;
            if(args[0]) {
                for (var i = 0; i < people.length; i++) {
                  if ((currentRoom.localeCompare("Servant#3_Room") == 0) && hasLetterFirst && hasLetterSecond) {
                    // Print nothing
                  }
                  else if(args[0].localeCompare(people[i].name) == 0) {
                      output = output + people[i].descript + '<br />' + '<br />'
                      + '<span style="color:limegreen">' + people[i].dia + '</span>' + '<br />' + '<br />';
                      person = people[i];
                  }
                }
                if (args[0].localeCompare("Servant#3") == 0) {
                  // Found both pieces
                  if ((hasLetterFirst) && (hasLetterSecond)) {
                    output = output + '<span style="color:limegreen">' + "Oh alright. I can't hide it anymore." + '<br />'
                    + "Penelope and I have been deeply in love for the last few years." + '<br />'
                    + "I promise I don't know anything else." + '<br />'
                    + "Whatever you do, I beg you please don't tell the master. " + '<br />'
                    + "If you're trying to explore the entire house, maybe I can help you for your silence." + '<br />' + '<br />';
                    output = output + "Servant#3 has opened the Billard Room for you!" + '</span>' + '<br />';

                    // Unlock billard room
                    hasTalkedToServant = true;
                  }
                  // Found 2nd piece only
                  else if ((hasLetterSecond) && (!hasLetterFirst)) {
                    output = output + '<span style="color:red">' + "Sorry, I'd rather not talk about that..." + '</span>' + '<br />';
                  }

                }
            }
            break;

        case "mkdir":
            if (!hasMadeEvidence) {
              if (args[0]) {
                evidenceFolder = new Room(args[0], [], []);
                hasMadeEvidence = true;
              }
              else {
                output = output + '<span style="color:red">' + "Name cannot be null" + '</span>' + '<br />';
              }
            }
            break;

        case "mv":
            var item = args[0];

            // Remove from current room
                var items = room.items;
                for (var i = 0; i < items.length; i++) {
                  if (item.localeCompare("Vault") == 0) {
                    if(item.localeCompare(items[i].name) == 0) {
                        // Add to folder
                        evidenceFolder.items.push(items[i]);
                        room.items.splice(i,1);
                    }
                  }
                  else {
                    output = output + '<span style="color:red">' + "Cannot move the vault" + '</span>' + '<br />';
                  }
                }
            break;

        case "Key":
            if (currentRoom.localeCompare("Dressing_Room") == 0) {
              if (hasMadeEvidence) {
                  var items = evidenceFolder.items;
                  for (var i = 0; i < items.length; i++) {
                    if (items[i].name.localeCompare("Key") == 0) {
                      hasKey = true;
                    }
                  }
                  if (hasKey) {
                    if ((args[0]) && (args[1])) {
                      if ((args[0].localeCompare("|") == 0) && (args[1].localeCompare("Box") == 0)) {
                        output = output + "Inside the box is a scrap of paper" + '<br />';
                        var letterSecond = new Item("Letter_SecondPiece", "..S#3," + '<br />' + " I always have." + '<br />' + "~Penelope", "Looks like the letter was torn.");
                        room.items.push(letterSecond);
                        hasLetterSecond = true;
                      }
                    }
                    else {
                      output = output + '<span style="color:red">' + "Could not recognize command" + '</span>' + '<br />';
                    }
                  }
                  else {
                    output = output + '<span style="color:red">' + "Could not recognize command" + '</span>' + '<br />';
                  }
              } else {
                output = output + '<span style="color:red">' + "Could not recognize command" + '</span>' + '<br />';
              }
            }
            break;

        case "Note":
            if (currentRoom.localeCompare("Billard_Room") == 0) {
              if (hasMadeEvidence) {
                  var items = evidenceFolder.items;
                  for (var i = 0; i < items.length; i++) {
                    if (items[i].name.localeCompare("Key") == 0) {
                      hasKey = true;
                    }
                  }
                  if (hasKey) {
                    if ((args[0]) && (args[1])) {
                      if ((args[0].localeCompare("|") == 0) && (args[1].localeCompare("Box") == 0)) {
                        output = output + "Inside the box is a scrap of paper" + '<br />';
                        var letterSecond = new Item("Letter_SecondPiece", "..S#3," + '<br />' + " I always have." + '<br />' + "~Penelope", "Looks like the letter was torn.");
                        room.items.push(letterSecond);
                        hasLetterSecond = true;
                      }
                    }
                    else {
                      output = output + '<span style="color:red">' + "Could not recognize command" + '</span>' + '<br />';
                    }
                  }
                  else {
                    output = output + '<span style="color:red">' + "Could not recognize command" + '</span>' + '<br />';
                  }
              } else {
                output = output + '<span style="color:red">' + "Could not recognize command" + '</span>' + '<br />';
              }
            }

        default:
            return '<span style="color:red">' + "Could not recognize command" + '</span>';

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
