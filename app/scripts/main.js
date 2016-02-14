/* global $ */
'use strict';

(function () {

  var isMobile = (function () {
    return typeof (window.orientation) !== 'undefined';
  })();

  var pageLoaded = false;
  var minimalLoadTimeCounter = 0;
  var footer = document.getElementsByClassName('footer-wrapper')[0];
  var pagesStack = document.getElementsByClassName('pages-stack')[0];
  var allPages = [].slice.call(pagesStack.getElementsByClassName('page'));
  var allPagesRadioBtn = [].slice.call(document.getElementsByClassName('page-radio-nav'));
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

  function reorderPages(callback) {
    var numOfPages = allPagesRadioBtn.length;
    var currentCue;
    allPagesRadioBtn.forEach(function (radio, index) {
      if (radio.checked) {
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

    if (typeof callback === 'function') {
      callback();
    }
  }

  function setPagesStackPaddingBottom() {
    pagesStack.style.paddingBottom = isMobile ? '0px' : footer.clientHeight + 'px';

  }



  function resetPages(hash) {
    menuTrigger.checked = false;
    reorderPages(function () {
      onMenuTriggerChange();
      window.location.hash = hash;
      window.scrollTo(0, 0);
      for (var i = 0; i < allPages.length; i++) {
        allPages[i].removeAttribute('data-pos');
      }
    });
    if (isMobile) {
      footer.style.top = $('.pages-stack').height() + 'px';
    }
  }

  function onMenuTriggerChange() {
    if (menuTrigger.checked) {
      reorderPages();
    } else {
      //      resetPages(window.location.hash.slice(1));
    }
    setPagesStackPaddingBottom();
  }

  function notActiveAction(e) {
    e.preventDefault();
    menuTrigger.checked = false;
  }

  function disableLink(hash) {
    document.querySelector('.not-active').removeEventListener('click', notActiveAction);

    topNavLinks.forEach(function (link) {
      link.classList.remove('not-active');
      link.classList.remove('disabled');
      if (link.attributes.href.nodeValue.slice(1) === hash) {
        link.className += isMobile ? ' not-active disable' : ' not-active';
      }
    });

    document.querySelector('.not-active').addEventListener('click', notActiveAction);
  }

  function hashchange() {
    var hash = location.hash ? location.hash.slice(1) : null;
    if (hash === null) {
      window.location.hash = '#page-home';
      return;
    }
    var currentPageID = hash.replace('page', 'radio-nav');
    var currentPage = document.getElementById(currentPageID);
    if (currentPage === null) {
      window.location.hash = '#page-home';
      return;
    }

    currentPage.checked = true;
    if (hash === 'page-program') {
      fixScheduleHeader(true);
    } else {
      fixScheduleHeader(false);
    }
    disableLink(hash);
    resetPages(hash);
  }

  // function initShadow(config) {

  //   var shadowCount = config.count + 1;
  //   $('.shadow').each(function () {
  //     var firstChildValue = $(this).children().eq(0).text();
  //     for (var i = 0; i < shadowCount; i++) {
  //       var shadowDemi = '<div class="item stroke-' + i + '">' + firstChildValue + '</div>';
  //       $(this).append(shadowDemi);
  //     }
  //   });

  //   if (isMobile) {
  //     return;
  //   }

  //   $('.shadow').each(function () {
  //     $(this).on('mousemove', function (evt) {
  //       var shadow = $(this);//.children('.shadow');
  //       var pointer = { x: evt.offsetX, y: evt.offsetY };
  //       var Xunit = shadow.width() / 100;
  //       var originX = pointer.x / Xunit - 80;
  //       var originY = pointer.y;
  //       // if (originX >= 160) {
  //       //   originX = 160;
  //       // }
  //       // if (originX - 30 <= 0) {
  //       //   originX = 0;
  //       // }
  //       shadow.css({ 'perspective-origin': originX + '% ' + originY + '%' });
  //     });
  //   });
  // }

  function modifyScheduleNavWidth() {
    var scheduleNavWidth = $('.itinerary ul').width(),
      scheduleNavLeft = (window.innerWidth - scheduleNavWidth) / 2;

    $('.schedule-nav').css({ width: scheduleNavWidth, left: scheduleNavLeft });
  }

  function windowResize() {
    setPagesStackPaddingBottom();
    modifyScheduleNavWidth();
  }

  function initLogo() {

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

    var logoResizeHandler = function () {
      rect = el.getBoundingClientRect();

      position = {
        t: rect.top,
        l: rect.left,
        b: rect.bottom,
        r: rect.right,
        cx: (rect.width / 2) + rect.left,
        cy: (rect.height / 2) + rect.top,
        w: rect.width,
        h: rect.height
      };

      origins = [].map.call(uls, function (ul) {
        return getComputedStyle(ul)['perspective-origin'].split(' ').map(function (c) {
          return parseInt(c);
        });
      });
    };

    var logoTailMoveHandler = function (e) {
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
    };

    window.addEventListener('resize', logoResizeHandler);

    if (!isMobile) {
      document.querySelector('#page-home .canvas').addEventListener('mousemove', logoTailMoveHandler, true);
    }
  }

  function initWeather() {
    var r = new XMLHttpRequest();
    var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?id=293397&appid=17e28f9119f49c8bf85eaacba44455c1&units=metric';

    var tempSuccess = function (data) {
      var city = data.name;
      var celTemp = Math.round(data.main.temp);
      var ferTemp = Math.round(celTemp * 9 / 5 + 32);
      var country = data.sys.country;
      document.querySelector('span.city').innerHTML = city;
      document.querySelector('span.celTemp').innerHTML = celTemp;
      document.querySelector('span.ferTemp').innerHTML = ferTemp;
      document.querySelector('span.country').innerHTML = country;
    };

    r.open('GET', weatherURL, true);
    r.onreadystatechange = function () {
      if (r.readyState !== 4 || r.status !== 200) {
        return;
      }
      tempSuccess(JSON.parse(r.responseText));
    };
    r.send(null);
  }

  window.onload = function () {
    if (isMobile) {
      body.classList.add('mobile');
      footer.classList.add('mobile');
      footer.classList.remove('hide');
    }

    body.classList.add('ready');
    var emailInput = document.getElementById('email');
    emailInput.onblur = function () {
      if (emailInput.classList.contains('full') && emailInput.value !== '') {
        emailInput.classList.add('full');
      } else if (emailInput.value === '') {
        emailInput.classList.remove('full');
      }
    };

    initWeather();
    // initShadow({ count: 4 });

    hashchange();
    window.addEventListener('hashchange', hashchange, true);

    menuTrigger.addEventListener('click', onMenuTriggerChange, true);
    window.setTimeout(function () {
      footer.classList.remove('hide');
      body.classList.remove('loading');
      for (var i = 0; i < allPages.length; i++) {
        allPages[i].classList.remove('loading');
      }
      document.querySelector('.cfs-badge').classList.remove('out');
      windowResize();
      initLogo();
    }, 400);
    window.addEventListener('resize', windowResize, true);
  };

})();

