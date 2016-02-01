var main = {};

// initializing app
main.init = function(){

	main.bindings();
	main.getPageLikes();
}

main.search = function(term){

	ajax.get('https://graph.facebook.com/search?q='+term+'&type=page&access_token=476234999216770|87202c0d651e2ec1bc97d47e62a1ec02', {}, function (data) {
	  data = JSON.parse(data);
	  main.renderList(data);	  
	});
}

main.bindings = function(){

	var searchBtn = document.getElementById('searchBtn');
	var searchBar = document.getElementById('pageSearch');
	searchBtn.onclick = function(){
		if(searchBar.value != "")
        	main.search(searchBar.value);
    }; 

    searchBar.onkeyup = function(e){
    	if(e.keyCode == 13 && searchBar.value != "")
    		main.search(searchBar.value);
    }
}

main.renderList = function(data){

	var sortedList = data.data.sort(main.sortByName);
	var listItem = "";
	var list = "";
	document.getElementById("page-list").innerHTML = "";

	for(var i = 0; i<sortedList.length; i++)
	{
		listItem = "<li class=\"list-group-item\"><div style=\"width: 62px;\" class=\"col-xs-2 col-sm-2\"><img src=\"img/facebook.png\" class=\"img-responsive\" /></div><div class=\"col-xs-10 col-sm-10\"><span class=\"name\">"+sortedList[i].name+"</span><br/><span class=\"text-muted\">"+sortedList[i].category+"</span><br/><button class=\"btn btn-primary details-btn btn-sm detailsBtn\" type=\"button\" onclick=\"main.getDetail("+sortedList[i].id+")\" id=\""+sortedList[i].id+"\">See Details</button></div><div class=\"clearfix\"></div></li>";
		list += listItem;
	}

	document.getElementById("page-list").innerHTML = list;
	document.getElementById("page-list").scrollTop = 0;

	main.show(document.getElementById("display-list"));
}


main.sortByName = function (a, b){

  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}


main.getDetail = function(id){

	ajax.get('https://graph.facebook.com/'+id+'?fields=about,name,bio,picture&access_token=476234999216770|87202c0d651e2ec1bc97d47e62a1ec02', {}, function (data) {
	  data = JSON.parse(data);
	  main.renderDetail(data);	  
		if(main.checkLike(id)){
			document.getElementById("likeStatus").innerHTML = 'Unlike';
			document.getElementById("likeStatusLink").setAttribute("onclick", "main.unLikePage("+id+")");
		}
		else{
			document.getElementById("likeStatus").innerHTML = 'Like';
			document.getElementById("likeStatusLink").setAttribute("onclick", "main.likePage("+id+")");
		}
	});
}

main.renderDetail = function(data){

	if(data.about)
		document.getElementById("aboutPage").innerHTML = data.about;
	else
		document.getElementById("aboutPage").innerHTML = "Data not available.";

	if(data.picture && data.picture.data.url)
		document.getElementById("pageImage").src = data.picture.data.url;

	if(data.bio)
		document.getElementById("descBody").innerHTML = data.bio;
	else
		document.getElementById("descBody").innerHTML = "Description not available.";

	document.getElementById("pageDetailTitle").innerHTML = data.name;
	
	main.hide(document.getElementById("gaurav-profile"));
	main.show(document.getElementById("page-desc"));

}


main.likePage = function(id){
          
    if(typeof(Storage) !== "undefined") {
        main.unLikePage(id);
        var pageData = localStorage.getItem("pageLikes");
        pageData = JSON.parse(pageData);
        pageData.data.push(id);
        localStorage.setItem('pageLikes', JSON.stringify(pageData));
        document.getElementById("likeStatus").innerHTML = 'Unlike';
		document.getElementById("likeStatusLink").setAttribute("onclick", "main.unLikePage("+id+")");    
      }
 }

main.unLikePage = function(index){

    var pageData = main.getPageLikes();
    var i = pageData.data.indexOf(index);
    if(i != -1) {
      pageData.data.splice(i, 1);
    }
    localStorage.setItem('pageLikes', JSON.stringify(pageData));
	document.getElementById("likeStatus").innerHTML = 'Like';
	document.getElementById("likeStatusLink").setAttribute("onclick", "main.likePage("+index+")");
}

main.getPageLikes = function(){
    
      if (localStorage.getItem("pageLikes") === null) {
          localStorage.setItem('pageLikes', JSON.stringify({data: []}));
          return JSON.stringify({data: []});
        }else{
          var data = localStorage.getItem("pageLikes");
           return JSON.parse(data);
          console.log(data);
        }
}

main.checkLike = function(index){

    var pageData = main.getPageLikes();
    var i = pageData.data.indexOf(index);
    if(i != -1) {
      return true;
    }else{
      return false;
    }
}

main.show = function(element, classname){
	element.className = element.className.replace(/\bhidden\b/,'');
}

main.hide = function(element, classname){
	element.className += ' hidden';
}



document.addEventListener("DOMContentLoaded", function(event) { 
    main.init();
});