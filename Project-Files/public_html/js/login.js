// AJAX function that grabs user password from database and compares to user entered password
function sendAJAX() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
	if (document.getElementById('user').value == '' || document.getElementById('password').value == '') {
		alert('Please enter a username and password');
	} else {
        	if (this.status == 200) {
            		let results = JSON.parse(this.responseText);
            		console.log(results);
	    		// check if passwords match then link to frontPageLogin with username as query
	    		if (results == document.getElementById('password').value) {
				window.location.href='frontPageLogin.html?user='+document.getElementById('user').value;
	    		} else {
				alert('Incorrect username or password');
	    		}
        	} else {
            		alert('Incorrect username or password');
        	}
	}
    };
	xmlhttp.onerror = function() {alert('Error')};
    xmlhttp.open('GET','http://34.138.248.85:80/login?user='+document.getElementById('user').value); 
    xmlhttp.send();
}

// login button event listener
document.getElementById('login').addEventListener("click", sendAJAX);
