
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

			document.getElementById("demo").innerHTML =
			xmlDoc.getElementsByTagName("room")[0].attributes.getNamedItem("name").nodeValue;

			let rooms = xmlDoc.getElementsByTagName("room");

			for (var i = 0; i < rooms.length; i++){
				var roomName = rooms[i].attributes.getNamedItem("name").nodeValue;
				console.log(roomName);
				let items = rooms[i].getElementsByTagName("item");
				for (var j = 0; j < items.length; j++){
					var itemName = items[j].getElementsByTagName("name")[0].childNodes[0].nodeValue;
					console.log(itemName);
					var itemDes = items[j].getElementsByTagName("description")[0].childNodes[0].nodeValue;
					console.log(itemDes);
					var itemAct = items[j].getElementsByTagName("activation")[0].childNodes[0].nodeValue;
					console.log(itemAct);
				}
				let people = rooms[i].getElementsByTagName("person");
				for (var k = 0; k < people.length; k++){
					var personName = people[k].getElementsByTagName("name")[0].childNodes[0].nodeValue;
					console.log(personName);
					var personDes = people[k].getElementsByTagName("description")[0].childNodes[0].nodeValue;
					console.log(personDes);
					var personDia = people[k].getElementsByTagName("dialog")[0].childNodes[0].nodeValue;
					console.log(personDia);
				}

			}
			
		}
		reader.readAsText(input.files[0]);





		




		}, false)
}

