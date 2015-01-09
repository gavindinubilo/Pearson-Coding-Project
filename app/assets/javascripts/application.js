// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require turbolinks
//= require_tree .

$.fn.exists = function(){
    return $( ':not(' + this.selector + ')' ).length < $( '*' ).length;
}

document.addEventListener('page:change', function() {
	Turbolinks.pagesCached(0);
	if($(".home").length) {
		document.getElementsByClassName("home")[0].className += ' animated fadeIn';
	}
	if($(".relax").length) {
		document.getElementsByClassName("relax")[0].className += ' animated fadeIn';
	}
  document.getElementById('primary-content').className += ' animated fadeIn';
	$('p').linkify();
	if($(".relax").exists()) {
		var rand = Math.floor(Math.random() * 3103);
		$.ajax({url:"https://api.giphy.com/v1/gifs/search?q=puppies&api_key=dc6zaTOxFJmzC&limit=3203&offset=0",success:function(data){
			var rand = Math.floor(Math.random() * 100);
			$(".relax").css("background", "url(" + data.data[rand].images.original.url + ") no-repeat center center fixed");
			$(".relax").css("background-size", "cover");
  		}});
  		$(document).keyup(function(evt) {
    		var rand = Math.floor(Math.random() * 3103);
			$.ajax({url:"https://api.giphy.com/v1/gifs/search?q=puppies&api_key=dc6zaTOxFJmzC&limit=3203&offset=0",success:function(data){
				var rand = Math.floor(Math.random() * 100);
				$(".relax").css("background", "url(" + data.data[rand].images.original.url + ") no-repeat center center fixed");
				$(".relax").css("background-size", "cover");
  			}});
  		})
	}
	function getSelectedText() {
	    var text = "";
	    if (typeof window.getSelection != "undefined") {
	        text = window.getSelection().toString();
	    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	}
	function getSelectedElem(){
	    if(window.getSelection){
	        return $(window.getSelection().anchorNode);
	    }
	    else if(document.getSelection){
	        return $(document.getSelection().anchorNode)
	    }
	    else if(document.selection){
	        //todo figure out what to return here:
	        return document.selection.createRange().text;
	    }
	    return $([]);
	}

	function doSomethingWithSelectedText() {
		$('.popover').popover('hide');
		var span = document.createElement("span");
	    span.setAttribute("data-toggle", "popover");
	    span.setAttribute("data-placement", "top auto")
	    if ($("input").is(":focus")) return;
		if (window.getSelection) {
	        var sel = window.getSelection();
	        if (sel.rangeCount) {
	        	var text = sel.toString().split(" ")[0].replace(/[|&;$%@"'<>()+,]/g, "");
	            var range = sel.getRangeAt(0).cloneRange();
	            span.id = text;
	            span.setAttribute("title", text);
	            // Do the ajax call
	            $.getJSON("https://api.pearson.com:443/v2/dictionaries/ldoce5/entries?headword=" + text, function(data) {
	            	var results = data.results[0];
	            	var found = false;
	            	if(data.results.length > 0) {
	            		if ( data.results[0].senses[0].definition ) {
		            		var string = data.results[0].senses[0].definition[0];
		            		found = true;
		            		span.setAttribute("data-content", string);	
	            		}
	            	} 
	            	if(found == false) {
	            		span.setAttribute("data-content", "No definition found :(");	
	            	}
	            	$('#' + text).popover('show');
	            });
	            range.surroundContents(span);
	            sel.removeAllRanges();
	            sel.addRange(range);
	        }
	    }
	}
	function removeLink(id) {
		swal({   
			title: "Are you sure?",
			text: "You will not be able to recover this imaginary file!",   
			type: "warning",   
			showCancelButton: true,   
			confirmButtonText: "Yes, delete it!",   
			cancelButtonText: "No, cancel plx!",   
			closeOnConfirm: false,   
			closeOnCancel: false 
		}, function(isConfirm){   
			if (isConfirm) { 
				$.ajax({
				  type: "POST",
				  url: '/links/' + id,
				  data: {"_method": "delete"}
				});    
				swal({
					title: "Deleted!",
					text: "You will not be able to recover this imaginary file!",   
					type: "success",      
					showCancelButton: true,     
					confirmButtonText: "Yes, delete it!",   
					cancelButtonText: "No!",   
					closeOnConfirm: true,   
					closeOnCancel: true  
				},  
				function(isConfirm) {
					if (!isConfirm) return;
					location.reload();
				});   
			} 
		});
	}
	$(".link-destroy").on("click", function(){
		var link = $(this).data("link-id"); 
		removeLink(link);
	});

	document.onmouseup = doSomethingWithSelectedText;
	document.onkeyup = doSomethingWithSelectedText;

	$(".doc-download").on("click", function(){
		var links = $(this).data("links"); 
		var url = "/docs/" + $(this).data("url") + ".docx";
		var article = $(this).data("article");
		swal({
			title: "Confirm",
			text: "Please confirm that you want to download this word doc.",   
			type: "info", 
			showCancelButton: true,     
			confirmButtonText: "Yes, download it!",   
			cancelButtonText: "No!",   
			closeOnConfirm: true,   
			closeOnCancel: true   
		},  
		function(isConfirm) {
			if (!isConfirm) return;
			$.fileDownload(url, {
			  data: {"links": links, "article": article}
			});
		}); 
	});
	$(document).on("scroll", function() {
		var top = $(this).scrollTop();
		if (top > 100) {
			$(".navbar").removeClass("no-scroll");
		} else {
			$(".navbar").addClass("no-scroll");
		}
	});
	$(document).on("click", function(e) {
		$(".fab").removeClass("active");
		$(".pane").removeClass("active");
	});
	$(".fab").on("click", function(e) {
		e.stopPropagation();
		$(this).toggleClass("active");
		$(".pane").toggleClass("active");
	});
});
document.addEventListener('page:fetch', function() {
	if($(".home").length) {	
		document.getElementsByClassName("home")[0].className += ' animated fadeOut';
	}
	if($(".relax").length) {
		document.getElementsByClassName("relax")[0].className += ' animated fadeIn';
	}
	document.getElementById('primary-content').className += ' animated fadeOut';
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}





