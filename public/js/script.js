$(document).ready(function(){
var load = {
	loadData:function(url, success, error)
	{
		$.ajax({
		 	url: url
		}).done(function(data) {
			if (success)
	            success(data);
		}).error(function(e){
			if (error)
	            error(e);
		});	    
	},
	populateData:function(htmlString, dataObj, context){
		var toBeReplaced = ['id', 'title', 'description', 'genre', 'rating', 'budget', 'audience', 'profits', 'trivia'];
		var newhtmlString = htmlString;
		for (var i = 0; i < toBeReplaced.length; i++) {
			var key = toBeReplaced[i];
			var expresion = '{{movie.' + toBeReplaced[i] + '}}';
			if(key == "description" && context == "list"){
				newhtmlString = newhtmlString.replace(new RegExp(expresion, 'g'), (dataObj[key].substring(0, 100) + "..."));
			}else{
				newhtmlString = newhtmlString.replace(new RegExp(expresion, 'g'), dataObj[key]);
			}				
		};			
		return newhtmlString
	},
};
storage = {};
renderRating = function(){
	var ratingElements = $('.rating');
	for (var i = 0; i < ratingElements.length; i++) {
		var r = parseInt($(ratingElements[i]).attr('rating'));
		var ratingHtml = "rating: "
		for (var j = 1; j <= 5; j++) {
			if(j <= r){
				ratingHtml += "<i class='glyphicon glyphicon-star'></i>";
			}else{
				ratingHtml += "<i class='glyphicon glyphicon-star-empty'></i>";
			};
		};
		$(ratingElements[i]).html(ratingHtml);		
	};
};
hideGallery = function(){
	$("#canvasinner").html('');
	$("#canvas").removeClass("active");
};
revealGallery = function(index){
	galleryLightBox(index);
	$("#canvas").addClass("active"); 
};

galleryLightBox =function(index){
	var galleryItem = $(".galleryItem")[index];
	var galleryHtml = "<img src='" + galleryItem.src +"'>";
	$("#canvasinner").html(galleryHtml);
}
searchPhrase = '';
genreFilter = '';
var contentdiv = $('#contentarea').first();
renderBadRoute=function(){
	load.loadData('partials/404.html', function(data){	
		$(contentdiv).html(data);
	});
};
renderList = function(){
	load.loadData('partials/list.html', function(data){	
		var htmlData = data;
		$(contentdiv).html(data);
		if(genreFilter != ""){			
			var filtersHtml = "<p>filter: <span class='badge badge-important'>"+ genreFilter +" <a href='/'><i class='glyphicon glyphicon-remove-circle'></i></a></span></p>";
			$('#filterwrap').html(filtersHtml);
		}
		load.loadData('data/movies.json', function(data){
			var jsonData = data;
			storage.htmlData = htmlData;
			storage.jsonData = jsonData;
			storage.jsonData = (searchPhrase != "")? searchMovies(searchPhrase) : jsonData;
			storage.jsonData = (genreFilter != "")? searchMoviesByGenre(genreFilter) : storage.jsonData;
			if(storage.jsonData[0]){
				load.loadData('partials/listitem.html', function(data){
					var htmlResult = ""; 
					var htmlData = data;
					for (var i = 0; i < storage.jsonData.length; i++) {
						htmlResult += load.populateData(htmlData, storage.jsonData[i], "list");
					};	
				var listEl = document.getElementById('list');
				
				listEl.innerHTML = htmlResult;
				renderRating();
				});
			}else{
				load.loadData('partials/noresults.html', function(data){	
				var listEl = document.getElementById('list');
				listEl.innerHTML = data;
				});
			}			
		});			
	});
};
renderDetailed = function(item){
	load.loadData('partials/detailed.html', function(data){	
		var htmlData = data;
		load.loadData('data/movies.json', function(data){
			if(data[item]){
				var jsonData = data;
				storage.jsonData = jsonData;			
				var	htmlResult = load.populateData(htmlData, storage.jsonData[item], "detail");			
				$(contentdiv).html(htmlResult);
				renderRating();
			}else{
				renderBadRoute();
			}			
		});		
	});
}
searchMovies = function(phrase){
	var results = [];
	for (var i = 0; i < storage.jsonData.length; i++) {
		if(storage.jsonData[i].title.toLowerCase().indexOf(phrase.toLowerCase()) > -1 ){
			results.push(storage.jsonData[i]);
		}
	};	
	return results
};
searchMoviesByGenre = function(genre){
	var results = [];
	for (var i = 0; i < storage.jsonData.length; i++) {
		if(storage.jsonData[i].genre === genre){
			results.push(storage.jsonData[i]);
		}
	};
	return results
};
var router = function(){
	var route = window.location.href.replace(window.location.origin+"/#/",'');
	if(isNaN(route) == false){
		renderDetailed(route);
	}else if(isNaN(route) == true) {
		if(window.location.href.replace(window.location.origin+"/#/",'')==window.location.origin+"/"){
			renderList();
		}else{
			genreFilter = route;
			renderList();
		}		
	}else{
		renderBadRoute();
	};
};
router();
});

