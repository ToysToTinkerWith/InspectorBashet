function myFunction() {
    var text = document.getElementById("input").value;
    document.getElementById("demo").innerHTML = text;
    }
    
    document.addEventListener('keypress', logkey);
    
    function logkey(e) {
        if(e.key === 'Enter') {
            myFunction();
            document.getElementById('input').value = "";
        }
    }
    
    