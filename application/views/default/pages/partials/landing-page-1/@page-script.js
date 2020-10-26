jQuery(function($) {

    // enable Animation on scroll plugin
    try {
        AOS.init({
            once: true,
            duration: 550
        })
    }
    catch(e) {
        // if AOS is not supported, remove the stylesheets so page elements become visible again
        $('link[href*="aos.css"],link[href*="aos.min.css"]').remove()
    }


    //////////////////////////////////////////////////////////////////
    /// now let's make navbar fixed after we scrolld down a little bit
    
    // instead of listening to window `scroll` event, we use `IntersectionObserver`
    // to observe 2 elements and determine when they become visible/invisible during scrolling

    // 1. when we scroll down, navbar becomes fixed
    // 2. when we scroll back up, it is still fixed until we reach document top
    // we observe 2 hidden elements (#scroll-down & #scroll-up) to determine when to do the above 1 & 2
    if (window.IntersectionObserver) {
        var observer = new window.IntersectionObserver(function(entries) {
            var entry = entries[0];
            if(entry.target.id == 'scroll-down') {
                // `#scroll-down`'s CSS position is `top: 60vh` and you can change it in CSS accordingly
                // so when `intersectionRatio < 1` and `boundingClientRect.y < 0` , it means we have scrolled down to `top: 60vh`
                // so let's make navbar fixed and compact
                var isOut = entry.intersectionRatio < 1 && entry.boundingClientRect.y < 0
                if (isOut) {
                    $('.navbar').addClass('navbar-fixed navbar-compact')
                }
                else {// otherwise we are scrolling up but still scrollTop > 0
                    $('.navbar').removeClass('navbar-compact')
                }
            }
            else if(entry.target.id == 'scroll-up') {
                // `#scroll-up`'s CSS position is `top: 0`
                // so when `intersectionRatio == 1` and `boundingClientRect.y >= 0` it means we have scrolled all the way up to `top: 0`
                var isVisible = entry.intersectionRatio == 1 && entry.boundingClientRect.y >= 0
                if (isVisible) {
                    $('.navbar').removeClass('navbar-fixed')
                }
            }
        },
        {
            threshold: [1.0],
            delay: 100
        })

        observer.observe(document.getElementById('scroll-down'))
        observer.observe(document.getElementById('scroll-up'))
    }

    // also let's change #scroll-down's `top` value to (page-intro + navbar) height
    $('#scroll-down').css('top', parseInt($('#page-intro-dark').height() + $('.navbar').height()) + 50 + "px");
    

    //////////////////////////
    // Change theme when user selects a new one from the select box
    $('.theme-select')
    .on('change', function() {
        if(this.value == 'light' || this.value == 'white') {
            $('#navbar-dark, #page-intro-dark').addClass('d-none')// hide dark navbar and intro

            $('#navbar-light, #page-intro-light').removeClass('d-none')// show light navbar and intro
        }
        else if(this.value != '') {//show dark navbar and intro
            $('#navbar-dark, #page-intro-dark').removeClass('navbar-darkblue navbar-teal navbar-purple')
                                               .addClass('navbar-' + this.value)

            $('#navbar-dark, #page-intro-dark').removeClass('d-none')

            $('#navbar-light, #page-intro-light').addClass('d-none')
        }

        if(this.value == 'white') {
            $('.feature-item').addClass('border-1 brc-dark-l3')// in white theme, add a border to feature items (speed, flexibility, etc)

            $('#page-intro-light').addClass('bgc-white border-0 border-b-1 brc-dark-l3 border-dotted')// add a dotted border below intro

            $('#navbar-light .nav').addClass('nav-compact')
        }
        else {
            // undo above
            $('.feature-item').removeClass('border-1 brc-dark-l3')
            $('#page-intro-light').removeClass('bgc-white border-0 border-b-1 brc-dark-l3 border-dotted')
            $('#navbar-light .nav').removeClass('nav-compact')
        }
    })




    /**
    // add random circles and squares to `.page-intro`
    var bgColors = [
        'primary',
        'primary',
        'primary',
        'green',
        'green',
        'orange'
    ];

    var randomShapes = $('#random-shapes-1');
    var shapeCount = parseInt(Math.random() * 20 + 10);
    for(var i = 0; i < shapeCount; i++) {
        var width = parseInt(10 + Math.random()*10);
        var top = parseInt(Math.random()  * 90);

        var pos = parseInt(Math.random() * 10);        
        var left = 0;
        if(pos < 2) {
            left = parseInt(33 + Math.random() * 33);
        }
        else if (pos < 5)  {
            left = parseInt(Math.random() * 33);
        }
        else {
            left = parseInt(70 + Math.random() * 30);
        }
        var opacity = parseInt(Math.random() * 20) + 20;
        randomShapes.append('<div class="pos-abs bgc-'+bgColors[parseInt(Math.random() * bgColors.length)]+' radius-round" style="opacity: '+(opacity/100)+';width:'+width+'px; height:'+width+'px; top:'+top+'%; left:'+left+'%;"></div>');
    }

    shapeCount = parseInt(Math.random() * 5 + 5);
    for(var i = 0; i < shapeCount; i++) {
        var width = parseInt(12 + Math.random()*12);
        var top = parseInt(Math.random()  *90);
        var pos = parseInt(Math.random() * 10);
        var left = 0;
        if(pos < 1) {
            left = parseInt(33 + Math.random() * 33);
        }
        else if (pos < 4)  {
            left = parseInt(Math.random() * 33);
        }
        else {
            left = parseInt(70 + Math.random() * 30);
        }
        var opacity = parseInt(Math.random() * 20) + 20;
        var rot = parseInt(Math.random() * 360);
        randomShapes.append('<div class="pos-abs bgc-'+bgColors[parseInt(Math.random() * bgColors.length)]+' radius-2px" style="opacity: '+(opacity/100)+';width:'+width+'px; height:'+width+'px; top:'+top+'%; left:'+left+'%; transform: rotate('+rot+'deg)"></div>');
    }

    shapeCount = parseInt(Math.random() * 5 + 5);
    for(var i = 0; i < shapeCount; i++) {
        var width = parseInt(10 + Math.random()*10);
        var top = parseInt(Math.random()  *90);
        var pos = parseInt(Math.random() * 10);
        var left = 0;
        if(pos < 1) {
            left = parseInt(33 + Math.random() * 33);
        }
        else if (pos < 4)  {
            left = parseInt(Math.random() * 33);
        }
        else {
            left = parseInt(70 + Math.random() * 30);
        }
        var opacity = parseInt(Math.random() * 20) + 20;
        var rot = parseInt(Math.random() * 360);
        randomShapes.append('<div class="pos-abs brc-'+bgColors[parseInt(Math.random() * bgColors.length)]+' shape-triangle radius-1" style="opacity: '+(opacity/100)+';border-width:0 '+width+'px '+parseInt(1.6 * width)+'px '+width+'px; top:'+top+'%; left:'+left+'%; transform: rotate('+rot+'deg)"></div>');
    }


    var randomShapes = $('#random-shapes-2');
    shapeCount = parseInt(Math.random() * 40 + 10);
    for(var i = 0; i < shapeCount; i++) {
        var width = parseInt(4 + Math.random()*15);
        var pos = parseInt(Math.random() * 10);
        
        var top = parseInt(Math.random()  * 100);
        var left = 0;
        if(pos < 2) {
            left = parseInt(33 + Math.random() * 33);
        }
        else if (pos < 5)  {
            left = parseInt(Math.random() * 33);
        }
        else {
            left = parseInt(70 + Math.random() * 30);
        }

        var opacity = parseInt(Math.random() * 30) + 10;

        randomShapes.append('<div class="pos-abs bgc-white radius-round" style="opacity: '+(opacity/100)+';width:'+width+'px; height:'+width+'px; top:'+top+'%; left:'+left+'%;"></div>');
    }
    */
 
})