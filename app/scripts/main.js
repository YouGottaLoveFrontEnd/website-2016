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
        var scrollToVal = window.scrollY < $('#menu-trigger').offset().top + 100 ? window.scrollY : $('#menu-trigger').offset().top + 100;
        $(window).scrollTop(scrollToVal);
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

function thisConfigProps(e, _this) {
  return {offset: _this.offset(), relX: e.pageX - _this.offset().left, relY: e.pageY - _this.offset().top, x: _this.width() / 2, y: _this.height() / 2};
}

function followTheLeader(e, _this) {
  _this.prop = thisConfigProps(e, _this);
  var index = 1;
  var opStyle = 1;
  var opLayer = 1 / _this.children().length;
  _this.children().each(function () {
    var item = $(this);
    var itemIndexOffset = index;
    index += opLayer;

    var distance = {
      x: _this.prop.x - (( _this.prop.x - _this.prop.relX) / itemIndexOffset) - _this.prop.x,
      y: _this.prop.y - (( _this.prop.y - _this.prop.relY) / itemIndexOffset) - _this.prop.y
    };
    switch (item.parent().attr('data-move')) {
      case 'random' :
        var dir = Math.floor(Math.random() * 2) > 0 ? 1 : -1;
        itemIndexOffset = Math.random() * (itemIndexOffset / 2) * dir;
        distance = {
          x: Math.random() * (_this.prop.x - (( _this.prop.x - _this.prop.relX) / itemIndexOffset) - _this.prop.x),
          y: Math.random() * (_this.prop.y - (( _this.prop.y - _this.prop.relY) / itemIndexOffset) - _this.prop.y)
        };
        break;

    }
    if (distance.x === undefined) {
      console.log(index, 'clear');
      return;
    }

    item.css({top: distance.y, left: distance.x, opacity: opStyle});
    opStyle -= opLayer;
  });

}

function pointData(arr) {
  var obj = {}, data = arr.split(',');
  obj.x = parseInt(data[0]);
  obj.y = parseInt(data[1]);
  return obj;
}

function moveSingleLetter(letter, points) {
  var opLayer = 1 / points.length;
  for (var i = 0; i < points.length; i++) {
    var point = pointData(points[i][0]);
    var op = opLayer * i;
    letter.eq(0).children('.item').eq(i).css({top: point.y, left: point.x, opacity: op});
  }

}

function trailTheLeader(e, _this) {
  var points = _this.attr('dataPoints') ? JSON.parse(_this.attr('dataPoints')) : {};
  var lettersCount = _this.attr('shadow');
  var num = e.originalEvent.clientY + e.originalEvent.clientX;
  if (points['0'] && points['0'].length >= lettersCount && (num % 7 !== 2)) {
    return;
  }
  var childes = _this.children('.single-letter');
  _this.prop = thisConfigProps(e, _this);
  var wildCardX = _this.prop.x > _this.prop.relX ? 1 : -1;
  var wildCardY = _this.prop.y > _this.prop.relY ? -1 : 1;
  for (var i = 0; i < childes.length; i++) {
    var child = childes.eq(i);
    var arr = points.hasOwnProperty(i) ? points[i] : [
      [parseInt(child.css('left')) + ',' + parseInt(child.css('top'))]
    ];
    var p = arr.length !== 0 ? pointData(arr[arr.length - 1][0]) : pointData(child.css('left') + ',' + child.css('top'));
    var dirX = child.attr('dirX') ? parseInt(child.attr('dirX')) : Math.floor(Math.random() * 2) > 0 ? -1 : 1;
    var dirY = child.attr('dirY') ? parseInt(child.attr('dirY')) : Math.floor(Math.random() * 2) > 0 ? -1 : 1;

    var margin = Math.floor(Math.random() * 20);
    var bound = {xMin: 0, xMax: 100, yMin: 0, yMax: 100};
    var x = p.x + (margin * dirX * wildCardX);
    var y = p.y + (margin * dirY * wildCardY);

    if (y < bound.xMin) {
      dirX = dirX * -1;
      x = bound.xMin + margin;
    }

    if (y > bound.xMax) {
      dirX = dirX * -1;
      x = bound.xMax - margin;
    }

    if (y < bound.yMin) {
      dirY = dirY * -1;
      y = bound.yMin + margin;
    }

    if (y > bound.yMax) {
      dirY = dirY * -1;
      y = bound.yMax - margin;
    }

    child.attr('dirX', dirX);
    child.attr('dirY', dirY);

    if (child.children('.item').length < parseInt(lettersCount)) {
      arr.push([x + ',' + y]);
      var suvChild = child.children('.item').eq(0).clone();
      child.append(suvChild);
    } else {
      arr.shift();
      arr.push([x + ',' + y]);
    }
    points[i] = arr;
    if (points[i].length >= lettersCount) {
      moveSingleLetter(child, points[i]);
    }

  }
  _this.attr('dataPoints', JSON.stringify(points));
}

function textAnimationOut() {
  var centerPoint = {x: $(this).width() / 2, y: $(this).height() / 2};
  var item = $(this).children('.item');
  var relX = centerPoint.x - (item.width() / 2);
  var relY = centerPoint.y - (item.height() / 2);

  if (item.attr('dataPoints')) {
    item.attr('dataPoints', JSON.stringify({0: '0,0'}));
  }

  if ($(this).attr('data-move') === 'trailing') {
    var that = $(this);
    that.children('.single-letter').children('.item').each(
        function (index) {
          var elem = that.children('.single-letter').children('.item').eq(index);
          var point = elem.attr('initial-poz').split(',');
          relX = point[0];
          relY = point[1];
          elem.css({top: relY, left: relX });

        });
  } else {
    if (item.parent().attr('initial-poz')) {
      var point = item.parent().attr('initial-poz').split(',');
      relX = point[0];
      relY = point[1];
    }
    item.css({top: relY, left: relX });
  }
}

function reorderPages() {
  var margin = 10;
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
    if (i === 0) {
      page.css({zIndex: zindex, opacity: 1, top: 270, transform: 'scale(.9)'});
    } else {
      var depth = 300 - (margin * i);
      var newWidth = 0.9 - (i / 10) + 0.05;
      var newIndex = zindex - i;
      var newOpacity = (1 / numOfPages) * (numOfPages - i);
      page.css({zIndex: newIndex, opacity: newOpacity, top: depth, transform: 'scaleX(' + newWidth + ')'});
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
        var box = {
          centerX: $(this).width() / 2,
          centerY: $(this).height() / 2
        };
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

  $('.multiple-wrapper').on('mouseover',function () {

    var itemsCount = parseInt($(this).attr('data-count')) ? parseInt($(this).attr('data-count')) : 0;
    var childes = $(this).children('.item');
    if ($(this).children('.item').length !== itemsCount) {
      while ($(this).children('.item').length < itemsCount) {
        var item = childes.eq(0).clone();
        $(this).append(item);
      }
    }
    return;
    $(this).on('mousemove', function (e) {
      switch ($(this).attr('data-move')) {
        case 'trailing':
          trailTheLeader(e, $(this));
          break;
        case 'random':
          followTheLeader(e, $(this));
          break;
        default:
          followTheLeader(e, $(this));
          break;

      }
    });
  }).on('mouseout', textAnimationOut);

  $('input[type="email"]').blur(function () {
    $(this).toggleClass('full', $(this).val() !== '');
  });

  initShadow({count: 4});
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


