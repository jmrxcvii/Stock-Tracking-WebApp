// AJAX function that registers a new user in the database
function sendAJAX() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
	if (document.getElementById('user').value == '' || document.getElementById('password').value == '') {
		alert('please enter a username and password');
	} else {
        	if (this.status == 200) {
            		alert('Registration Successful');
	    		window.location.href='frontPageLogin.html?user='+document.getElementById('user').value;
        	} else {
            		alert('Please enter a username and password');
        	}
	}
    };
    xmlhttp.onerror = function() {alert('Error')};
    xmlhttp.open('GET','http://34.138.248.85:80/register?username='+document.getElementById('user').value+'&password='+document.getElementById('password').value); 
    xmlhttp.send();
}

// register button event listener
document.getElementById('register').addEventListener("click", sendAJAX);

