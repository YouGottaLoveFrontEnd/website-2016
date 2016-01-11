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
//      $(this).addClass('page--active');
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
//  if (pageGalleryChangeBool) {
//    return;
//  }
//  pageGalleryChangeBool = true;
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
//  setTimeout(function () {
//    $('.pages-stack').on('mousewheel', pageGalleryChange).on('touchmove', pageGalleryTouch);
//    pageGalleryChangeBool = false;
//  }, 1000);

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

$(document).ready(function () {
  $('body')
      .addClass('ready')
      .toggleClass('mobile', isMobile);

  $('.multiple-wrapper').on('mouseover',function () {
    var offset = $(this).offset();
    var centerPoint = {x: $(this).width() / 2, y: $(this).height() / 2};
    var itemsCount = parseInt($(this).attr('data-count'));
    if ($(this).children().length !== itemsCount) {
      while ($(this).children().length < itemsCount) {
        var item = $(this).children(0).clone();
        $(this).append(item);
      }
    }

    $(this).on('mousemove', function (e) {
      var relX = e.pageX - offset.left;
      var relY = e.pageY - offset.top;
      var index = 1;
      var opStyle = 1;
      var opLayer = 1 / $(this).children().length;
      $(this).children().each(function () {
        var item = $(this);
        var itemIndexOffset = index;
        index += opLayer;

        var distance = {
          x: centerPoint.x - (( centerPoint.x - relX) / itemIndexOffset) - (item.width() / 2),
          y: centerPoint.y - (( centerPoint.y - relY) / itemIndexOffset) - (item.height() / 2)
        };
        item.css({top: distance.y, left: distance.x, opacity: opStyle});
        opStyle -= opLayer;
      });

    });
  }).on('mouseout', function () {
    var centerPoint = {x: $(this).width() / 2, y: $(this).height() / 2};
    var item = $('.item');
    var relX = centerPoint.x - (item.width() / 2);
    var relY = centerPoint.y - (item.height() / 2);
    item.css({top: relY, left: relX });
  });
});

$('.menu-button').on('click tap touch', function () {
    if ($('.pages-nav').hasClass('pages-nav--open')) {
      $(window).on('mousewheel', pageGalleryChange);
      $('.pages-stack').on('touchmove', pageGalleryTouch);
    } else {
      $(window).unbind('mousewheel', pageGalleryChange);
      $('.pages-stack').unbind('touchmove', pageGalleryTouch);
    }
  });

$(window).load(function () {
  $('iframe[data-src]').each(function (index, element) {
    var $element = $(element);
    $element.attr('src', $element.attr('data-src'));
  });

  pageLoaded = true;
});