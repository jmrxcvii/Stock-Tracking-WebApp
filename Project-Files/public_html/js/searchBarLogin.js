// function that grabs username value from url
URLParse = function() {
	let URL = location.search;
	let query = URL.substring(6)
	return query;
}

// AJAX request function that sends the server a search parameter and once a results if any is returned a list of reults is displayed on the corresponding HTML
function sendAJAX() {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
                if (this.status == 200) {
			// checking if search returns nothing
                        if (this.responseText == '[]') 
                                document.getElementById('results').innerHTML='<tr><td style="font-size: 35px">No Results</td></tr>';
                        else {
				// using search results to display information on HTML page
                                let results = JSON.parse(this.responseText);
                                var x ='';
                                for(let i in results) {
                                        x = x + '<tr><td><a href="stockPageLogin.html?name='+results[i].company+'&user='+URLParse()+'">'+results[i].company+'</a></td></tr>'
                                }
                                document.getElementById('results').innerHTML=x;
                        }
                }
                else
                        alert('Server error');
        xmlhttp.onerror = function() {alert('Error')};
        };
	// sending server search parameters
        xmlhttp.open('GET','http://34.138.248.85:80/search?company='+document.getElementById('sBar').value); 
        xmlhttp.send();
}
// once pages loads the page focus is set to the search bar
window.onload = function () {
        document.getElementById('sBar').focus();
	document.getElementById('results').innerHTML = '<b style="font-size: 35px"> Welcome back '+URLParse()+'</b>';
	document.getElementById('menu').innerHTML = '<a href="frontPage.html"> Logout </a> <a href="savedList.html?user='+URLParse()+'"> Saved List </a>';
}
// event listener that checks if the enter key is pressed, then calls AJAX request function
document.getElementById('sBar').addEventListener('keypress', function(event) {if (event.key=='Enter') sendAJAX();});
