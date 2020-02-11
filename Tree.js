function Node({ name, data }, children){
    this.name = name;
    this.data = data;
    this.children = children;
    this.parent = parent
}

function Tree(){

    this.buildInitTree = function(){

      const nameList = ["Grand Foyer", "Wine Cellar", "Kitchen", "Dining Hall", "Saloon", "Elevator", "2nd Floor", "3rd Floor", "4th Floor", "Bedroom", "Study", "Dressing Room", "Cloak Room", "Game Room", "Fencing Room", "Armory", "Shooting Range", "Gallery", "Billiard Room", "Ball Room", "Piano Room", "Attic", "Servants Quarters #1", "Servants Quarters #2", "Servants Quarters #3", "Servants Quarters #4"];

      this.nodes = nameList.map(name => new Node({name}));

      this.root = this.nodes.find(node => node.name == "Grand Foyer");

      this.root.parent = null;

      this.root.children = this.nodes.filter(node => ["Wine Cellar","Saloon","Dining Hall", "Kitchen", "Elevator"].includes(node.name));

      for (var i = 0; i < this.root.children.length; i++)
        this.root.children[i].parent = this.root;

      this.root.children[4].children = this.nodes.filter(node => ["2nd Floor", "3rd Floor", "4th Floor"].includes(node.name));

      for (var i = 0; i < this.root.children[4].children.length; i++)
        this.root.children[4].children[i].parent = this.root.children[4];

      this.root.children[4].children[0].children = this.nodes.filter(node => ["Bedroom", "Study", "Dressing Room", "Cloak Room"].includes(node.name));

      for (var i = 0; i < this.root.children[4].children[0].children.length; i++)
        this.root.children[4].children[0].children[i].parent = this.root.children[4].children[0];

      this.root.children[4].children[1].children = this.nodes.filter(node => ["Game Room", "Fencing Room", "Armory", "Shooting Range"].includes(node.name));

      for (var i = 0; i < this.root.children[4].children[1].children.length; i++)
        this.root.children[4].children[1].children[i].parent = this.root.children[4].children[1];

      this.root.children[4].children[2].children = this.nodes.filter(node => ["Gallery", "Billiard Room", "Ball Room", "Piano Room", "Attic"].includes(node.name));

      for (var i = 0; i < this.root.children[4].children[2].children.length; i++)
        this.root.children[4].children[2].children[i].parent = this.root.children[4].children[2];

      this.root.children[4].children[2].children[4].children = this.nodes.filter(node => ["Servants Quarters #1", "Servants Quarters #2", "Servants Quarters #3", "Servants Quarters #4"].includes(node.name));

      for (var i = 0; i < this.root.children[4].children[2].children[4].children.length; i++)
        this.root.children[4].children[2].children[4].children[i].parent = this.root.children[4].children[2].children[4];

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
  for(var i = 0; i < tree.nodes.length; i++){
    if(roomName == tree.nodes[i].name){
      return tree.nodes[i].parent.name;
    }
  }
}

function getChildren(tree, roomName){
  for(var i = 0; i < tree.nodes.length; i++){
    if(roomName == tree.nodes[i].name){
      return tree.nodes[i].children;
    }
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
