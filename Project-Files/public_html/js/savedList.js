// function to parse GET method from HTML link
URLParse = function() {
    let URL = location.search;
    let query = URL.substring(6);
    return query;
}

// function that collects values from all checked off checkboxes and runs delete function of those values
check = function() {
    let check = Array.from(document.querySelectorAll("input[type=checkbox][name=check]:checked"), e => e.value);
    if (check.length == 0) alert('Please select one or more stocks');
    else {
        for (let i=0;i<check.length;i++) {
                sendAJAXDelete(check[i]);
        }
        window.location.reload();
    }
}

// AJAX function that takes an array of stock names and deletes those from user saved list in database
sendAJAXDelete = function(stock) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
	    if (this.status == 200) {
	        console.log('works');
	    } else alert('Server error');
    xmlhttp.onerror = function() {alert('Error')};
    };
    xmlhttp.open('GET','http://34.138.248.85:80/delete?user='+URLParse()+'&stock='+stock);
    xmlhttp.send();
}

// function that takes 2 checked off checkbox values and passes them to comparePage.html
compare = function() {
    let check = Array.from(document.querySelectorAll("input[type=checkbox][name=check]:checked"), e => e.value);
    if (check.length == 2) window.location.replace('http://34.138.248.85:80/comparePage.html?user='+URLParse()+'&stock1='+check[0]+'&stock2='+check[1]);
    else alert('Please select 2 and only 2 stocks');
}

// AJAX function that displays user saved list
function sendAJAX() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
            if (this.status == 200) {
                // checking if search returns nothing
                if (this.responseText == '[]')
                    document.getElementById('list').innerHTML='<tr><td> No Stocks Saved </td></tr>';
                else {
                    // using search results to display information on HTML page
                    let results = JSON.parse(this.responseText);
                    var x ='';
                    for(let i in results) {
                        x = x + '<tr><td> <a href="stockPageLogin.html?name='+results[i].company+'&user='+URLParse()+'"> '+results[i].company+' </a> <input type="checkbox" name="check" value='+results[i].company+'></input></td></tr>';
                    }
                    document.getElementById('list').innerHTML=x;
                    }
            } else alert('Server error');
    xmlhttp.onerror = function() {alert('Error')};
    };
    // requesting data from server based on GET method queary
    xmlhttp.open('GET','http://34.138.248.85:80/list?user='+URLParse());
    xmlhttp.send();
}

// tasks completed on page load
window.onload = function() {
    document.getElementById('page').innerHTML = '<a href="frontPageLogin.html?user='+URLParse()+'"> Generic Stock </a>';
    document.getElementById('menu').innerHTML = '<a href="frontPageLogin.html?user='+URLParse()+'"> Home </a> <a href="frontPage.html"> Logout </a>';
    sendAJAX();
}

// event listeners for delete and compare buttons
document.getElementById('delete').addEventListener('click',check);
document.getElementById('compare').addEventListener('click',compare);
