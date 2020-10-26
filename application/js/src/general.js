/**
 * --------------------------------------------------------------------------
 * Ace (v3.0.1): general.js
   General Ace Function
*/

import $ from 'jquery'
// import bootstrap from 'bootstrap'
import Util from './util'

class Basic {
  static _HandleBasics () {
    Basic._handleAlerts()
    Basic._handleDropdowns()
    Basic._handleNavbar()

    Basic._handleTabScrollAndSwipe()

    Basic._handleScrollTop()

    Basic._handleSticky()
    Basic._handleOther()

    $(document.body).addClass('is-document-loaded')
  }

  static _handleAlerts () {
    // collapse alert instead of fading it out
    $(document).on('close.bs.alert.alert-collapse', '.alert.alert-collapse', function (e) {
      e.preventDefault()
      $(this).wrap('<div class="collapse show alert-collapse"></div>').parent().collapse('hide').one('hidden.bs.collapse.alert-collapse', function () {
        $(this).remove()
      })
    })
  }

  static _handleDropdowns () {
    var _dismissDropdown = function () {
      var menu = $(this).closest('.dropdown-menu')
      var dropdown = menu.parent()
      var toggle = dropdown.find('[data-toggle=dropdown]')

      toggle.dropdown('hide')
      menu.removeClass('show')
      dropdown.removeClass('show')
    }

    // hide dropdown when clicked on an element inside it with "data-dismiss=dropdown" attr
    $(document)
      .on('click', '[data-dismiss=dropdown]', function (e) {
        e.preventDefault()
        _dismissDropdown.call(e.target)
      })

    // hide dropdown when a form inside it is submitted
    $(document)
      .on('submit', '.dropdown-menu form[data-submit=dismiss]', function (e) {
        e.preventDefault()
        _dismissDropdown.call(e.target)
      })

    // don't hide dropdown when clicked inside a .dropdown-clickable element
    $(document).on('click.dropdown-clickable', '.dropdown-clickable', function (e) {
      e.stopImmediatePropagation()
    })

    // hide body scrollbars when dropdowns are opened in mobile view
    $(document)
      .on('shown.bs.dropdown', '.dropdown.dd-backdrop', function (e) {
      // check `display` of .dropdown::before
        if (window.getComputedStyle(this, ':before').display === 'none') return

        // the device width is such that backdrop is visible (.dropdown-inner is visible)
        var scrollbarInfo = Util.getScrollbarInfo()
        if (scrollbarInfo.width === 0) {
          document.body.classList.add('mob-dropdown-body')
        }
        this.classList.add('backdrop-shown')// used later to add `.navbar-modal` class to .navbar

        $(this).one('hidden.bs.dropdown', function (e) {
          document.body.classList.remove('mob-dropdown-body')
          this.classList.remove('backdrop-shown')
        })
      })
  }

  static _handleNavbar () {
    // hide navbar-collapse when clicked on it (i.e. on the backdrop in mobile view)
    $(document)
      .on('click', '.navbar-backdrop.collapse.show', function (e) {
        if (e.target === this) $(this).collapse('hide')
      })

    // hide dropdown when a form inside it is submitted
    $(document)
      .on('submit', '.navbar-collapse.show form[data-submit=dismiss]', function (e) {
        e.preventDefault()
        $(this).closest('.navbar-collapse').collapse('hide')
      })

    $(document)
      .on('shown.bs.dropdown', '.navbar .dropdown', function () {
        $(this).find('.autofocus').focus()
      })
      .on('shown.bs.collapse', '.navbar-collapse', function () {
      // move focus to '.autofocus' element if it exists (for example a search box)
        $(this).find('.autofocus').focus()

        if (this.classList.contains('navbar-backdrop')) {
          var scrollbarInfo = Util.getScrollbarInfo()
          if (scrollbarInfo.width === 0) {
            document.body.classList.add('mob-navbar-body')
          }
        }
      })
      .on('hidden.bs.collapse', function () {
        document.body.classList.remove('mob-navbar-body')
      })
      .on('show.bs.collapse', function () {
        // hide other 'shown/open' ones
        $('.navbar-collapse.show').css('transition-duration', '1ms').collapse('hide').css('transition-duration', '')
      })

    // if navbar dropdowns are not entirely inside window area, move them accordingly
    var _adjustDropdown = function () {
      var isRTL = Util.isRTL()
      var isRightAligned = this.classList.contains('dropdown-menu-right')

      var _dir = !isRightAligned ? (!isRTL ? 'left' : 'right') : (!isRTL ? 'right' : 'left')
      var prop = 'margin-' + _dir

      this.style.removeProperty(prop)

      var moveBy = 0
      var rect = this.getBoundingClientRect()
      if (rect.left < 0) {
        moveBy = parseInt(-1 * rect.left) + 5
      } else {
        var sw = document.body.scrollWidth
        if (rect.right > sw) {
          moveBy = parseInt(sw - rect.right - 5)
        }
      }

      if (moveBy < 5) return

      if (isRightAligned) moveBy *= -1
      this.style.setProperty(prop, moveBy + 'px', 'important')
    }

    var _closest = 'closest' in document.documentElement
    $(document)
      .on('transitionstart.adjust', '.navbar .dropdown-mega .dropdown-menu', function (ev) {
        if (ev.target !== this || ev.originalEvent.propertyName !== 'transform') return
        _adjustDropdown.call(this)
      })
      .on('shown.bs.dropdown', '.navbar .dropdown', function () {
        if (this.classList.contains('dropdown-mega')) {
          var dropdown = this.querySelector('.dropdown-menu[data-display="static"]')
          if (dropdown !== null) _adjustDropdown.call(dropdown)
        }

        // when a .dropdown is opened, add .navbar-open to increase z-index, so that dropdowns go above 'asides', etc
        if (_closest) {
          var navbar = this.closest('.navbar')
          if (this.classList.contains('backdrop-shown')) navbar.classList.add('navbar-modal')
          else navbar.classList.add('navbar-open')
        }
      })
      .on('hidden.bs.dropdown', '.navbar .dropdown', function () {
        if (_closest) {
          var navbar = this.closest('.navbar')
          navbar.classList.remove('navbar-open')
          navbar.classList.remove('navbar-modal')
        }
      })
  }

  static _handleTabScrollAndSwipe () {
    var _firefox = 'MozAppearance' in document.documentElement.style
    // scroll tab button elements into view when clicked
    var _scrollIntoView = function (smooth = true) {
      var li = this.parentNode
      var nav = li.parentNode

      var navClientWidth = nav.clientWidth; var navScrollWidth = nav.scrollWidth
      if (navScrollWidth <= navClientWidth) return // don't scroll if not needed

      var isRTL = Util.isRTL()

      // scroll to this element (center it)
      var _scrollLeft
      if (!isRTL) {
        _scrollLeft = li.offsetLeft - (navClientWidth - li.clientWidth) / 2
        // if (_scrollLeft < 0) _scrollLeft = 0
      } else {
        // firefox and webkit have different way of dealing with scrolling right/left and offsets in RTL mode
        if (!_firefox) {
          _scrollLeft = (navScrollWidth - navClientWidth) + (li.offsetLeft) - ((navClientWidth - li.clientWidth) / 2)
          // if (_scrollLeft > navScrollWidth) _scrollLeft = navScrollWidth
        } else {
          _scrollLeft = li.offsetLeft - ((navClientWidth - li.clientWidth) / 2)
          // var diff = navClientWidth - navScrollWidth
          // if (_scrollLeft < diff) _scrollLeft = diff
        }
      }
      _scrollLeft = _scrollLeft | 0 // convert FLOAT to INT

      smooth = !Util.isReducedMotion() && smooth === true
      try {
        nav.scrollTo({
          top: 0,
          left: _scrollLeft,
          behavior: smooth ? 'smooth' : 'auto'
        })

        // firefox needs double push when scrolling back
        if (_firefox && _scrollLeft < nav.scrollLeft) {
          setTimeout(function () {
            nav.scrollTo({
              top: 0,
              left: _scrollLeft,
              behavior: smooth ? 'smooth' : 'auto'
            })
          }, 0)
        }
      } catch (e) {
        nav.scrollLeft = _scrollLeft
      }
    }

    var aceTabScroll = function () {
      // scroll to active element on page load
      var This = this.get(0)
      var active = This.querySelector('.active')
      if (active) {
        if (!_firefox) {
          _scrollIntoView.call(active, false)
        } else { // still firefox doesn't scroll back to `zero` on page load!
          setTimeout(() => {
            This.scrollLeft = 1
            _scrollIntoView.call(active, false)
          }, 500)
        }
      }

      this.on('click', 'a', function () {
        _scrollIntoView.call(this)
      })
    }

    $.fn.aceTabScroll = aceTabScroll
    $('.nav-tabs-scroll').each(function () {
      $(this).aceTabScroll()
    })

    /// /
    // tab pane swiping
    var aceTabSwipe = function () {
      var allowedDir = $(this).attr('data-swipe') || null
      this.on('touchstart', '.tab-pane', function (ev) {
        if (!this.classList.contains('active')) return
        var curPane = this
        var isRTL = Util.isRTL()
        var initialTransform = !isRTL ? 'translateX(100%)' : 'translateX(-100%)'

        var touches = ev.originalEvent.changedTouches[0]

        var swipeDir = 0
        var x1 = touches.pageX
        var y1 = touches.pageY
        var t1 = Date.now()

        var lastX = 0

        var curDir = 0

        var paneWidth = curPane.clientWidth
        var siblingPane = null

        function _dismiss () {
          $(curPane).off('touchmove touchend touchcancel')
          curPane.style.transform = ''
          curPane.classList.remove('tab-swiping')

          if (siblingPane) {
            siblingPane.style.transform = ''
            siblingPane.classList.remove('tab-swiping')
          }
        }

        function _reset (sibling) {
          sibling.style.transform = ''
          sibling.style.transitionDuration = '0ms' // so when we quickly and frequently swipe left/right without a `touchend`, the other pane moves away (disappears) instatly
          sibling.classList.remove('tab-swiping')
          sibling.offsetHeight
          sibling.style.transitionDuration = ''
          /**
          function _transitionEnd () {
            this.style.transitionDuration = ''
            this.removeEventListener('transitionend', _transitionEnd)
          }
          sibling.addEventListener('transitionend', _transitionEnd)
           */
        }

        $(this).on('touchmove', function (ev) {
          var touches = ev.changedTouches[0]
          var newX = touches.pageX
          var newY = touches.pageY
          lastX = newX

          if (swipeDir === 0) {
            var diffY = Math.abs(y1 - newY)
            var diffX = Math.abs(x1 - newX)

            if (diffY > diffX) {
              swipeDir = 2// vertical i.e. scroll
              $(curPane).off('touchmove')
            } else if (diffX > 10) {
              swipeDir = 1// horizontal swipe
            }
          }
          if (swipeDir !== 1) return // return if not horizontal swipe

          var moveX = parseInt(x1 - newX)
          var newDir = 0

          if ((allowedDir === null || (allowedDir === 'left')) && ((!isRTL && moveX > 0) || (isRTL && moveX < 0))) newDir = 1
          else if ((allowedDir === null || (allowedDir === 'right')) && ((!isRTL && moveX < 0) || (isRTL && moveX > 0))) newDir = -1

          if (newDir !== 0 && newDir !== curDir) {
            if (siblingPane !== null) _reset(siblingPane)// undo previous direction for when we change swipe direction before a touchend
            curDir = newDir

            var targetPane = curPane.getAttribute('data-swipe-' + (curDir === 1 ? 'next' : 'prev'))
            if (targetPane) targetPane = document.querySelector(targetPane)
            siblingPane = targetPane || (curDir === 1 ? curPane.nextElementSibling : curPane.previousElementSibling)

            if (siblingPane === null || siblingPane === curPane) {
              curDir = 0
            } else {
              curPane.classList.add('tab-swiping')
              siblingPane.classList.add('tab-swiping')
            }
          }

          var moveXabs = Math.abs(moveX)
          if (curDir !== 0 && moveXabs < paneWidth + 24) { // don't move more than 24px beyond its size
            curPane.style.transform = initialTransform + ' translateX(' + (-1 * moveX) + 'px)'
            siblingPane.style.transform = 'translateX(' + (-1 * moveX) + 'px)'
          } else if (curDir === 0 && moveXabs < 24) {
            curPane.style.transform = initialTransform + ' translateX(' + (-1 * moveX) + 'px)'
          }
        })// touchmove
          .on('touchend touchcancel', function (ev) {
            var touches = ev.originalEvent.changedTouches[0] || null

            var x2 = touches !== null ? touches.pageX : lastX
            var t2 = Date.now()

            var diff = Math.abs(x2 - x1)

            _dismiss()

            if (curDir !== 0 && swipeDir === 1 &&
                              ((diff > paneWidth / 4 || diff > 100) || (diff > paneWidth / 6 && t2 - t1 < 300))
            ) { // if moved more than 1/4 of its width or 100px or 1/6 in less than 300ms
              siblingPane.classList.add('active', 'show')
              curPane.classList.remove('active', 'show')

              var id1 = curPane.id; var id2 = siblingPane.id
              $('[href="#' + id1 + '"],[data-target="#' + id1 + '"]').removeClass('active')

              var newActive = $('[href="#' + id2 + '"],[data-target="#' + id2 + '"]')
              newActive.addClass('active')

              if (newActive.length > 0) {
                _scrollIntoView.call(newActive.get(0))
              }
            }
          })// touchend
      })// tab-pane touchstart
    }

    $.fn.aceTabSwipe = aceTabSwipe
    if ('ontouchstart' in window) {
      $('.tab-sliding:not([data-swipe="none"])').each(function () {
        $(this).aceTabSwipe()
      })
    }
  }

  static _handleScrollTop () {
    // scroll to top button
    var _scrollBtn = document.querySelector('.btn-scroll-up')
    // return if button is not visible
    if (_scrollBtn === null || _scrollBtn.offsetParent === null) return

    var showScrollbtn = function () {
      _scrollBtn.classList.add('scroll-btn-visible')
    }

    var hideScrollBtn = function () {
      _scrollBtn.classList.remove('scroll-btn-visible')
    }

    var scrollToTop = function () {
      try {
        // ScrollToOptions parameter may not be supported on some older browsers
        var smoothScroll = !Util.isReducedMotion()
        window.scroll({
          top: 0,
          behavior: smoothScroll ? 'smooth' : 'auto'
        })
      } catch (e) {
        window.scroll(0, 0)
      }
    }

    var _modernBrowser = 'IntersectionObserver' in window
    _scrollBtn.addEventListener('click', function (e) {
      e.preventDefault()

      if (_modernBrowser) hideScrollBtn()
      scrollToTop()
    })

    if (!_modernBrowser) {
      // if browser doesn't support `IntersectionObserver`, always show the scroll to top button
      showScrollbtn()
    } else {
      var _scrollBtnObserve = document.createElement('DIV')
      _scrollBtnObserve.classList.add('scroll-btn-observe')
      document.body.appendChild(_scrollBtnObserve)

      const observer = new window.IntersectionObserver(([entry]) => {
        var isObserverOut = entry.intersectionRatio < 1 && entry.boundingClientRect.bottom < 0
        if (isObserverOut) {
          showScrollbtn()
        } else {
          hideScrollBtn()
        }
      },
      {
        threshold: [1.0],
        delay: 100
      }
      )

      observer.observe(_scrollBtnObserve)
    }
  }

  /// /
  // we use it when a sticky element becomes stuck on top and 1 pixel of it goes out of view (because of top: -1px)
  // so IntersectionObserver is triggered with intersectionRatio < 1 and y < 0
  // then we trigger an event for it, so later we may for example change its classList to update styling
  static _handleSticky () {
    if (!window.IntersectionObserver) return

    const observer = new window.IntersectionObserver(([entry]) => {
      var isSticky = entry.intersectionRatio < 1 && entry.boundingClientRect.bottom < 0

      // isSticky=true means we are at sticky position
      // so if our sticky element is for example 'sticky-nav-md' and we are at sticky position
      // but our window size is above 'md' and therefore CSS rule 'position: sticky' is not applied at all
      // so we check if we are really sticky or not
      var stickyNav = entry.target.parentElement// entry.target is the `.sticky-trigger` and parentElement is the `.sticky-nav` element

      // check if `position` is actually `sticky` ... for example if we have `.sticky-nav-md`, it will be sticky only on small (md) devices
      if (isSticky && !stickyNav.classList.contains('sticky-nav')) { // don't check `.sticky-nav` element because it's sticky regardless of window size
        var pos = window.getComputedStyle(stickyNav).position
        if (!(pos === 'sticky' || pos === '-webkit-sticky')) isSticky = false
      }

      const evt = new window.CustomEvent('sticky-change', { detail: { isSticky } })
      stickyNav.dispatchEvent(evt)
    },
    {
      threshold: [1.0],
      delay: 100
    }
    )

    var aceStickyNav = function () {
      var stickyEl = this.get(0)

      // add a dummy child to watch
      // when it goes out of window it means sticky-nav is sticky now
      // because dummy element is `top: -1px` or when below navbar it's `top : -1 * ($navbar-height + 1px)`;
      var observedChild = document.createElement(stickyEl.tagName === 'UL' ? 'LI' : 'DIV')
      observedChild.classList.add('sticky-trigger')
      stickyEl.insertBefore(observedChild, stickyEl.firstChild)

      observer.observe(observedChild)

      setTimeout(function () {
        if (observedChild.getBoundingClientRect().bottom < 0) {
          var isSticky = true
          if (isSticky && !stickyEl.classList.contains('sticky-nav')) {
            var pos = window.getComputedStyle(stickyEl).position
            if (!(pos === 'sticky' || pos === '-webkit-sticky')) isSticky = false
          }
          const evt = new window.CustomEvent('sticky-change', { detail: { isSticky: isSticky, initialCheck: true } })
          stickyEl.dispatchEvent(evt)
        }
      }, 200)
    }

    $.fn.aceStickyNav = aceStickyNav
    $('[class*="sticky-nav"]').each(function () {
      $(this).aceStickyNav()
    })
  }

  /// ////////

  static _handleOther () {
    $('.input-floating-label input').each(function () {
      if (this.value !== '') this.classList.add('has-content')
      else this.classList.remove('has-content')
    })
    $(document).on('focusout', '.input-floating-label input', function (e) {
      if (this.value !== '') this.classList.add('has-content')
      else this.classList.remove('has-content')
    })
  }
}

/**
 * ------------------------------------------------------------------------
 * jQuery
 * ------------------------------------------------------------------------
*/

if (typeof $ !== 'undefined') {
  Basic._HandleBasics()
}

export default Basic
