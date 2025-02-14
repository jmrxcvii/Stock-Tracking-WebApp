// function to parse GET method from HTML link
URLParse = function() {
	let URL = location.search;
	let query = URL.substring(6)
	return query;
}
// AJAX request function that retrives information from server to be used in HTML and chart.js graph
function sendAJAXStock() {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
                if (this.status == 200) {
			// taking returned server data and displaying information on HTML page
                        let results = JSON.parse(this.responseText);
			document.getElementById('symbol').innerHTML = results[0].symbol;
			sendAJAXPrice();
                }
                else
                        alert('Server error');
	xmlhttp.onerror = function() {alert('Error')};
        };
	// requesting data from server based on GET method queary
        xmlhttp.open('GET','http://34.138.248.85:80/search?company='+URLParse()); 
        xmlhttp.send();
}

// AJAX request that grabs prices of a stock from database
function sendAJAXPrice() {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
                if (this.status == 200) {
                        // taking returned server data and displaying information on HTML page
                        let results = JSON.parse(this.responseText);
			console.log(results);
                        document.getElementById('cPrice').innerHTML = '$' + results[0].price;
                        document.getElementById('yPrice').innerHTML = '$' + results[1].price;
                        document.getElementById('pDiff').innerHTML = (parseFloat(results[0].price) - parseFloat(results[1].price)).toFixed(2);
                        // creating array of x axis values to be used with chart.js
                        let xValues = [results[0].price, results[1].price, results[2].price, results[3].price, results[4].price];
                        // using sorting algroithum to sort x axis values to help scale y axis values for better visualization
                        let yValues = slowSort(xValues);
                        // creating blueprints for chart.js graph to be called in HTML page
                        new Chart("myChart", {
                                type: "line",
                                data: {
                                        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
                                        datasets: [{
                                        fill: false,
                                        lineTension: 0,
                                        backgroundColor: "rgba(0,0,255,1.0)",
                                        borderColor: "rgba(0,0,255,0.1)",
                                        data: xValues
                                        }]
                                },
                                options: {
                                        legend: {display: false},
                                        scales: {yAxes: [{ticks: {min:yValues[0], max:yValues[-1]}}]}
                                }
                        });
                }
                else
                        alert('Server error');
        xmlhttp.onerror = function() {alert('Error')};
        };
        // requesting data from server based on GET method queary
        xmlhttp.open('GET','http://34.138.248.85:80/price?company='+URLParse());
        xmlhttp.send();
}

// function that takes in an array and sorts in from smallest to largest
function slowSort(array){
	let newArray = [];
	for(let i=0;i<newArray.length;i++) {
		for(let j=0;j<newArray.length;j++) {
			if(newArray[i] <= newArray[j]) {
				let temp = newArray[i];
				newArray[i] = newArray[j];
				newArray[j] = temp;
			}
		}
	}
	return newArray;
}
// on page load HTML elements are updated with GET method data and AJAX request function is called
window.onload = function() {
        document.getElementById('title').innerHTML = 'Generic Stock - ' + URLParse();
        document.getElementById('name').innerHTML = URLParse();
        sendAJAXStock();
}
