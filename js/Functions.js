var textOutput;
var storyOutput;

var hasStarted = false;
var givenInfo = false;
var doneIntro = false;
var givenHelp = false;

var firstTimeFourthFloor = false;
var noPiano = true;

var evidenceFolder;
var hasMadeEvidence = false;
var inEvidence = false;
var hasFoundKey = false;
var hasKey = false;
var foundLetterFirst = false;
var foundLetterSecond = false;
var hasLetterFirst = false;
var hasLetterSecond = false;
var hasTalkedToServant = false;
var foundCombination = false;
var hasCombination = false;
var hasTouchedPoolStick = false;
var hasFoundVault = false;
var hasCrackedVault = false;

var openedTrapdoor = false;
var justFinished = false;
var beginCutScene = false;
var justice = false;
var resolution = false;

var testUser;

function myFunction(result) {
    var text = parseResult(result);
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

    output = executeCommands(command, tag, args);

    return output;

}

function executeCommands(command, tag, args) {
    // Outputs room/story text
    textOutput = '';
    storyOutput = '';
    if (givenHelp && !beginCutScene) {
      textOutput = associateCommands(command, tag, args, storyOutput);
    }

    if ((command.localeCompare("rm") == 0) && (args[0].localeCompare("knife") == 0)) {
      disableCommands = true;
      clearTimeout(testUser);
      execFinale(textOutput);
    }

    // Do checkpoints
    if (!hasStarted) {
      storyOutput = "Thanks for coming with such short notice, BASHet. I’m delighted that you can help me today." + '<br />';
      hasStarted = true;
    }
    else if (!givenInfo) {
      storyOutput = "My wife has been missing since last night, and no one seems to know anything…" + '<br />' + '<br />' + "This is a very secluded area, so it’s unlikely she left the house. Feel free to look anywhere you can." + '<br />';
      givenInfo = true;
    }
    else if (!doneIntro) {
      storyOutput = "The servants’ quarters are in the Attic should you want to talk to them, but the Maid & Butler are usually busy around the house.." + '<br />';
      doneIntro = true;
    }
    else if (!givenHelp) {
      storyOutput = "Type 'help' for the list of usable commands" + '<br />';
      givenHelp = true;
    }
    else if (!noPiano) {
      storyOutput = "You hear a beautiful melody echoing in the hallways.." + '<br />';
      noPiano = true;
    }
    else if (hasLetterFirst && hasLetterSecond && hasCombination && !openedTrapdoor) {
      storyOutput = "*NOTE* - If stuck, 'ls -a' may reveal more detail about a room" + '<br />';
    }
    else if (openedTrapdoor && !beginCutScene) {
      disableCommands = true;
      textOutput = "After unlocking the trapdoor, you see a woman in her 30s unconscious on the floor down below." + '<br />' + '<br />';
      textOutput = textOutput + "As you process what you're looking at, the owner abruptly appears behind you.";
      beginCutScene = true;
      startCutScene();
    }
    console.log(storyOutput);
    document.getElementById("storyteller").innerHTML = storyOutput;


    return textOutput;
}

function associateCommands(command, tag, args, storyOutput) {
    var output = "";
    var children = getChildren(tree, currentRoom);
    var parent = getParent(tree, currentRoom);
    var room = findRoom(currentRoom);

    // Global trackers
    if (hasMadeEvidence) {
      var items = evidenceFolder.items;
      for (var i = 0; i < items.length; i++) {
        if (items[i].name.localeCompare("Letter_FirstPiece") == 0) {
          hasLetterFirst = true;
        }
        if (items[i].name.localeCompare("Letter_SecondPiece") == 0) {
          hasLetterSecond = true;
        }
        if (items[i].name.localeCompare("Note") == 0) {
          hasCombination = true;
        }
      }
    }

    // Game Command Logic
    switch(command) {
        case "help":
            output = output + "ls - display room's contents (rooms, people, items)" + '<br />';
            output = output + "cd 'room_name' to enter a room, cd '..' to backtrack" + '<br />';
            output = output + "touch 'item_name' inspect an item's properties" + '<br />';
            output = output + "echo 'person_name' to talk to that person" + '<br />';
            output = output + "mkdir 'folder_name' to create your evidence folder" + '<br />';
            output = output + "mv 'item_name' 'evidence_folder' to store findings" + '<br />';
            output = output + "'itemA' | 'itemB' to use an item on another item" + '<br />';
            output = output + "-------------------------------------------------------" + '<br />';
            output = output + "TAB - command line autocomplete (use generously)" + '<br />';
            break;
        case "cd":
            document.getElementById("charsprite").src="images/Black.png";
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
            else if (args[0].localeCompare("Trapdoor") == 0) {
              openedTrapdoor = true;
            }
            else if ((args[0].localeCompare("4th_Floor") == 0) && !firstTimeFourthFloor) {
              firstTimeFourthFloor = true;
              noPiano = false;
              currentRoom = args[0];
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
            document.getElementById("charsprite").src="images/Black.png";
            if (inEvidence) {
              inEvidence = false;
            }
            if (tag) {
              if (tag.localeCompare("-a") == 0) {
                if (currentRoom.localeCompare("Wine_Cellar") == 0) {
                  var trapDoor = new Item("Trapdoor", "Invisible at first glance from the dust all over it", "");
                  room.items.push(trapDoor);
                }
              }
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
                  output = output + '<span style="color:red">' + "It's just a folder." + '</span>' + '<br />';
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
                            else if ((items[i].name.localeCompare("Wall_Mounted_Paper_Target") == 0) && !foundLetterFirst) {
                              output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                              var letterFirst = new Item("Letter_FirstPiece", "My Love," + '<br />'
                              + "We shall be together soon despite our current hardships." + '<br />'
                              + "This is only a letter but I needed to send you my feelings." + '<br />'
                              + "I love you, ..." + '<br />', "Looks like the letter was torn.");
                              room.items.push(letterFirst);
                              foundLetterFirst = true;
                            }
                            else if ((items[i].name.localeCompare("Bed") == 0) && !foundCombination) {
                              output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                              var note = new Item("Note", "33-05-76", "Might be useful");
                              room.items.push(note);
                              foundCombination = true;
                            }
                            else if ((items[i].name.localeCompare("Stick#3") == 0) && !hasTouchedPoolStick) {
                              output = output + '<span style="color:limegreen">' + items[i].act + '</span>' + '<br />';
                              var vault = new Item("Vault", "A high security safe.", "This can only be opened with a combination");
                              room.items.push(vault);
                              hasFoundVault = true;
                            }
                            else if ((items[i].name.localeCompare("Trapdoor") == 0)) {
                              output = output + "It's gonna take more than just a touch to get this open." + '<br />';
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
                          var person = people[i];
                          personName = people[i].name;
                          switch(personName) {
                            case "Maid":
                              document.getElementById("charsprite").src="images/maid.png";
                              break;
                            case "Head_Chef_Jerald":
                              document.getElementById("charsprite").src="images/chef_jerald.png";
                              break;
                            case "Butler":
                              document.getElementById("charsprite").src="images/butler.png";
                              break;
                            case "Servant#2":
                              document.getElementById("charsprite").src="images/servant2.png";
                              break;
                            case "Servant#3":
                              document.getElementById("charsprite").src="images/servant3.png";
                              break;
                          }
                      }
                  }
            }
            break;

        case "echo":
        var people = room.people;
        var person;
        var personName;

        if(args[0]) {
            for (var i = 0; i < people.length; i++) {
              if ((currentRoom.localeCompare("Servant#3_Room") == 0) && hasLetterFirst && hasLetterSecond) {
                // Print nothing
              }
              else if(args[0].localeCompare(people[i].name) == 0) {
                // TRY TO GET DIALOG ON BOTTOM PANEL
                  output = output + people[i].descript + '<br />';
                  storyOutput = people[i].dia + '<br />' + '<br />';
                  console.log(document.getElementById("storyteller").innerHTML);
                  //
                  person = people[i];
                  personName = people[i].name;
                  switch(personName) {
                    case "Maid":
                      document.getElementById("charsprite").src="images/maid.png";
                      break;
                    case "Head_Chef_Jerald":
                      document.getElementById("charsprite").src="images/chef_jerald.png";
                      break;
                    case "Butler":
                      document.getElementById("charsprite").src="images/butler.png";
                      break;
                    case "Servant#2":
                      document.getElementById("charsprite").src="images/servant2.png";
                      break;
                    case "Servant#3":
                      document.getElementById("charsprite").src="images/servant3.png";
                      break;
                  }
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
              else if ((foundLetterSecond) && (!foundLetterFirst)) {
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
            if (item.localeCompare("Vault") != 0) {
                if (args[1] && (args[1].localeCompare(evidenceFolder.name) == 0)) {
                    var items = room.items;
                    for (var i = 0; i < items.length; i++) {
                        if(item.localeCompare(items[i].name) == 0) {
                            // Add to folder
                            evidenceFolder.items.push(items[i]);
                            room.items.splice(i,1);
                        }
                    }
                }
                else {
                  output = output + "Where are you putting this?" + '<br />';
                }
            }
            else {
              output = output + '<span style="color:red">' + "Cannot move the vault" + '</span>' + '<br />';
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
                        foundLetterSecond = true;
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

        case "33-05-76":
            if (currentRoom.localeCompare("Billard_Room") == 0) {
              if (foundCombination) {
                  if (hasCombination) {
                    if ((args[0]) && (args[1])) {
                      if ((args[0].localeCompare("|") == 0) && (args[1].localeCompare("Vault") == 0)) {
                        output = output + "The vault cracks open loudly, revealing another key." + '<br />';
                        var cellarKey = new Item("WC_Key", "An old rusty key. Does it even open anything?", "Who knows what this is for.");
                        room.items.push(cellarKey);
                        hasCrackedVault = true;
                      }
                    }
                    else {
                      output = output + "These are numbers." + '<br />';
                    }
                  }
                  else {
                    output = output + '<span style="color:red">' + "You don't have the combination to open this." + '</span>' + '<br />';
                  }
              } else {
                output = output + '<span style="color:red">' + "Could not recognize command" + '</span>' + '<br />';
              }
            }
            break;

        case "Note":
          output = output + "This is a note." + '<br />';
          break;

        default:
            return '<span style="color:red">' + "Could not recognize command" + '</span>';

    }
    return output;
}

function startCutScene() {
  setTimeout(function(){
    document.getElementById("storyteller").innerHTML = '<span style="color:red">' + "Ha! So you figured it out! Unlucky for you now, I will have my revenge on all of you!" + '</span>';
  }, 4000);
  continueCutScene();
}

function continueCutScene() {
  setTimeout(function(){
      disableCommands = false;
  }, 8000);
  setTimeout(function(){
      document.getElementById("demo").innerHTML = '<span style="color:red">' + "The owner lunges at you!" + '</span>';
      document.getElementById("storyteller").innerHTML = "Quick! Use 'rm knife' to disable his weapon!";
  }, 8000);
  testUserSpeed();
}

function testUserSpeed() {
  testUser = setTimeout(function(){
    disableCommands = true;
    document.getElementById("demo").innerHTML = "Right before the knife would have pierced you in the chest, Servant#3 shows up in the nick of time and manages to throw a chair at the owner, allowing you to fend the attacker off and restrain him.";
    document.getElementById("storyteller").innerHTML = "";
    execSecondFinale();
  }, 13000);
}

function execFinale() {
  disableCommands = true;
  setTimeout(function(){
    document.getElementById("demo").innerHTML = '<span style="color:red">' + "With your quick reflexes, you are able to disarm the attacker and easily restrain him!" + '</span>';
  }, 1000);
  setTimeout(function(){
    document.getElementById("demo").innerHTML = "The chaos dims down, and you have the situation under control once again." + '<br />';
  }, 5000);
  setTimeout(function() {
    document.getElementById("demo").innerHTML = "Penelope thanks you from the bottom of her helping her get rid of her husband's possessive grasp." + '<br />' + '<br />'
    + "Servant#3 expresses his gratitude for allowing them to live out their hapiness together." + '<br />';
  }, 8000);
  setTimeout(function() {
    document.getElementById("demo").innerHTML = "Congratulations! <br /> Welcome to BASH";
  }, 14000);
}

function execSecondFinale() {
  setTimeout(function(){
    document.getElementById("demo").innerHTML = "The chaos dims down, and you have the situation under control once again." + '<br />';
  }, 8000);
  setTimeout(function() {
    document.getElementById("demo").innerHTML = "Penelope thanks you from the bottom of her helping her get rid of her husband's possessive grasp." + '<br />' + '<br />'
    + "Servant#3 expresses his gratitude for allowing them to live out their hapiness together." + '<br />';
  }, 11000);
  setTimeout(function() {
    document.getElementById("demo").innerHTML = "Congratulations! <br /> Welcome to BASH";
  }, 15000);
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
