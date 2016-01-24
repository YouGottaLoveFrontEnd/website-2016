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

function getActivePageIndex() {
  var currentPageIndex;
  $('.page').each(function (index) {
    if (!$(this).hasClass('page--inactive')) {
      currentPageIndex = index;
    }
  });
  return currentPageIndex;
}

function newCSSPosValues(index) {
  var cssValuesObj = {
    zIndex: 9,
    opacity: 1,
    transform: 200
  };
  if (index < 0) {
    cssValuesObj.zIndex = 0;
    cssValuesObj.opacity = 0;
    cssValuesObj.transform = 400;
  } else {
    index--;
    cssValuesObj.zIndex = cssValuesObj.zIndex - index;
    cssValuesObj.opacity = cssValuesObj.opacity - (index * 0.1);
    cssValuesObj.transform = cssValuesObj.transform + (index * 50);
  }
  cssValuesObj.transform = cssValuesObj.transform < 400 ? cssValuesObj.transform : 400;
  cssValuesObj.transform = 'translate3d(0px, 75%, -' + cssValuesObj.transform + 'px)';
  return cssValuesObj;
}

function changeActivePage(page, dir, numOfPages) {
  var pageIndexToChange = page;
  var i = 0;
  var poz = 0;
  var pageLength = $('.pages-stack').children('.page').length - 1;
  dir = dir < 0 ? -1 : 1;

  $('.page').eq(pageIndexToChange).css(newCSSPosValues(-1));

  while (i < numOfPages) {
    poz++;
    pageIndexToChange = pageIndexToChange + (1 * dir);
    pageIndexToChange = pageIndexToChange > pageLength ? 0 : pageIndexToChange;
    pageIndexToChange = pageIndexToChange < 0 ? pageLength : pageIndexToChange;
    $('.page').eq(pageIndexToChange).css(newCSSPosValues(poz));
    i++;
  }

  var newCurrentPageIndex = page + dir;
  newCurrentPageIndex = newCurrentPageIndex > pageLength ? 0 : newCurrentPageIndex;
  newCurrentPageIndex = newCurrentPageIndex < 0 ? pageLength : newCurrentPageIndex;
  $('.page').eq(newCurrentPageIndex).removeClass('page--inactive');
  $('.page').eq(page).addClass('page--inactive');

}

var lastTouchMove = 0;
function pageGalleryTouch(e) {
  var touchPointY = e.originalEvent.touches[0].clientY;
  if (lastTouchMove === 0) {
    lastTouchMove = touchPointY;
  } else {
    $('.pages-stack').unbind('touchmove', pageGalleryTouch);
    var currentPageIndex = getActivePageIndex();
    var deltaY = lastTouchMove > touchPointY ? 1 : -1;
    changeActivePage(currentPageIndex, deltaY, 5);
    lastTouchMove = 0;
    setTimeout(function () {
      $('.pages-stack').on('touchmove', pageGalleryTouch);
    }, 1000);
  }
}
var moduleInterval = 20;
function pageGalleryChange(e) {
  var deltaY = e.originalEvent.wheelDeltaY > 0 ? 1 : -1;
  if (e.originalEvent.wheelDeltaY % moduleInterval === deltaY) {
    var currentPageIndex = getActivePageIndex();
    changeActivePage(currentPageIndex, deltaY, 5);
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

function onPageClick(e) {
  window.location.hash = '#' + $(this).attr('id');
}

function onMenuTriggerChange() {
  var margin = 50;
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
  if ($('#menu-trigger:checked').length) {

    for (var i = 0; i < pagesNewOrder.length; i++) {
      var page = pagesNewOrder[i];
      if (i === 0) {
        page.css({zIndex: zindex, opacity: 1, transform: 'translate3d(0px, 75%, -200px)'});
      } else {
        var depth = 200 + (margin * i);
        var newIndex = zindex - i;
        var newOpacity = (1 / numOfPages) * (numOfPages - i);
        page.css({zIndex: newIndex, opacity: newOpacity, transform: 'translate3d(0px, 75%, -' + depth + 'px)'});
      }
      page.on('click tap touch', onPageClick);
    }

  } else {
    $('.pages-stack').children('.page').each(function () {
      $(this).removeAttr('style');
      $(this).unbind('click tap touch', onPageClick);
    });
  }
}

function onPageChange(pageId) {

  $('.page.current').removeClass('current');
  $('#' + pageId).addClass('current');
  if ($('#menu-trigger:checked').length) {
    $('#menu-trigger').attr('checked', false);
  }
  onMenuTriggerChange();
}

function disableLink(hash) {
  $('.link.not-active').removeClass('not-active');

  $('.pages-nav').children('.link').each(function () {
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
  $('.page.current').removeClass('current');
  $('#' + hash).addClass('current');
  if ($('#menu-trigger:checked').length) {
    $('#menu-trigger').attr('checked', false);
    onMenuTriggerChange();
  }
  disableLink(hash);
}

function initShadow(config) {
  //you should always shift 5 * i + current value so that is will move according to the limitation of its margin
  var shadowCount = config.count + 1;
  $('.shadow').each(function () {
    var child = $(this).children().eq(0);
    var margin = 1;
    for (var i = 1; i < shadowCount; i++) {
      var xpoz = margin * i;
      var ypoz = xpoz + child.height();
      var opacity = 1 - ((1 / shadowCount) * i);
      var shadowDemi;
      switch ($(this).attr('type')) {
        case 'box':
          shadowDemi = '<div class="item box" cue="' + i + '" style="width: 158px; height: 60px; transform: translate(-' + xpoz + 'px, -' + ypoz + 'px); position: absolute; z-index: -1; opacity: ' + opacity + ';"></div>';
          break;
        case 'stroke':
          shadowDemi = '<div class="item stroke" cue="' + i + '" style="width: 158px; height: 60px; transform: translate(-' + xpoz + 'px, -' + ypoz + 'px); position: absolute; z-index: -1; opacity: ' + opacity + '; font-size: ' + child.css('font-size') + '">' + child.text() + '</div>';
          break;
      }
      $(this).append(shadowDemi);
    }
  });

  $(window).on('mousemove', function (e) {
    var mouseX = e.clientX;
    var mouseY = e.clientY;

    $('.shadow').each(function () {
      $(this).children('.item').each(function (index) {
        var direction = 0,
            point = {},
            parent = $(this).parent(),
            box = {x: parent.offset().left, xmax: parent.offset().left + parent.width(), width: parent.width(), y: parent.offset().top, ymax: parent.offset().top + parent.height(), height: parent.height()},
            matrix = $(this).css('transform').replace('matrix(', '').replace(')', '').split(','),
            distanceX = parseInt(matrix[matrix.length - 2]),
            distanceY = parseInt(matrix[matrix.length - 1]),
            margin = 5 * (index + 1);
        if (mouseX >= box.x && mouseX <= box.xmax) {
          point.x = ((mouseX - box.x) / box.xmax) * 10;
          direction = point.x > .5 ? 1 : -1;
          distanceX = (point.x * margin);
          if (direction < 0) {
            distanceX += margin * direction;
          }
        }
        if (mouseY >= box.y && mouseY <= box.ymax) {
          point.y = (mouseY - box.y) / box.height;
          direction = point.y > .5 ? 1 : -1;
          distanceY = (point.y * margin) - box.height;
          if (direction < 0) {
            distanceY += margin * direction;
          }
        }
        $(this).css('transform', 'translate(' + distanceX + 'px, ' + distanceY + 'px)');
      });
    });
  });
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
//  buildStack();
//  initEvents();
  hashchange();
  $(window).on('hashchange', hashchange);
  $('.pages-nav').children('.link').each(function () {
    $(this).on('click tap touch', function (e) {
      e.preventDefault;
      window.location.hash = $(this).attr('href');
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
});

//$('.menu-button').on('click tap touch', function () {
//  if ($('.pages-nav').hasClass('pages-nav--open')) {
//    $(window).on('mousewheel', pageGalleryChange);
//    $('.pages-stack').on('touchmove', pageGalleryTouch);
//  } else {
//    $(window).unbind('mousewheel', pageGalleryChange);
//    $('.pages-stack').unbind('touchmove', pageGalleryTouch);
//  }
//});
$(window).load(function () {
  pageLoaded = true;

});


