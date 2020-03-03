function Node({ name, data }, children){
    this.name = name;
    this.data = data;
    this.children = children;
    this.parent = parent
}

function Tree(){

    this.buildInitTree = function(){

      const nameList = ["Grand_Foyer", "Wine_Cellar", "Kitchen", "Dining_Hall", "Elevator", "2nd_Floor", "3rd_Floor", "4th_Floor", "Bedroom", "Study", "Dressing_Room", "Game_Room", "Armory", "Shooting_Range", "Gallery", "Billiard_Room", "Piano_Room", "Attic", "Servants_Quarters_#1", "Servants_Quarters_#2", "Servants_Quarters_#3", "Maids_Quarters"];

      this.nodes = nameList.map(name => new Node({name}));

      this.root = this.nodes.find(node => node.name == "Grand_Foyer");

      this.root.parent = null;

      this.root.children = this.nodes.filter(node => ["Wine_Cellar", "Dining_Hall", "Kitchen", "Elevator"].includes(node.name));

      for (var i = 0; i < this.root.children.length; i++)
        this.root.children[i].parent = this.root;

      this.root.children[3].children = this.nodes.filter(node => ["2nd_Floor", "3rd_Floor", "4th_Floor"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children.length; i++)
        this.root.children[3].children[i].parent = this.root.children[3];

      this.root.children[3].children[0].children = this.nodes.filter(node => ["Bedroom", "Study", "Dressing_Room"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[0].children.length; i++)
        this.root.children[3].children[0].children[i].parent = this.root.children[3].children[0];

      this.root.children[3].children[1].children = this.nodes.filter(node => ["Game_Room", "Armory", "Shooting_Range"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[1].children.length; i++)
        this.root.children[3].children[1].children[i].parent = this.root.children[3].children[1];

      this.root.children[3].children[2].children = this.nodes.filter(node => ["Gallery", "Billiard_Room", "Piano_Room", "Attic"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[2].children.length; i++)
        this.root.children[3].children[2].children[i].parent = this.root.children[3].children[2];

      this.root.children[3].children[2].children[3].children = this.nodes.filter(node => ["Servants_Quarters_#1", "Servants_Quarters_#2", "Servants_Quarters_#3", "Maids_Quarters"].includes(node.name));

      for (var i = 0; i < this.root.children[3].children[2].children[3].children.length; i++)
        this.root.children[3].children[2].children[3].children[i].parent = this.root.children[3].children[2].children[3];

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
}
else {
    return [];
}
}

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
