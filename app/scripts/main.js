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

  function autoScroll(to, direction) {
    if ((direction < 0 && window.scrollY > to) || (direction > 0 && window.scrollY < to)) {
      $(window).scrollTop(window.scrollY + (direction * 10));
      setTimeout(function () {
        autoScroll(to, direction);
      }, 10);
    } else if (direction < 0 && window.scrollY < to) {
      $(window).scrollTop(to);
    } else if (direction > 0 && window.scrollY > to) {
      $(window).scrollTop(to);
    }
  }

  function showScheduleFixedHeader(show) {
    if (show) {
      $('.schedule-nav').addClass('show');
      $('.itinerary ul').css({opacity: 0});
    } else {
      $('.itinerary ul').css({opacity: 1});
      $('.schedule-nav').removeClass('show');
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
          if (window.scrollY > $('#schedule-inner-nav').offset().top - 120 && window.innerWidth > 768) {
            autoScroll($('#schedule-inner-nav').offset().top - 120, -1);
          } else if (window.innerWidth <= 768) {
            window.scrollTo(0, $('#schedule-inner-nav').offset().top - 120);
          }
        });
      });
      $(window).on('scroll', function () {
        //console.log('got scrolled', !$('.schedule-nav').hasClass('show') && !menuTrigger.checked);
        if (window.innerWidth > 768) {
          if ($('.page').offset().top > $('#page-program').height() - 100 && $('.schedule-nav').hasClass('show')) {
            $('.schedule-nav').addClass('fade');
          } else {
            if ($('.schedule-nav').hasClass('fade')) {
              $('.schedule-nav').removeClass('fade');
            }
          }

          if ($('#menu-trigger').offset().top + 100 > $('.itinerary ul').offset().top) {
            if (!$('.schedule-nav').hasClass('show') && !menuTrigger.checked) {
              showScheduleFixedHeader(true);

            }
          }

          if ($('#menu-trigger').offset().top + 100 <= $('.itinerary ul').offset().top) {
            if ($('.schedule-nav').hasClass('show')) {
              showScheduleFixedHeader(false);
            }
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

      if ($('#radio-nav-program')[0].checked && $('.schedule-nav').hasClass('show')) {
        $('.schedule-nav').removeClass('show');
      }

      if ($('#radio-nav-program')[0].checked && window.innerWidth <= 768) {
        $('.schedule-nav').hide();
      }
      reorderPages();
      footer.classList.add('clear');
    } else {
      footer.classList.remove('clear');
      if ($('#menu-trigger').offset().top + 100 <= $('.itinerary ul').offset().top) {
        if (!$('.schedule-nav').hasClass('show') && !menuTrigger.checked) {
          showScheduleFixedHeader(false);
        }

        if ($('#radio-nav-program')[0].checked && window.innerWidth <= 768) {
          $('.schedule-nav').show();
        }
      }
    }
    setPagesStackPaddingBottom();
  }

  function notActiveAction(e) {
    e.preventDefault();
    menuTrigger.checked = false;
    onMenuTriggerChange();

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
    showScheduleFixedHeader(false);
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
      if (window.innerWidth <= 768) {
        $('.schedule-nav').show();
      }
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

  // function modifyScheduleNavWidth() {
  //   var scheduleNavWidth = $('.itinerary ul').width(),
  //     scheduleNavLeft = (window.innerWidth - scheduleNavWidth) / 2;
  // }

  function windowResize() {
    setPagesStackPaddingBottom();
    // modifyScheduleNavWidth();
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
    if ($('#radio-nav-program')[0].checked && window.innerWidth <= 768) {
      $('.schedule-nav').show();
    }
    if (isMobile) {
      body.classList.add('mobile');
      footer.classList.add('mobile');
      footer.classList.remove('hide');
    }

    body.classList.add('ready');
    var emailInput = document.getElementById('email');
    emailInput.onblur = function () {
      if (!emailInput.classList.contains('full') && emailInput.value !== '') {
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
      windowResize();
      initLogo();
    }, 400);
    window.addEventListener('resize', windowResize, true);
  };

})();

