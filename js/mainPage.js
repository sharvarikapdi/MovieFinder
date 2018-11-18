var moviesData = [];
var myListData = [];

function populateData(data) {
	var eachDivString,eachDivHtml;
	var resultDiv = document.getElementById('searchResult');
	while (resultDiv.hasChildNodes()) {   
	    resultDiv.removeChild(resultDiv.firstChild);
	}
	var parser = new DOMParser();
	for (let i = 0; i< moviesData.length; i++) {
		eachDivString = '<div class="column"><div class="content">'+
		'<img src="'+ moviesData[i].Poster +'" alt="'+ moviesData[i].Title +'"><h3>'+ moviesData[i].Title +
		'</h3><p>Year '+ moviesData[i].Year +
		'<button onclick="addToList(\''+moviesData[i].Title+'\')" class="movie-button">Add to list</button></p>'+
    	'</div></div>';
		eachDivHtml = parser.parseFromString(eachDivString, 'text/html'); 
    	resultDiv.appendChild(eachDivHtml.body.firstChild);
	}
}

function getDefaultData() {
	let str = 'fun';

	searchMovie(str);
}

function searchMovie(val) {
	if(val.length<3){
		return;
	}
	var xhttp;
	var url = 'http://www.omdbapi.com/?apikey=33b8b60d&s='+val;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var result = JSON.parse(this.response);
    	moviesData = [...result.Search];
    	var orderBy = document.getElementById('moview-sort');
    	sortMoviesBy(orderBy.value);
      	populateData();
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function addToList(title) {
	
	var myListObj = myListData.filter(function (currentValue) {
		return currentValue.Title == title;
	});
	if(myListObj.length > 0){
		alert('Already present in my list.');
		return;
	}

	var resultDiv = document.getElementById('myList');
	var movieObj = moviesData.filter(function (currentValue) {
		return currentValue.Title == title;
	})[0];

	var parser = new DOMParser();
	var eachDivString,eachDivHtml;
	eachDivString = '<div class="column"><div class="content">'+
	'<img src="'+ movieObj.Poster +'" alt="'+ movieObj.Title +'" style="width:100%"><h3>'+ movieObj.Title +
	'</h3><p>Year '+ movieObj.Year +
	'<button onclick="removeFromList(\''+movieObj.Title+'\')" class="movie-button">Delete</button></p>'+
	'</div></div>';
	eachDivHtml = parser.parseFromString(eachDivString, 'text/html'); 
	resultDiv.appendChild(eachDivHtml.body.firstChild);

    myListData = [...myListData, movieObj];
	
}

function removeFromList(title) {
	var elem = event.target.parentNode.parentNode.parentNode;
	var listDiv = document.getElementById('myList');
	listDiv.removeChild(elem);
	var indexOfElem = myListData.filter(function (currentValue, index) {
		 if(currentValue.Title == title)
		 	return index;
	});
	myListData.splice(indexOfElem, 1);

}

function sortMoviesBy(val) {
	if(val == 'title'){
		///sort by title
		sortByKey(moviesData, 'Title');
	} else {
		//sort by year
		sortByKey(moviesData, 'Year');
	}
	populateData();
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}