"use strict";function autoScroll(a){window.scrollY>a?($(window).scrollTop(window.scrollY-10),setTimeout(function(){autoScroll(a)},10)):window.scrollY<a&&$(window).scrollTop(a)}function fixScheduleHeader(a){a?($(".schedule-nav li , .itinerary ul li").each(function(a){$(this).on("click tap touch",function(){var b=a%2;$('.itinerary input[name="view"]:checked').prop("checked",!1),$("#"+$(this).children("label").attr("for")).prop("checked",!0),$(".active-tab").removeClass("active-tab"),$(".schedule-nav ul").children().eq(b).addClass("active-tab"),$(".itinerary ul").children().eq(b).addClass("active-tab"),window.scrollY>$("#schedule-inner-nav").offset().top-120&&autoScroll($("#schedule-inner-nav").offset().top-120)})}),$(window).on("scroll",function(){$("#menu-trigger").offset().top+100>$(".itinerary ul").offset().top?$(".schedule-nav").hasClass("show")||($(".schedule-nav").addClass("show"),$(".itinerary ul").css({opacity:0})):$(".schedule-nav").hasClass("show")&&($(".itinerary ul").css({opacity:1}),$(".schedule-nav").removeClass("show"))})):$(window).unbind("scroll")}function reorderPages(){for(var a=$(".pages-stack").children(".page").length,b=$(".page").index($(".current")),c=[];c.length<a;)c.push($(".pages-stack").children(".page").eq(b)),b++,b>=a&&(b=0);for(var d=0;d<c.length;d++){var e=c[d];e.removeAttr("data-pos"),0!==d&&e.attr("data-pos",d)}}function onMenuTriggerChange(){$("#menu-trigger:checked").length?(reorderPages(),$("footer").toggleClass("show")):($(".pages-stack").children(".page").each(function(){$(this).removeAttr("style")}),setTimeout(function(){$("footer").toggleClass("show")},400))}function disableLink(a){$(".link.not-active").removeClass("not-active"),$(".pages-nav .link").each(function(){$(this).attr("href").slice(1)===a&&$(this).addClass("not-active")})}function hashchange(){var a=location.hash.slice(1);return void 0===a||""===a||$("#"+a).hasClass("current")?($(".page").hasClass("current")||$(".page").eq(0).addClass("current"),void disableLink($(".page").eq(0).attr("id").slice(1))):(fixScheduleHeader("page-program"===a?!0:!1),$(".page.current").removeClass("current"),$("#"+a).addClass("current"),void disableLink(a))}function initShadow(a){var b=a.count+1;$(".shadow").each(function(){for(var a=$(this).children().eq(0).text(),c=0;b>c;c++){var d='<div class="item stroke-'+c+'">'+a+"</div>";$(this).append(d)}}),$(".shadow").each(function(){$(this).parent().on("mousemove",function(a){var b={x:a.offsetX,y:a.offsetY},c=400,d=$(this).children(".shadow"),e=d.width()/c,f=b.x/e-c/3,g=d.height()/c,h=b.y/g-c/3;f>=280&&(f=280),d.css({"perspective-origin":f+"% "+h+"%"})})})}function windowResize(){var a=$(".itinerary ul").width(),b=(window.innerWidth-a)/2;$(".schedule-nav").css({width:a,left:b})}function logoInit(){var a=document.querySelector(".logo"),b=a.getBoundingClientRect(),c=document.scrollingElement.scrollTop,d=document.scrollingElement.scrollLeft,e={t:b.top-c,l:b.left-d,b:b.bottom-c,r:b.right-d,cx:b.width/2+b.left+d,cy:b.height/2+b.top+c,w:b.width,h:b.height},f=a.querySelectorAll(".letters-tail ul"),g=[].map.call(f,function(a){return getComputedStyle(a)["perspective-origin"].split(" ").map(function(a){return parseInt(a)})}),h=e.cx,i=e.cy;window.addEventListener("resize",function(){b=a.getBoundingClientRect(),c=document.scrollingElement.scrollTop,d=document.scrollingElement.scrollLeft,e={t:b.top-c,l:b.left-d,b:b.bottom-c,r:b.right-d,cx:b.width/2+b.left+d,cy:b.height/2+b.top+c,w:b.width,h:b.height},g=[].map.call(f,function(a){return getComputedStyle(a)["perspective-origin"].split(" ").map(function(a){return parseInt(a)})})}),window.addEventListener("mousemove",function(a){window.requestAnimationFrame(function(){h=a.pageX-h,i=a.pageY-i,g.forEach(function(a,b){a[0]+=h,a[1]+=i,f[b].style["perspective-origin"]=a.map(function(a){return a+"px"}).join(" ")}),h=a.pageX,i=a.pageY})},!0);var j=document.createEvent("MouseEvent");j.initEvent("mousemove"),window.dispatchEvent(j)}var isMobile=function(){return"undefined"!=typeof window.orientation}(),pageLoaded=!1,minimalLoadTimeCounter=0,minimalLoadTimeInterval=setInterval(function(){minimalLoadTimeCounter++,minimalLoadTimeCounter>=3&&pageLoaded&&(clearInterval(minimalLoadTimeInterval),$(".loader").fadeOut(function(){$(".preloader").fadeOut(function(){$("body").addClass("loaded"),$(".preloader").remove()})}))},1e3);$(document).ready(function(){$("body").addClass("ready").toggleClass("mobile",isMobile),$('input[type="email"]').blur(function(){$(this).toggleClass("full",""!==$(this).val())}),isMobile||initShadow({count:4}),hashchange(),$(".pages-nav .link").each(function(){$(this).on("click tap touch",function(a){var b=$(this).attr("href");a.preventDefault(),$(".page.current").removeClass("current"),$(b).addClass("current"),reorderPages(),fixScheduleHeader("#page-schedule"===b?!0:!1),setTimeout(function(){$("#menu-trigger").attr("checked",!1),onMenuTriggerChange(),disableLink(b.slice(1))},400)})});var a="http://api.openweathermap.org/data/2.5/weather";$.ajax({url:a,data:"id=293397&appid=17e28f9119f49c8bf85eaacba44455c1&units=metric",success:function(a){var b=a.name,c=Math.round(a.main.temp),d=Math.round(9*c/5+32),e=a.sys.country;$("span.city").text(b),$("span.celTemp").text(c),$("span.ferTemp").text(d),$("span.country").text(e)},dataType:"json"}),$("#menu-trigger").on("click tap touch",onMenuTriggerChange),$("footer").toggleClass("show"),$(window).resize(windowResize),windowResize()}),$(window).load(function(){pageLoaded=!0,logoInit()});