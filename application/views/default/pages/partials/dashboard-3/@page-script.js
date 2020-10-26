jQuery(function($) {
  window.currentLayout = 2;//used in demo.js

  // some changes to settings box, appropriate for dashboard-3 and 4
  $('#id-auto-match').prop('checked', true)// automatch navbar and sidebar
  $('#auto-match-div').removeClass('d-none')
  $('#navbar-themes-show').removeClass('d-none')
  $('#navbar-themes-show-msg').addClass('d-none')
  $('input[value="not-navbar"]').parent().removeClass('d-none')



  //let's collapse the open submenu at first, for a better view of `.sidebar-light` look and feel
  $('.sidebar .nav .nav-item.open').removeClass('open').find('.submenu.show').removeClass('show');
  $('.sidebar').removeClass('has-open')

  // display the message only two times
  var displayed = parseInt(localStorage.getItem('welcome.classic.ace') || '0');
  if (displayed < 2) {
    localStorage.setItem('welcome.classic.ace', displayed + 1)

    if (window.matchMedia('(min-width: 1200px)').matches) {
      $.aceToaster.add({
        placement: 'tc',
        body: " <div class='position-tl w-100 border-t-3 brc-success-tp1'></div>\
            <div class='py-3 pl-2 pr-4 d-flex '>\
              <span class='d-inline-block text-center py-3 px-1'>\
                <i class='pos-abs fa fa-question fa-2x w-6 text-dark-m3 mt-2px'></i>\
                <i class='pos-rel fa fa-question fa-2x w-6 text-success-m3 mr-1'></i>\
              </span>\
              <div>\
                <p class='mb-1'>This is the old & classic Ace layout and dashboard.</p>\
                <p class='mb-0'>In this layout <span class='text-600'>navbar</span> is on top and <span class='text-600'>sidebar</span> starts from <span class='border-b-2 brc-grey-m2'>below</span> it.</p>\
              </div>\
              <button data-dismiss='toast' class='btn btn-sm btn-brc-tp btn-lighter-grey btn-h-lighter-danger btn-a-lighter-danger radius-round position-tr mt-1 mr-2px'>\
                <i class='fa fa-times px-1px'></i>\
              </button>\
            </div>",
          
        width: 500,
        delay: 15,
        //sticky: true,

        close: false,
        //belowNav: true,

        className: 'bgc-white-tp1 shadow overflow-hidden border-0 p-0 radius-t-0 radius-b-1',

        bodyClass: 'border-1 border-t-0 brc-grey-l1 text-dark-tp3 text-120 radius-1 p-2',
        headerClass: 'd-none'
      })
    }
  }

  //show tooltips only when not touchscreen
  if (!('ontouchstart' in window)) $('[data-toggle="tooltip"]').tooltip({container: 'body'})


  //change color of badges, etc (you should do this in your HTML not JS)
  $('.sidebar .fa-exclamation-triangle').removeClass('text-yellow-m3').addClass('text-danger-m2')
  $('.sidebar .badge.bgc-success-m1').removeClass('bgc-success-m1 text-dark-d2').addClass('badge-primary')


  //////////////////////////////////////////////////
  //Sortable task list
  Sortable.create(document.getElementById('tasks'), {
    draggable: ".task-item",
    animation: 200,

    ghostClass: "bgc-yellow-l1",  // Class name for the drop placeholder
    chosenClass: "",  // Class name for the chosen item
    dragClass: "",  // Class name for the dragging item
  });

  //toggle tasks checkbox on/off
  $('#tasks input[type=checkbox]').on('change', function() {
    $(this).closest('#tasks > div').toggleClass('bgc-secondary-l4', this.checked).find('label').toggleClass('line-through text-grey-d2', this.checked);
  });



  //update max height according to available space
  setTimeout(function() {
    var _scroller = document.querySelector('#conversations div[class*="ace-scroll"]')
    if (_scroller) _scroller.style.maxHeight = _scroller.parentNode.clientHeight + 'px'
  }, 10)
  


  //////////////////////////////////////////////////
  //draw charts
  var _animate = !AceApp.Util.isReducedMotion();//make sure no animation is displayed according to user preferences


  // Traffic Sources piechart
  var trafficSourceCanvas = document.getElementById('traffic-source-chart');

  var trafficSourcePieChart = new Chart(trafficSourceCanvas, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: 'Traffic Sources',
            data: [40.7, 27.5, 9.3, 19.6, 4.9],
            backgroundColor: [
              "#4ca5ae",
              "#f18e5d",
              "#ea789d",
              "#22c1e4",
              "#e2e3e4"
            ],
        }],
        labels: [
            'Social Networks',
            'Search Engines',
            'Ad Campaings',
            'Direct Traffic',
            'Other'
        ]
    },
    
    options: {
        responsive: true,

        cutoutPercentage: 70,
        legend: {
            display: false
        },
        animation: {
            animateRotate: true,
            duration: _animate ? 1000 : false
        },
        tooltips: {
            enabled: true,
            cornerRadius: 0,
            bodyFontColor: '#fff',
            bodyFontSize: 14,
            fontStyle: 'bold',
            
            backgroundColor: 'rgba(34, 34, 34, 0.73)',
            borderWidth: 0,
          
            caretSize: 5,

            xPadding: 12,
            yPadding: 12,
            
            callbacks: {
              label: function(tooltipItem, data) {
                return ' ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%';
              }
            }
        }
    }
  })
  //place the legends
  $(trafficSourceCanvas)
  .parent().after("<div id='traffic-source-legends' class='piechart-legends text-95 text-secondary-d3'>"+trafficSourcePieChart.generateLegend()+"</div>")



  ////////////////////////////
  //the sales stats chart
  var salesChart = document.getElementById("saleschart")
  if (salesChart.parentNode.offsetWidth < 600) {
    salesChart.height = 180
  }

  var salesChartCtx = salesChart.getContext("2d")

  /*** Gradient ***/
  var gradient1 = salesChartCtx.createLinearGradient(0, 0, 0, 400)
      gradient1.addColorStop(0, 'rgba(114,193,224, 0.2)')
      gradient1.addColorStop(1, 'rgba(114,193,224, 0)')

  var gradient2 = salesChartCtx.createLinearGradient(0, 0, 0, 300)
      gradient2.addColorStop(0, 'rgba(138,200,138, 0.45)')
      gradient2.addColorStop(1, 'rgba(138,200,138, 0)')

  var gradients = [gradient1, gradient2]

  var chartOptions1 = {
    lineTension: 0.3,
    borderWidth: 1.5,
    pointRadius: 0
  }

  new Chart(salesChartCtx, {
    type: 'line',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "In-store",
          data: [3200, 1500, 3500, 2500, 3200, 7000, 2300, 3500, 3500, 6000, 6200, 8100],
  
          borderColor: '#72c1e0',
          pointBorderColor: '#72c1e0',

          fill: true,
          backgroundColor : gradients[0],
          pointBackgroundColor: '#fff',

          borderWidth: chartOptions1.borderWidth,
          pointRadius: chartOptions1.pointRadius,
          lineTension: chartOptions1.lineTension,
        },
        {
          label: "Online",
          data : [2500, 4200, 3000, 4000, 5500, 4800, 4600, 5900, 5800, 8900, 8200, 9000],

          borderColor: '#8ac88a',
          pointBorderColor: '#8ac88a',

          fill: true,
          backgroundColor : gradients[1],
          pointBackgroundColor: '#fff',

          borderWidth: chartOptions1.borderWidth,
          pointRadius: chartOptions1.pointRadius,
          lineTension: chartOptions1.lineTension,
        }      
      ]
    },

    options: {
      responsive: true,
      animation: {
        duration: _animate ? 1000 : false
      },

      datasetStrokeWidth : 3,
      pointDotStrokeWidth : 4,

      tooltips: {
        enabled: true,
        cornerRadius: 0,
        
        titleFontColor: 'rgba(0, 0, 0, 0.8)',
        titleFontSize: 16,
        titleFontStyle: 'normal',

        bodyFontColor: 'rgba(0, 0, 0, 0.8)',
        bodyFontSize: 14,
        fontFamily: 'Open Sans',
        
        backgroundColor: 'rgba(255, 255, 255, 0.73)',
        borderWidth: 2,
        borderColor: 'rgba(254, 224, 116, 0.73)',
       
        caretSize: 5,

        xPadding: 12,
        yPadding: 12,
      },

      scales: {
        yAxes: [{
          ticks: {
            fontFamily: "Open Sans",
            fontColor: "#a0a4a9",
            fontStyle: "600",
            fontSize: "12",
            beginAtZero: false,
            maxTicksLimit: 6,
            padding: 16,
            callback: function(value, index, values) {
              var val = parseInt(value / 1000);
              return val > 0 ? val + 'k' : val;
            }
          },
          gridLines: {
              drawTicks: false,
              display: false
          }
        }],

        xAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            display: true,
            borderDash: [2, 3],
            tickMarkLength: 3
          },
          ticks: {                
            fontFamily: "Open Sans",
            fontColor: "#808489",
            fontSize: "13",
            fontStyle: "400",
            padding: 12
          }
        }]
      },

      legend: {
        display: true,
        position: 'top'
      }
    }
  })



  ///////////
  //the Page views chart in infoboxes
  $('canvas.info-chart').each(function() {

      var ctx = this.getContext('2d');
      var gradientbg = ctx.createLinearGradient(0, 0, 0, 50);
      gradientbg.addColorStop(0, 'rgba(109, 187, 109, 0.25)');   
      gradientbg.addColorStop(1, 'rgba(109, 187, 109, 0.05)');
  
      new Chart(ctx, {
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [                
              {
                type: 'line',
                data: $(this).data('values'),
                backgroundColor: gradientbg,
                hoverBackgroundColor: '#70bcd9',
                fill: true,

                borderColor: 'rgba(109, 187, 109, 0.6)',

                borderWidth: 2.5,
                pointRadius: 7,
                lineTension: 0.4,

                pointBackgroundColor: 'transparent',
                pointBorderColor: 'transparent'
              }               
            ]
        },

        options: {

          responsive: false,
          animation: {
            duration: _animate ? 1000 : false
          },
          
          legend: {
              display: false
          },
          layout: {
            padding: {
                left: 10,
                right: 10,
                top: 0,
                bottom: -10
            }
          },
          scales: {
              yAxes: [
                  {
                    stacked: true,
                    ticks: {
                      display: false,
                      beginAtZero: true,
                    },
                    gridLines: {
                      display: false,
                      drawBorder: false
                    }
                  }
              ],

              xAxes: [
                {
                  stacked: true,
                  gridLines: {
                    display: false,
                    drawBorder: false
                  },
                  ticks: {
                    display: false //this will remove only the label
                  }
                },
              ]
           },//scales

           tooltips: {
              // Disable the on-canvas tooltip, because canvas area is small and tooltips will be cut (clipped)
              enabled: false,

              //use bootstrap tooltip instead
              custom: function(tooltipModel) {
                var title = '';
                var canvas = this._chart.canvas;

                if (tooltipModel.body) {
                  title = tooltipModel.title[0] + ': ' + Number(tooltipModel.body[0].lines[0]).toLocaleString();
                }
                canvas.setAttribute('data-original-title', title);//will be used by bootstrap tooltip

                $(canvas)
                .tooltip({
                  placement: 'bottom',
                  template: '<div class="tooltip" role="tooltip"><div class="brc-info arrow"></div><div class="bgc-info tooltip-inner font-bolder text-110"></div></div>'
                })
                .tooltip('show')
                .on('hidden.bs.tooltip', function() {
                  canvas.setAttribute('data-original-title', '');//so that when mouse is back over canvas's blank area, no tooltip is shown
                });
       
              }
            }//tooltips
           
        }
    })
  })


  //infobox's circular progress bar
  $('canvas.info-pie, canvas.task-progress').each(function() {
    var color = $(this).css('color')

    new Chart(this.getContext('2d'), {
      type: 'doughnut',
      data: {
          datasets: [{
              data: [$(this).data('percent'), 100 - $(this).data('percent')],
              backgroundColor: [
                color,
                  "#e3e5ea"
              ],
              hoverBackgroundColor: [
                color,
                 "#e3e5ea"
              ],
              borderWidth: 0
          }]
      },
      
      options: {
          responsive: false,
          cutoutPercentage: 80,
          legend: {
              display: false
          },
          animation: {
              duration: _animate ? 500 : false,
              easing: 'easeInCubic'
          },
          tooltips: {
              enabled: false,
          }
      }
  })
 })


})