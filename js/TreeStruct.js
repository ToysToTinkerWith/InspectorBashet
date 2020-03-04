function Node({ name, data }, children){
    this.name = name;
    this.data = data;
    this.children = children;
    this.parent = parent
}

function Tree(){

    this.buildInitTree = function(){

      const nameList = ["Grand_Foyer", "Wine_Cellar", "Kitchen", "Dining_Hall", "Elevator", "2nd_Floor", "3rd_Floor", "4th_Floor", "Bedroom", "Study", "Dressing Room", "Game Room", "Armory", "Shooting Range", "Gallery", "Billiard Room", "Piano Room", "Attic", "Servant#1_Room", "Servant#2_Room", "Servant#3_Room", "Maid's_Room"];

      this.nodes = nameList.map(name => new Node({name}));

      this.root = this.nodes.find(node => node.name == "Grand_Foyer");

      this.root.parent = null;
///////////////////////////////FIRST FLOOR/////////////////////////////////////////////////////////////////////////////////
      this.root.children = this.nodes.filter(node => ["Wine_Cellar", "Dining_Hall", "Kitchen", "Elevator"].includes(node.name));

      for (var i = 0; i < this.root.children.length; i++) // Cycling to assign Grand_Foyer as parent
        this.root.children[i].parent = this.root;
/////////////////////////////ELEVATOR//////////////////////////////////////////////////////////////////////////////////////////
      this.root.children[3].children = this.nodes.filter(node => ["2nd_Floor", "3rd_Floor", "4th_Floor"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children.length; i++) // Cycling to assign elevator as parent of floors
        this.root.children[3].children[i].parent = this.root.children[3];
////////////////////////////2ND FLOOR/////////////////////////////////////////////////////////////////////////////////////////////
      this.root.children[3].children[0].children = this.nodes.filter(node => ["Bedroom", "Study", "Dressing Room"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[0].children.length; i++) // Cycling to assign 2nd floor as parent
        this.root.children[3].children[0].children[i].parent = this.root.children[3].children[0];
////////////////////////////3RD FLOOR////////////////////////////////////////////////////////////////////////////////////////////
      this.root.children[3].children[1].children = this.nodes.filter(node => ["Game Room", "Armory", "Shooting Range"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[1].children.length; i++) // Cycling to assign 3rd floor as parent
        this.root.children[3].children[1].children[i].parent = this.root.children[3].children[1];
///////////////////////////4TH FLOOR////////////////////////////////////////////////////////////////////////////////////////////
      this.root.children[3].children[2].children = this.nodes.filter(node => ["Gallery", "Billiard Room", "Piano Room", "Attic"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[2].children.length; i++) // Cycling to assign 4th floor as parent
        this.root.children[3].children[2].children[i].parent = this.root.children[3].children[2];
///////////////////////////ATTIC//////////////////////////////////////////////////////////////////////////////////////////////
      this.root.children[3].children[2].children[3].children = this.nodes.filter(node => ["Servant#1_Room", "Servant#2_Room", "Servant#3_Room", "Maid's_Room"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[2].children[3].children.length; i++) // Cycling to assign Attic as parent
        this.root.children[3].children[2].children[3].children[i].parent = this.root.children[3].children[2].children[3];
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      for(var i = 0; i < this.nodes.length; i++){
        if(typeof this.nodes[i].children === 'undefined'){
          this.nodes[i].children = null;
        }
      }

  }

}

function showFullList(tree){
  for(var i = 0; i < tree.nodes.length; i++){
    console.log(tree.nodes[i]);
  }
}

function getParent(tree, roomName){
if (roomName.localeCompare("Grand_Foyer") != 0) {
  for(var i = 0; i < tree.nodes.length; i++){
    if(roomName == tree.nodes[i].name){
      return tree.nodes[i].parent.name;
    }
  }
} else {
    return [];
}
}

// function setParent(room, parentRoomName, tree) {
//   for(var i = 0; i < tree.nodes.length; i++){
//     if(parentRoomName == tree.nodes[i].name){
//       tree.nodes[i]
//     }
//   }
// }

function getChildren(tree, roomName){
    if (!isLeaf(tree, roomName)){
    for(var i = 0; i < tree.nodes.length; i++){
        if(roomName == tree.nodes[i].name){
        return tree.nodes[i].children;
        }
    }
    }
    else {
        return [];
    }
}

function isLeaf(tree, roomName){
  for(var i = 0; i < tree.nodes.length; i++){
    if(roomName == tree.nodes[i].name){
      if(tree.nodes[i].children == null){
        return true;
      }
      else{
        return false;
      }
    }
  }
}

var tree = new Tree();
tree.buildInitTree();
// console.log(getParent(tree, "Attic"));
// console.log(getChildren(tree, "Attic"));
// showFullList(tree);
// console.log(isLeaf(tree,"Servants Quarters #1"));
