"use strict";function autoScroll(a){window.scrollY>a?($(window).scrollTop(window.scrollY-10),setTimeout(function(){autoScroll(a)},10)):window.scrollY<a&&$(window).scrollTop(a)}function fixScheduleHeader(a){a?($(".schedule-nav li , .itinerary ul li").each(function(a){$(this).on("click tap touch",function(){var b=a%2;$('.itinerary input[name="view"]:checked').prop("checked",!1),$("#"+$(this).children("label").attr("for")).prop("checked",!0),$(".active-tab").removeClass("active-tab"),$(".schedule-nav ul").children().eq(b).addClass("active-tab"),$(".itinerary ul").children().eq(b).addClass("active-tab"),window.scrollY>$("#schedule-inner-nav").offset().top-120&&autoScroll($("#schedule-inner-nav").offset().top-120)})}),$(window).on("scroll",function(){$("#menu-trigger").offset().top+100>$(".itinerary ul").offset().top&&($(".schedule-nav").hasClass("show")||($(".schedule-nav").toggleClass("show"),$(".itinerary ul").css({opacity:0}))),$("#menu-trigger").offset().top+100<=$(".itinerary ul").offset().top&&$(".schedule-nav").hasClass("show")&&($(".itinerary ul").css({opacity:1}),$(".schedule-nav").toggleClass("show"))})):$(window).unbind("scroll")}function reorderPages(a){var b,c=allPagesRadioBtn.length;allPagesRadioBtn.forEach(function(a,c){a.checked&&(b=c)});for(var d=[];d.length<c;)d.push(allPages[b]),b++,b>=c&&(b=0);for(var e=0;e<d.length;e++){var f=d[e];f.removeAttribute("data-pos"),0!==e&&f.setAttribute("data-pos",e)}"function"==typeof a&&a()}function onMenuTriggerChange(){menuTrigger.checked?(reorderPages(),pagesStack.style.marginBottom="0px"):isMobile||(pagesStack.style.marginBottom=footer.clientHeight+"px")}function disableLink(a){topNavLinks.forEach(function(b){b.className=b.className.replace("not-active",""),b.className=b.className.replace("disable",""),b.attributes.href.nodeValue.slice(1)===a&&(b.className+=isMobile?" not-active disable":" not-active")})}function hashchange(){var a=location.hash?location.hash.slice(1):null;if(null===a)return void(window.location.hash="#page-home");var b=a.replace("page","radio-nav"),c=document.getElementById(b);return null===c?void(window.location.hash="#page-home"):(c.checked=!0,fixScheduleHeader("page-program"===a?!0:!1),menuTrigger.checked=!1,reorderPages(function(){onMenuTriggerChange(),window.location.hash=a,window.scrollTo(0,0);for(var b=0;b<allPages.length;b++)allPages[b].removeAttribute("data-pos")}),disableLink(a),void(isMobile&&(footer.style.top=$(".pages-stack").height()+"px")))}function initShadow(a){var b=a.count+1;$(".shadow").each(function(){for(var a=$(this).children().eq(0).text(),c=0;b>c;c++){var d='<div class="item stroke-'+c+'">'+a+"</div>";$(this).append(d)}}),isMobile||$(".shadow").each(function(){$(this).parent().on("mousemove",function(a){var b={x:a.offsetX,y:a.offsetY},c=400,d=$(this).children(".shadow"),e=d.width()/c,f=b.x/e-c/3,g=d.height()/c,h=b.y/g-c/3;f>=280&&(f=280),d.css({"perspective-origin":f+"% "+h+"%"})})})}function modifyScheduleNavWidth(){var a=$(".itinerary ul").width(),b=(window.innerWidth-a)/2;$(".schedule-nav").css({width:a,left:b})}function windowResize(){isMobile?pagesStack.style.marginBottom="0px":pagesStack.style.marginBottom=footer.clientHeight+"px",modifyScheduleNavWidth()}function logoInit(){var a=document.querySelector(".logo"),b=a.getBoundingClientRect(),c=document.scrollingElement.scrollTop,d=document.scrollingElement.scrollLeft,e={t:b.top-c,l:b.left-d,b:b.bottom-c,r:b.right-d,cx:b.width/2+b.left+d,cy:b.height/2+b.top+c,w:b.width,h:b.height},f=a.querySelectorAll(".letters-tail ul"),g=[].map.call(f,function(a){return getComputedStyle(a)["perspective-origin"].split(" ").map(function(a){return parseInt(a)})}),h=e.cx,i=e.cy,j=function(){b=a.getBoundingClientRect(),c=document.scrollingElement.scrollTop,d=document.scrollingElement.scrollLeft,e={t:b.top-c,l:b.left-d,b:b.bottom-c,r:b.right-d,cx:b.width/2+b.left+d,cy:b.height/2+b.top+c,w:b.width,h:b.height},g=[].map.call(f,function(a){return getComputedStyle(a)["perspective-origin"].split(" ").map(function(a){return parseInt(a)})})},k=function(a){window.requestAnimationFrame(function(){h=a.pageX-h,i=a.pageY-i,g.forEach(function(a,b){a[0]+=h,a[1]+=i,f[b].style["perspective-origin"]=a.map(function(a){return a+"px"}).join(" ")}),h=a.pageX,i=a.pageY})};window.addEventListener("resize",j),isMobile||window.addEventListener("mousemove",k,!0)}var isMobile=function(){return"undefined"!=typeof window.orientation}(),pageLoaded=!1,minimalLoadTimeCounter=0,footer=document.getElementsByClassName("footer-wrapper")[0],pagesStack=document.getElementsByClassName("pages-stack")[0],allPages=[].slice.call(pagesStack.getElementsByClassName("page")),allPagesRadioBtn=[].slice.call(document.getElementsByClassName("page-radio-nav")),topNavLinks=[].slice.call(document.getElementsByClassName("pages-nav")[0].getElementsByClassName("link")),body=document.getElementsByTagName("body")[0],menuTrigger=document.getElementById("menu-trigger"),minimalLoadTimeInterval=setInterval(function(){minimalLoadTimeCounter++,minimalLoadTimeCounter>=3&&pageLoaded&&(clearInterval(minimalLoadTimeInterval),$(".loader").fadeOut(function(){$(".preloader").fadeOut(function(){$("body").addClass("loaded"),$(".preloader").remove()})}))},1e3);window.onload=function(){isMobile&&(body.classList.add("mobile"),footer.classList.add("mobile"),footer.classList.remove("hide")),body.classList.add("ready");var a=document.getElementById("email");a.onblur=function(){a.classList.contains("full")&&""!==a.value?a.classList.add("full"):""===a.value&&a.classList.remove("full")},initShadow({count:4}),hashchange(),window.addEventListener("hashchange",hashchange,!0),pageLoaded=!0,logoInit();var b="http://api.openweathermap.org/data/2.5/weather";$.ajax({url:b,data:"id=293397&appid=17e28f9119f49c8bf85eaacba44455c1&units=metric",success:function(a){var b=a.name,c=Math.round(a.main.temp),d=Math.round(9*c/5+32),e=a.sys.country;$("span.city").text(b),$("span.celTemp").text(c),$("span.ferTemp").text(d),$("span.country").text(e)},dataType:"json"}),menuTrigger.addEventListener("click",onMenuTriggerChange,!0),menuTrigger.addEventListener("touchend",onMenuTriggerChange,!0),setTimeout(function(){footer.classList.remove("hide"),body.classList.remove("loading"),windowResize()},400),window.addEventListener("resize",windowResize,!0)};