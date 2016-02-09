/* global $ */
'use strict';

var isMobile = (function () {
  return typeof (window.orientation) !== 'undefined';
})();

var pageLoaded = false;
var minimalLoadTimeCounter = 0;
var footer = document.getElementsByTagName('footer')[0];
var pagesStack = document.getElementsByClassName('pages-stack')[0];
var allPages = [].slice.call(pagesStack.getElementsByClassName('page'));
var topNavLinks = [].slice.call(document.getElementsByClassName('pages-nav')[0].getElementsByClassName('link'));
var body = document.getElementsByTagName('body')[0];
var menuTrigger = document.getElementById('menu-trigger');

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

function toggleFooter() {
  if (footer.className.indexOf('show') !== -1) {
    footer.className = footer.className.replace('show', '');
  } else {
    footer.className += 'show';
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
        if (window.scrollY > $('#schedule-inner-nav').offset().top - 120) {
          autoScroll($('#schedule-inner-nav').offset().top - 120);
        }
      });
    });
    $(window).on('scroll', function () {

      if ($('#menu-trigger').offset().top + 100 > $('.itinerary ul').offset().top) {
        if (!$('.schedule-nav').hasClass('show')) {
          $('.schedule-nav').toggleClass('show');
          $('.itinerary ul').css({ opacity: 0 });

        }
      }

      if ($('#menu-trigger').offset().top + 100 <= $('.itinerary ul').offset().top) {
        if ($('.schedule-nav').hasClass('show')) {
          $('.itinerary ul').css({ opacity: 1 });
          $('.schedule-nav').toggleClass('show');
        }
      }
    });

  } else {
    $(window).unbind('scroll');
  }
}

function reorderPages() {
  var numOfPages = allPages.length;
  var currentCue;
  allPages.forEach(function (page, index) {
    if (page.className.indexOf('current') !== -1) {
      currentCue = index;
    }
  });
  var pagesNewOrder = [];

  while (pagesNewOrder.length < numOfPages) {
    pagesNewOrder.push(allPages[currentCue]);
    currentCue++;
    if (currentCue >= numOfPages) {
      currentCue = 0;
    }
  }
  for (var i = 0; i < pagesNewOrder.length; i++) {
    var page = pagesNewOrder[i];
    page.removeAttribute('data-pos');
    if (i !== 0) {
      page.setAttribute('data-pos', i);
    }
  }
}

function onMenuTriggerChange() {
  alert(menuTrigger.checked);
  if (menuTrigger.checked) {
    reorderPages();
    toggleFooter();
  } else {

    setTimeout(toggleFooter, 400);
  }
}

function disableLink(hash) {
  topNavLinks.forEach(function (link) {
    link.className = link.className.replace('not-active', '');
    link.className = link.className.replace('disable', '');
    if (link.attributes.href.nodeValue.slice(1) === hash) {
      link.className += isMobile ? ' not-active disable' : ' not-active';
    }
  });
}

function switchCurrentPage(pageId) {
  allPages.forEach(function (page) {
    page.className = page.className.replace('current', '');
  });
  document.getElementById(pageId).className += ' current';
}

function hashchange() {
  var hash = location.hash ? location.hash.slice(1) : 'page-home';
  var currentPage = document.getElementById(hash);
  if (currentPage.className.indexOf('current') === -1) {
    currentPage.className += ' current';

    if (isMobile) {
      menuTrigger.checked = false;
    }
    disableLink(hash);
    return;
  }

  if (hash === 'page-program') {
    fixScheduleHeader(true);
  } else {
    fixScheduleHeader(false);
  }

  if (isMobile) {
    menuTrigger.checked = false;
  }
  switchCurrentPage(hash);
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

  if (isMobile) {
    return;
  }

  $('.shadow').each(function () {
    $(this).parent().on('mousemove', function (evt) {
      var pointer = { x: evt.offsetX, y: evt.offsetY };
      var range = 400;
      var shadow = $(this).children('.shadow');
      var Xunit = shadow.width() / range;
      var originX = pointer.x / Xunit - (range / 3);
      var Yunit = shadow.height() / range;
      var originY = pointer.y / Yunit - (range / 3);
      if (originX >= 280) {
        originX = 280;
      }
      shadow.css({ 'perspective-origin': originX + '% ' + originY + '%' });
    });
  });
}

function windowResize() {
  if (!isMobile) {
    $('.pages-stack').css({'margin-bottom': $('footer').height()});
  }
  var scheduleNavWidth = $('.itinerary ul').width(),
      scheduleNavLeft = (window.innerWidth - scheduleNavWidth) / 2;

  $('.schedule-nav').css({ width: scheduleNavWidth, left: scheduleNavLeft });
}

function logoInit() {

  var el = document.querySelector('.logo');
  var rect = el.getBoundingClientRect();
  var scrollTop = document.scrollingElement.scrollTop;
  var scrollLeft = document.scrollingElement.scrollLeft;

  var position = {
    t: rect.top - scrollTop,
    l: rect.left - scrollLeft,
    b: rect.bottom - scrollTop,
    r: rect.right - scrollLeft,
    cx: (rect.width / 2) + rect.left + scrollLeft,
    cy: (rect.height / 2) + rect.top + scrollTop,
    w: rect.width,
    h: rect.height
  };

  var uls = el.querySelectorAll('.letters-tail ul');

  var origins = [].map.call(uls, function (ul) {
    return getComputedStyle(ul)['perspective-origin'].split(' ').map(function (c) {
      return parseInt(c);
    });
  });

  var originX = position.cx;
  var originY = position.cy;

  window.addEventListener('resize', function () {
    rect = el.getBoundingClientRect();
    scrollTop = document.scrollingElement.scrollTop;
    scrollLeft = document.scrollingElement.scrollLeft;

    position = {
      t: rect.top - scrollTop,
      l: rect.left - scrollLeft,
      b: rect.bottom - scrollTop,
      r: rect.right - scrollLeft,
      cx: (rect.width / 2) + rect.left + scrollLeft,
      cy: (rect.height / 2) + rect.top + scrollTop,
      w: rect.width,
      h: rect.height
    };

    origins = [].map.call(uls, function (ul) {
      return getComputedStyle(ul)['perspective-origin'].split(' ').map(function (c) {
        return parseInt(c);
      });
    });
  });

  window.addEventListener('mousemove', function (e) {

    window.requestAnimationFrame(function () {
      originX = (e.pageX - originX);
      originY = (e.pageY - originY);

      origins.forEach(function (c, ind) {
        c[0] += originX;
        c[1] += originY;

        uls[ind].style['perspective-origin'] = c.map(function (p) {
          return p + 'px';
        }).join(' ');
      });

      originX = e.pageX;
      originY = e.pageY;

    });

  }, true);

  var ev = document.createEvent('MouseEvent');
  ev.initEvent('mousemove');
  window.dispatchEvent(ev);
}

function navLink(e) {
  alert(menuTrigger.checked);
  e.preventDefault();
  var hash = this.hash;
  switchCurrentPage(hash.slice(1));
  reorderPages();
  if (hash === '#page-program') {
    fixScheduleHeader(true);
    windowResize();
  } else {
    fixScheduleHeader(false);
  }
  menuTrigger.checked = false;

  setTimeout(function () {
    onMenuTriggerChange();
    window.location.hash = hash;
  }, 400);
}

window.onload = function () {
  if (isMobile) {
    pagesStack.style.zIndex = '100';
    toggleFooter();
    footer.style.zIndex = '0';
    body.className += ' mobile';
  }

  body.className += ' ready';
  var emailInput = document.getElementById('email');
  emailInput.onblur = function () {
    if (emailInput.className.indexOf('full') === -1 && emailInput.value !== '') {
      emailInput.className += ' full';
    } else if (emailInput.value === '') {
      emailInput.className = emailInput.className.replace('full', '');
    }
  }

  initShadow({ count: 4 });

  hashchange();
  window.addEventListener('hashchange', hashchange, true);
  pageLoaded = true;
  logoInit();

  topNavLinks.forEach(function (elem) {
    elem.addEventListener('click', navLink, true);
    elem.addEventListener('touchend', navLink, true);
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

  menuTrigger.addEventListener('click', onMenuTriggerChange, true);
  menuTrigger.addEventListener('touchend', onMenuTriggerChange, true);
  setTimeout(function () {
    if (isMobile) {
      toggleFooter();
    }
    document.getElementsByClassName('loading')[0].className = document.getElementsByClassName('loading')[0].className.replace('loading', '');
  }, 400);
  window.onresize = windowResize();
  windowResize();
};
