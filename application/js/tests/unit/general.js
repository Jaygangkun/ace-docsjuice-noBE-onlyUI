$(function () {
  'use strict'

  QUnit.module('general functions')

  QUnit.module('aceGeneral', {
    afterEach: function () {
      $('#qunit-fixture').html('')
    }
  })


  QUnit.test('should collapse alert', function (assert) {
    assert.expect(2)
    var done = assert.async()

    var alert = $('<div class="alert alert-collapse"><button type="button" data-dismiss="alert">x</button></div>').appendTo('#qunit-fixture')
    setTimeout(function() {
      alert.parent().one('hidden.bs.collapse', function() {
        setTimeout(function() {
          assert.equal(alert.parent().get(0).parentNode , null)
          done()
        }, 0)
      })
    }, 100)

    alert.find('button').trigger('click');
    assert.ok(alert.parent().is('.collapsing'))
  })


  QUnit.test('should not hide/close dropdown when .dropdown-clickable is clicked ... should hide it when data-dismiss="dropdown" button is clicked', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var dropdown =
    $('<div class="dropdown">\
        <a href="#" class="dropdown-toggle" id="toggle" data-toggle="dropdown">Dropdown</a>\
        <div class="dropdown-menu">\
          <div class="dropdown-clickable">\
            <button type="button" data-dismiss="dropdown">close</button>\
          </div>\
        </div>\
       </div>')
      .appendTo('#qunit-fixture')

    var toggle = dropdown.find('[data-toggle=dropdown]')
    var menu = dropdown.find('.dropdown-menu')

    dropdown
    .on('shown.bs.dropdown', function() {
      assert.ok(menu.hasClass('show'))

      menu.find('.dropdown-clickable').trigger('click')
      setTimeout(function() {
        assert.ok(menu.hasClass('show'))
        menu.find('button').trigger('click')
      }, 100);      
    })
    .on('hidden.bs.dropdown', function() {
      assert.notOk(menu.hasClass('show'))
      done()
    })

    toggle.dropdown('show')
  })


  QUnit.test('should hide navbar when clicked on its backdrop in mobile view', function (assert) {
    viewport.set(320, 480)
    assert.expect(2)

    var done = assert.async()

    var navbar = $('<div class="navbar-menu collapse navbar-collapse navbar-backdrop" id="navbarMenu"></div>').appendTo('#qunit-fixture');
    var button = $('<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMenu"></button>').appendTo('#qunit-fixture');

    navbar.on('shown.bs.collapse', function() {
      assert.ok(navbar.hasClass('show'))
      navbar.trigger('click')
    })
    .on('hidden.bs.collapse', function() {
      assert.notOk(navbar.hasClass('show'))
      done()

      viewport.reset()
    })

    button.trigger('click')
  })


  QUnit.test('should hide one navbar when another is shown in mobile view', function (assert) {
    viewport.set(320, 480)
    assert.expect(3)

    var done = assert.async()

    var navbar1 = $('<div class="navbar-menu collapse navbar-collapse" id="navbarMenu1"></div>').appendTo('#qunit-fixture');
    var button1 = $('<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMenu1"></button>').appendTo('#qunit-fixture');

    var navbar2 = $('<div class="navbar-menu collapse navbar-collapse" id="navbarMenu2"></div>').appendTo('#qunit-fixture');
    var button2 = $('<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMenu2"></button>').appendTo('#qunit-fixture');

    navbar1.on('shown.bs.collapse', function() {
      assert.ok(navbar1.hasClass('show'))
      button2.trigger('click')
    })
    .on('hidden.bs.collapse', function() {
      assert.notOk(navbar1.hasClass('show'))     
    })

    navbar2.on('shown.bs.collapse', function() {
      assert.ok(navbar2.hasClass('show'))
      done()
      viewport.reset()
    })

    button1.trigger('click')
  })


  QUnit.test('should adjust navbar dropdown position so that it moves back inside visible window area', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var navbar =
    $('<div class="navbar">\
        <div class="dropdown dropdown-mega">\
          <a href="#" class="dropdown-toggle" id="toggle" data-toggle="dropdown">Toggle</a>\
          <div class="dropdown-menu" style="left: -50%;" data-display="static"></div>\
        </div>\
       </div>')
      .appendTo('#qunit-fixture')

      var dropdown = navbar.find('.dropdown')
      var toggle = dropdown.find('.dropdown-toggle')
      var menu = dropdown.find('.dropdown-menu')

      dropdown.on('shown.bs.dropdown', function() {
        setTimeout(function() {
          assert.ok( parseInt(menu.css('margin-left')) > menu.width() / 2)
          done()
        }, 0)
      })

      toggle.trigger('click')
  })


  QUnit.test('should scroll tab buttons', function (assert) {
    assert.expect(1)
    var done = assert.async()

    viewport.set(320, 480)

    var tabs = $('<ul class="nav nav-tabs nav-tabs-scroll">\
        <li><a href="#">1111111111111111</a></li>\
        <li><a href="#">222222222222222222222</a></li>\
        <li><a href="#">3333333333333333333333333</a></li>\
        <li><a href="#">44444444444444444444444444444</a></li>\
        <li><a href="#">555555555555555555555555555555555</a></li>\
    </ul>').appendTo('#qunit-fixture')

    tabs.aceTabScroll()

    tabs.find('a').eq(3).trigger('click')

    setTimeout(function() {
      assert.ok(tabs.get(0).scrollLeft > 0)
      done()
      viewport.reset()
    }, 500)
    
  })



  QUnit.test('should swipe tab', function (assert) {
    assert.expect(2)
    var done = assert.async()
    viewport.set(320, 480)
  
    var tabContent = $('<div class="tab-content tab-sliding"><div class="tab-pane active show"></div><div class="tab-pane"></div><div class="tab-pane"></div></div>').appendTo('#qunit-fixture');
    tabContent.aceTabSwipe();

    var tabPane = tabContent.find('.tab-pane.active')

    var e1 = $.Event('touchstart');
    e1.originalEvent = {changedTouches: [{'pageX': 150, 'pageY': 10}]}
    tabPane.trigger(e1);

    setTimeout(function() {
      var e2 = $.Event('touchmove');
      e2.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
      tabPane.trigger(e2);

      var e3 = $.Event('touchend');
      e3.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
      tabPane.trigger(e3);


      assert.notOk(tabPane.is('.show.active'), '')
      assert.ok(tabPane.next().is('.show.active'), '')
      
      viewport.reset()

      done()
    }, 0)
    
  })


  QUnit.test('should swipe tabs only in specified direction (right)', function (assert) {
    assert.expect(4)
    var done = assert.async()
    viewport.set(320, 480)
  
    var tabContent = $('<div class="tab-content tab-sliding" data-swipe="right">\
        <div class="tab-pane"></div>\
        <div class="tab-pane active show"></div>\
        <div class="tab-pane"></div>\
      </div>').appendTo('#qunit-fixture');
    tabContent.aceTabSwipe();

    var tabPane = tabContent.find('.tab-pane.active')

    var e1 = $.Event('touchstart');
    e1.originalEvent = {changedTouches: [{'pageX': 150, 'pageY': 10}]}
    tabPane.trigger(e1);

    setTimeout(function() {
      var e2 = $.Event('touchmove');
      e2.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
      tabPane.trigger(e2);

      var e3 = $.Event('touchend');
      e3.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
      tabPane.trigger(e3);


      assert.ok(tabPane.is('.show.active'), 'active pane has not changed')
      assert.notOk(tabPane.next().is('.show.active'), 'active page has not changed')


      var e11 = $.Event('touchstart');
      e11.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
      tabPane.trigger(e11);

      setTimeout(function() {
        var e22 = $.Event('touchmove');
        e22.originalEvent = {changedTouches: [{'pageX': 150, 'pageY': 10}]}
        tabPane.trigger(e22);

        var e33 = $.Event('touchend');
        e33.originalEvent = {changedTouches: [{'pageX': 150, 'pageY': 10}]}
        tabPane.trigger(e33);


        assert.notOk(tabPane.is('.show.active'), 'active pane has changed')
        assert.ok(tabPane.prev().is('.show.active'), 'active page has changed')
        
        viewport.reset()

        done()
      }, 0)        

    }, 0)
  })


  QUnit.test('should swipe next to specified target', function (assert) {
    assert.expect(3)
    var done = assert.async()
    viewport.set(320, 480)
  
    var tabContent = $('<div class="tab-content tab-sliding">\
        <div class="tab-pane active show" id="tab-1" data-swipe-next="#tab-3"></div>\
        <div class="tab-pane" id="tab-2"></div>\
        <div class="tab-pane" id="tab-3"></div>\
      </div>').appendTo('#qunit-fixture');
    
    tabContent.aceTabSwipe();

    var tabPane = tabContent.find('.tab-pane.active')

    var e1 = $.Event('touchstart');
    e1.originalEvent = {changedTouches: [{'pageX': 150, 'pageY': 10}]}
    tabPane.trigger(e1);

    setTimeout(function() {
      var e2 = $.Event('touchmove');
      e2.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
      tabPane.trigger(e2);

      var e3 = $.Event('touchend');
      e3.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
      tabPane.trigger(e3);

      assert.notOk($('#tab-1').is('.show.active'), '')
      assert.notOk($('#tab-2').is('.show.active'), '')
      assert.ok($('#tab-3').is('.show.active'), '')
      
      viewport.reset()

      done()
    }, 0)
  })


  QUnit.test('should swipe prev to specified target', function (assert) {
    assert.expect(3)
    var done = assert.async()
    viewport.set(320, 480)
  
    var tabContent = $('<div class="tab-content tab-sliding">\
        <div class="tab-pane" id="tab-1"></div>\
        <div class="tab-pane" id="tab-2"></div>\
        <div class="tab-pane active show" id="tab-3" data-swipe-prev="#tab-1"></div>\
      </div>').appendTo('#qunit-fixture');
    
    tabContent.aceTabSwipe();

    var tabPane = tabContent.find('.tab-pane.active')

    var e1 = $.Event('touchstart');
    e1.originalEvent = {changedTouches: [{'pageX': 10, 'pageY': 10}]}
    tabPane.trigger(e1);

    setTimeout(function() {
      var e2 = $.Event('touchmove');
      e2.originalEvent = {changedTouches: [{'pageX': 150, 'pageY': 10}]}
      tabPane.trigger(e2);

      var e3 = $.Event('touchend');
      e3.originalEvent = {changedTouches: [{'pageX': 150, 'pageY': 10}]}
      tabPane.trigger(e3);


      assert.notOk($('#tab-3').is('.show.active'), '')
      assert.notOk($('#tab-2').is('.show.active'), '')
      assert.ok($('#tab-1').is('.show.active'), '')
      
      viewport.reset()

      done()
    }, 0)
  })


  QUnit.test('should trigger sticky event', function (assert) {
    assert.expect(1)
    var done = assert.async()
  
    $('<div style="height: 100px; width: 100%;"></div>').appendTo('#qunit-fixture')
	  var nav = $('<ul class="sticky-nav"><li>11</li></ul>').appendTo('#qunit-fixture')
  	$('<div style="height: 3000px; width: 100%;"></div>').appendTo('#qunit-fixture')


    setTimeout(function() { 
      nav.get(0).addEventListener('sticky-change', function(e) {
        assert.ok(e.detail.isSticky, 'sticky-change triggered')     
        done() 
      })

      $('html,body').scrollTop(3300)
    }, 100);
  
    nav.aceStickyNav()  
  })


  QUnit.test('should not trigger sticky event on above `md` size', function (assert) {
    assert.expect(1)
    var done = assert.async()

    $('<div style="height: 100px; width: 100%;"></div>').appendTo('#qunit-fixture')
	  var nav = $('<ul class="sticky-nav-md"><li>11</li></ul>').appendTo('#qunit-fixture')
  	$('<div style="height: 3000px; width: 100%;"></div>').appendTo('#qunit-fixture')


    setTimeout(function() { 
      nav.get(0).addEventListener('sticky-change', function(e) {
        assert.notOk(e.detail.isSticky, 'sticky-change triggered')
        done()
      })

      $('html,body').scrollTop(3300)
    }, 100);

    nav.aceStickyNav()  
  })

  QUnit.test('should trigger sticky event on below `md` size', function (assert) {
    assert.expect(1)
    var done = assert.async()

    viewport.set(480, 640)

    $('<div style="height: 100px; width: 100%;"></div>').appendTo('#qunit-fixture')
	  var nav = $('<ul class="sticky-nav-md"><li>11</li></ul>').appendTo('#qunit-fixture')
  	$('<div style="height: 3000px; width: 100%;"></div>').appendTo('#qunit-fixture')

    setTimeout(function() { 
      nav.get(0).addEventListener('sticky-change', function(e) {
        assert.ok(e.detail.isSticky, 'sticky-change triggered')
        viewport.reset()
        done()
      })

      $('html,body').scrollTop(3300)
    }, 100);

    nav.aceStickyNav()  
  })


})
