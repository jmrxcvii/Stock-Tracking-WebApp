// function that parses username from url
URLParseUser = function() {
        let URL = location.search;
        let query = URL.slice(6,URL.indexOf('&'));
        return query;
}

// function that parses first stock name from url
URLParseName1 = function() {
    let URL = location.search;
    let sub = URL.substring((URL.indexOf('&')+1));
    let query = sub.substring(7,sub.indexOf('&'));
    return query;
}

// function that parse second stock name from url
URLParseName2 = function() {
    let URL = location.search;
    let sub1 = URL.substring(URL.indexOf('&')+1);
    let sub2 = sub1.substring(sub1.indexOf('&'));
    let query = sub2.substring(8);
    return query;
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

// AJAX function that plots a graph of first stock from url
function sendAJAX1() {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
                if (this.status == 200) {
                        // taking returned server data
                        let results = JSON.parse(this.responseText);
                        // creating array of x axis values to be used with chart.js
                        let xValues = [results[0].price, results[1].price, results[2].price, results[3].price, results[4].price];
                        // using sorting algroithum to sort x axis values to help scale y axis values for better visualization
                        let yValues = slowSort(xValues);
                        // creating blueprints for chart.js graph to be called in HTML page
                        new Chart("myChart1", {
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
                                        scales: {yAxes: [{ticks:{min:yValues[0],max:yValues[-1]}}]}
                                }
                        });
                }
                else
                        alert('Server error');
        xmlhttp.onerror = function() {alert('Error')};
        };
        // requesting data from server based on GET method queary
        xmlhttp.open('GET','http://34.138.248.85:80/price?company='+URLParseName1());
        xmlhttp.send();
}

// AJAX function that plots a graph of the second stock from the url
function sendAJAX2() {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
                if (this.status == 200) {
                        // taking returned server data
                        let results = JSON.parse(this.responseText);
                        // creating array of x axis values to be used with chart.js
                        let xValues = [results[0].price, results[1].price, results[2].price, results[3].price, results[4].price];
                        // using sorting algroithum to sort x axis values to help scale y axis values for better visualization
                        let yValues = slowSort(xValues);
                        // creating blueprints for chart.js graph to be called in HTML page
                        new Chart("myChart2", {
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
                                        scales: {yAxes: [{ticks:{min:yValues[0],max:yValues[-1]}}]}
                                }
                        });
                }
                else
                        alert('Server error');
        xmlhttp.onerror = function() {alert('Error')};
        };
        // requesting data from server based on GET method queary
        xmlhttp.open('GET','http://34.138.248.85:80/price?company='+URLParseName2());
        xmlhttp.send();
}

// tasks completed on page load
window.onload = function() {
    document.getElementById('page').innerHTML = '<a href="frontPageLogin.html?user='+URLParseUser()+'"> Generic Stock </a>';
    document.getElementById('menu').innerHTML = '<a href="frontPageLogin.html?user='+URLParseUser()+'"> Home </a> <a href="frontPage.html"> Logout </a> <a href="savedList.html?user='+URLParseUser()+'"> Saved List </a>';
    document.getElementById('stock1').innerHTML = '<a href="stockPageLogin.html?name='+URLParseName1()+'&user='+URLParseUser()+'">'+URLParseName1()+'</a>';
    document.getElementById('stock2').innerHTML = '<a href="stockPageLogin.html?name='+URLParseName2()+'&user='+URLParseUser()+'">'+URLParseName2()+'</a>';
    sendAJAX1();
    sendAJAX2();
}
