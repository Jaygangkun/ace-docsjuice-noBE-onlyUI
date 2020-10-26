jQuery(function($) {

  // the button inside navbar that hides sidebar
  $('#hide-sidebar')
  .on('click', function() {
    // if sidebar is expanded, then first change it to `hideable` mode and then collapse it
    if ($('#sidebar1').is('.expandable:not(.collapsed)')) {
      $('#sidebar1')
      .removeClass('expandable')
      .addClass('hideable')
      .aceSidebar('collapse')
  
      this.classList.add('collapsed')
    }
    else if ($('#sidebar1').is('.expandable.collapsed')) {
      // if it's collapsed, just change it from `expandable` to `hideable` mode
      $('#sidebar1')
      .removeClass('expandable')
      .addClass('hideable')

      this.classList.add('collapsed')
    }
    else if ($('#sidebar1').is('.hideable.collapsed')) {
      // if it's hidden, just change it from `hideable` to `expandable` mode and expand it back
      $('#sidebar1')
      .removeClass('hideable')
      .addClass('expandable')
      .aceSidebar('expand')
  
      this.classList.remove('collapsed')
    }
  })


  ////////////////////////////////////
  // The `move sidebar to right` button
  $('#id-btn-sidebar-right')
  .on('click', function() {
    $('#sidebar1').toggleClass('sidebar-right')
    $('#sidebar1 .nav').toggleClass('has-active-arrow')
  })


  ////////////////////////////////////
  // change texts to make them shorter for horizontal menu
  var sidebarNames = ['Home', 'Layouts', 'Elements', 'Tables', 'Forms', 'Cards', 'Calendar', 'Gallery', 'More']
  $('#sidebar2 .nav > .nav-item > .nav-link > .nav-text > span:first-child')
  .each(function(index) {
    $(this).text(sidebarNames[index])
  })
  // remove badges as well
  $('#sidebar2 .badge').remove()

})