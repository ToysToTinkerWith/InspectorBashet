
/*
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
	if(xhr.readyState == 4) {
		if(xhr.status == 200) {
			console.log(xhr.responseText);
		}
		if(xhr.status == 404){
			console.log("File or resource not found");
		}
	}

};

xhr.open('GET', 'test.json', true);
xhr.send();
*/

const input = document.querySelector('input[type="file"]');
if (input) {
	input.addEventListener('change', function(e) {
		console.log(input.files);
		let reader = new FileReader();
		reader.onload = function(event) {
			let text = event.target.result.split('\n');

			parser = new DOMParser();
			xmlDoc = parser.parseFromString(text,"text/xml");

			let rooms = xmlDoc.getElementsByTagName("room");

			var house = [];

			for (var i = 0; i < rooms.length; i++){
				var roomName = rooms[i].attributes.getNamedItem("name").nodeValue;
				
				console.log(roomName);
				let items = rooms[i].getElementsByTagName("item");
				var itemName;
				var itemDes;
				var itemAct;
				var itemList = [];
				for (var j = 0; j < items.length; j++){
					itemName = items[j].getElementsByTagName("name")[0].childNodes[0].nodeValue;
					console.log(itemName);
					itemDes = items[j].getElementsByTagName("description")[0].childNodes[0].nodeValue;
					console.log(itemDes);
					itemAct = items[j].getElementsByTagName("activation")[0].childNodes[0].nodeValue;
					console.log(itemAct);

					var completeItem = new Item(itemName,itemDes,itemAct);
					itemList.push(completeItem);
				}

				let people = rooms[i].getElementsByTagName("person");
				var personName;
				var personDes;
				var personDia;
				var personList = [];
				for (var k = 0; k < people.length; k++){


					personName = people[k].getElementsByTagName("name")[0].childNodes[0].nodeValue;
					console.log(personName);
					personDes = people[k].getElementsByTagName("description")[0].childNodes[0].nodeValue;
					console.log(personDes);
					personDia = people[k].getElementsByTagName("dialog")[0].childNodes[0].nodeValue;
					console.log(personDia);

					var completePerson = new Person(personName,personDes,personDia);
					personList.push(completePerson);
				}
				 
				var completeRoom = new Room(roomName,itemList,personList);
				house.push(completeRoom)
			}

			console.log(house);
			
		}
		reader.readAsText(input.files[0]);





		




		}, false)
}

