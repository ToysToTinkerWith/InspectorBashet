var evidenceFolder;
var hasFoundKey = false;
var hasMadeEvidence = false;
var inEvidence = false;
var hasKey = false;
var hasLetterFirst = false;
var hasLetterSecond = false;
var hasTalkedToServant = false;

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
            if (inEvidence) {
              inEvidence = false;
            }
            if (args[0].localeCompare("..") == 0) {
                if(currentRoom.localeCompare("Grand_Foyer") != 0) {
                    currentRoom = parent;
                }
            }
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
            else {
                if (verifyChild(args[0], children)) {
                    currentRoom = args[0];
                }
                else if (hasMadeEvidence) {
                  if (args[0].localeCompare(evidenceFolder.name) != 0) {
                      output = "Room is not a child of current room";
                  }
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
            console.log(inEvidence);
            if (inEvidence) {
              inEvidence = false;
            }
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
            if (evidenceFolder.items) {
              var evidenceItems = evidenceFolder.items;
              if (args[0]) {
                  for (var i = 0; i < items.length; i++) {
                      if(args[0].localeCompare(items[i].name) == 0) {
                          output = output + items[i].descript + '<br />';
                      }
                }
              }
            }
            if (room.items) {
                var items = room.items;
                if(args[0]) {
                    for (var i = 0; i < items.length; i++) {
                        if(args[0].localeCompare(items[i].name) == 0) {
                            output = output + items[i].descript + '<br />' + '<br />';
                            if (items[i].act.localeCompare(" none ") == 0) {
                                output = output + "Doesn't feel very special" + '<br />';
                            }
                            else {
                                output = output + items[i].act + '<br />';

                                if (items[i].name.localeCompare("Spring_Terror") == 0) {
                                    var key = new Item("Key", "Seems like it unlocks something..", "This might be useful");
                                    room.items.push(key);
                                    hasFoundKey = true;
                                }
                                if (items[i].name.localeCompare("Wall_Mounted_Paper_Target") == 0) {
                                  var letterFirst = new Item("Letter_FirstPiece", "My Love," + '<br />'
                                  + "We shall be together soon" + '<br />'
                                  + "I'm risking everything to send you this letter but I needed" + '<br />'
                                  + "to share my feelings. I love you, ..." + '<br />', "Looks like the letter was torn.");
                                  room.items.push(letterFirst);
                                  hasLetterFirst = true;
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
                var person;
                if(args[0]) {
                    for (var i = 0; i < people.length; i++) {
                        if(args[0].localeCompare(people[i].name) == 0) {
                            output = output + people[i].descript + '<br />' + '<br />'
                            + people[i].dia + '<br />' + '<br />';
                            person = people[i];
                        }
                    }
                    if (args[0].localeCompare("Servant#3") == 0) {
                      // Found both pieces
                      if ((hasLetterFirst) && (hasLetterSecond)) {
                        output = output + "Oh alright. I can't hide it anymore." + '<br />'
                        + "Penelope and I have been deeply in love for the last few years." + '<br />'
                        + "I promise I don't know anything else." + '<br />'
                        + "Whatever you do, I beg you please don't tell the master. " + '<br />'
                        + "If you're trying to explore the entire house, maybe I can help you for your silence." + '<br />' + '<br />';
                        output = output + "Servant#3 has opened the Billard Room for you!" + '<br />';

                        // Unlock billard room
                        hasTalkedToServant = true;
                      }
                      // Found 2nd piece only
                      else if ((hasLetterSecond) && (!hasLetterFirst)) {
                        output = output + "Sorry, I'd rather not talk about that..." + '<br />';
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
                      output = output + "Inside the box is a scrap of paper" + '<br />';
                      var letterSecond = new Item("Letter_SecondPiece", "..S#3," + '<br />' + " I always have." + '<br />' + "~Penelope", "Looks like the letter was torn.");
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
