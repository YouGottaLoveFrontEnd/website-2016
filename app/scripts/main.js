'use strict';

var isMobile = (function () {
  return typeof(window.orientation) !== 'undefined';
})();

var pageLoaded = false;
var minimalLoadTimeCounter = 0;

var minimalLoadTimeInterval = setInterval(function () {
  minimalLoadTimeCounter++;

  if (minimalLoadTimeCounter >= 3 && pageLoaded) {
    clearInterval(minimalLoadTimeInterval);

    $('.loader').fadeOut(function () {
      $('.preloader').fadeOut(function () {
        $('body').addClass('loaded');
        $('.preloader').remove();
      });
    });
  }
}, 1000);

function autoScroll(to) {
  if (window.scrollY > to) {
    $(window).scrollTop(window.scrollY - 10);
    setTimeout(function () {
      autoScroll(to);
    }, 10);
  } else if (window.scrollY < to) {
    $(window).scrollTop(to);
  }
}

function fixScheduleHeader(active) {
  if (active) {
    $('.schedule-nav li , .itinerary ul li').each(function (index) {
      $(this).on('click tap touch', function () {
        var child = index % 2;
        $('.itinerary input[name="view"]:checked').prop('checked', false);
        $('#' + $(this).children('label').attr('for')).prop('checked', true);
        $('.active-tab').removeClass('active-tab');
        $('.schedule-nav ul').children().eq(child).addClass('active-tab');
        $('.itinerary ul').children().eq(child).addClass('active-tab');
        if (window.scrollY > $('#schedule-inner-nav').offset().top - 150) {
          autoScroll($('#schedule-inner-nav').offset().top - 150);
        }
      });
    });
    $(window).on('scroll', function () {
      if ($('#menu-trigger').offset().top + 100 > $('.itinerary ul').offset().top) {
        if (!$('.schedule-nav').hasClass('show')) {
          $('.schedule-nav').addClass('show');
          $('.itinerary ul').css({opacity: 0});

        }
      } else {
        if ($('.schedule-nav').hasClass('show')) {
          $('.itinerary ul').css({opacity: 1});
          $('.schedule-nav').removeClass('show');
        }
      }
    });

  } else {
    $(window).unbind('scroll');
  }
}

function reorderPages() {
  var zindex = 9;
  var numOfPages = $('.pages-stack').children('.page').length;
  var currentCue = $('.page').index($('.current'));
  var pagesNewOrder = [];

  while (pagesNewOrder.length < numOfPages) {
    pagesNewOrder.push($('.pages-stack').children('.page').eq(currentCue));
    currentCue++;
    if (currentCue >= numOfPages) {
      currentCue = 0;
    }
  }
  for (var i = 0; i < pagesNewOrder.length; i++) {
    var page = pagesNewOrder[i];
    page.removeAttr('data-pos');
    if (i === 0) {
      page.css({zIndex: zindex});
    } else {
      var newIndex = zindex - i;
      page.css({zIndex: newIndex}).attr('data-pos', i);
    }
  }
}

function onMenuTriggerChange() {

  if ($('#menu-trigger:checked').length) {
    reorderPages();
    $('footer').toggleClass('show');
  } else {
    $('.pages-stack').children('.page').each(function () {
      $(this).removeAttr('style');
    });
    setTimeout(function () {
      $('footer').toggleClass('show');
    }, 400);
  }
}

function disableLink(hash) {
  $('.link.not-active').removeClass('not-active');

  $('.pages-nav .link').each(function () {
    if ($(this).attr('href').slice(1) === hash) {
      $(this).addClass('not-active');
    }
  });
}

function hashchange() {
  var hash = location.hash.slice(1);
  if (hash === undefined || hash === '' || $('#' + hash).hasClass('current')) {
    if (!$('.page').hasClass('current')) {
      $('.page').eq(0).addClass('current');
    }
    disableLink($('.page').eq(0).attr('id').slice(1));
    return;
  }

  if (hash === 'page-schedule') {
    fixScheduleHeader(true);
  } else {
    fixScheduleHeader(false);
  }

  $('.page.current').removeClass('current');
  $('#' + hash).addClass('current');
  disableLink(hash);
}

function initShadow(config) {
  var shadowCount = config.count + 1;
  $('.shadow').each(function () {
    var firstChildValue = $(this).children().eq(0).text();
    for (var i = 0; i < shadowCount; i++) {
      var shadowDemi = '<div class="item stroke-' + i + '">' + firstChildValue + '</div>';
      $(this).append(shadowDemi);
    }
  });

  $(window).on('mousemove', function () {
    $('.shadow').each(function () {
      $(this).mousemove(function (evt) {
        var pointer = {x: evt.offsetX, y: evt.offsetY};
        var range = 400;
        var Xunit = $(this).width() / range;
        var originX = pointer.x / Xunit - (range / 3);
        var Yunit = $(this).height() / range;
        var originY = pointer.y / Yunit - (range / 3);
        $(this).css({'perspective-origin': originX + '% ' + originY + '%'});
      });
    });
  });
}

function windowResize() {
  var scheduleNavWidth = $('.itinerary ul').width(),
      scheduleNavLeft = (window.innerWidth - scheduleNavWidth) / 2;

  $('.schedule-nav').css({width: scheduleNavWidth, left: scheduleNavLeft});
}

$(document).ready(function () {
  $('body')
      .addClass('ready')
      .toggleClass('mobile', isMobile);

  $('input[type="email"]').blur(function () {
    $(this).toggleClass('full', $(this).val() !== '');
  });
  if (!isMobile) {
    initShadow({count: 4});
  }
  hashchange();

  $('.pages-nav .link').each(function () {
    $(this).on('click tap touch', function (e) {
      var hash = $(this).attr('href');
      e.preventDefault();
      $('.page.current').removeClass('current');
      $(hash).addClass('current');
      reorderPages();
      if (hash === '#page-schedule') {
        fixScheduleHeader(true);
      } else {
        fixScheduleHeader(false);
      }
      setTimeout(function () {
        $('#menu-trigger').attr('checked', false);
        onMenuTriggerChange();
        disableLink(hash.slice(1));
      }, 400);
    });
  });

  var weatherURL = 'http://api.openweathermap.org/data/2.5/weather';
  $.ajax({
    url: weatherURL,
    data: 'id=293397&appid=17e28f9119f49c8bf85eaacba44455c1&units=metric',
    success: function (e) {
      var city = e.name;
      var celTemp = Math.round(e.main.temp);
      var ferTemp = Math.round(celTemp * 9 / 5 + 32);
      var country = e.sys.country;
      $('span.city').text(city);
      $('span.celTemp').text(celTemp);
      $('span.ferTemp').text(ferTemp);
      $('span.country').text(country);
    },
    dataType: 'json'
  });

  $('#menu-trigger').on('click tap touch', onMenuTriggerChange);
  $('footer').toggleClass('show');

  $(window).resize(windowResize);
  windowResize();
});

$(window).load(function () {
  pageLoaded = true;

});


