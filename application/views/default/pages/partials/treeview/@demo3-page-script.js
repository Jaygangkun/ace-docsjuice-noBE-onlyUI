jQuery(function($) {
    var pageData = {
        "pages": [
            {
                "pageIndex": "1",
                "pageLocation": "https://s3.amazon.com/bucketname/image",
                "docType": "INVOICE",
                "boxes": [
                    {
                        "boxId": "123",
                        "boxIndex": "1",
                        "class" : "10",
                        "boxLoc": "[10,20,40,50]"
                    },
                    {
                        "boxId": "234",
                        "boxIndex": "2",
                        "class" : "12",
                        "boxLoc": "[100,120,170,180]"
                    },
                    {
                        "boxId": "345",
                        "boxIndex": "3",
                        "class" : "13",
                        "boxLoc": "[110,320,180,350]"
                    },
                    {
                        "boxId": "456",
                        "boxIndex": "4",
                        "class" : "10",
                        "boxLoc": "[410,420,540,450]"
                    }
                ]
            },
            {
                "pageIndex": "2",
                "pageLocation": "https://s3.amazon.com/bucketname/image",
                "docType": "BILL_OF_LADING",
                "boxes": [
                    {
                        "boxId": "123",
                        "boxIndex": "1",
                        "class" : "10",
                        "boxLoc": "[40,50,120,90]"
                    },
                    {
                        "boxId": "234",
                        "boxIndex": "2",
                        "class" : "12",
                        "boxLoc": "[140,150,270,180]"
                    },
                    {
                        "boxId": "345",
                        "boxIndex": "3",
                        "class" : "13",
                        "boxLoc": "[210,320,280,350]"
                    },
                    {
                        "boxId": "456",
                        "boxIndex": "4",
                        "class" : "10",
                        "boxLoc": "[630,600,700,650]"
                    }
                ]
            } ,
            {
                "pageIndex": "3",
                "pageLocation": "https://s3.amazon.com/bucketname/image",
                "docType": "BILL_OF_LADING",
                "boxes": [
                    {
                        "boxId": "123",
                        "boxIndex": "1",
                        "class" : "10",
                        "boxLoc": "[40,50,120,90]"
                    },
                    {
                        "boxId": "234",
                        "boxIndex": "2",
                        "class" : "12",
                        "boxLoc": "[140,150,270,180]"
                    },
                    {
                        "boxId": "456",
                        "boxIndex": "4",
                        "class" : "10",
                        "boxLoc": "[630,600,700,650]"
                    }
                ]
            } 
        ]
    };

    var fileData = [
        {
            id: 1,
            name: 'abc.pdf',
            icons: {
                'default': ['<i class="fas fa-file-pdf"></i>', 'text-danger-m1']
            },
            children: [
                {
                    id: 3,
                    name: 'p1' ,
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey'],
                    }
                },
                { 
                    id: 4,
                    name: 'p2' ,
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey'],
                    }
                },
                { 
                    id: 5,
                    name: 'p3' ,
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey'],
                    }
                },
                { 
                    id: 6,
                    name: 'p4',
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey']
                    },
                }
            ]
        },
        {
            id: 7,
            name: 'document.doc',
            icons: {
                'default': ['<i class="fa fa-file-word"></i>', 'text-blue2-m2']
            },
            children: [
                {
                    id: 8,
                    name: 'p1',
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey']
                    },
                }
            ]
        },
        {
            id: 9,
            name: 'pqr.xlsx',
            icons: {
                'default': ['<i class="fa fa-file-excel"></i>', 'text-blue2-m2']
            },
            children: [
                {
                    id: 10,
                    name: 'p1',
                    icons: {
                        'default': ['<i class="far fa-file"></i>', 'text-grey']
                    },
                }
            ]
        }
    ];

    if(localStorage.getItem('uploaded_files') != null){
        fileData = JSON.parse(localStorage.getItem('uploaded_files'));
    }
    console.log('fileData', fileData);

    //Select Categories Tree
    var categoryData = [];

    var boxes = new Array();
    var trs = new Array();
    // add canvas element
    var layer = new Konva.Layer();
    var width = window.innerWidth;
    var height = window.innerHeight;
    width = $('#imageviewer').outerWidth();
    height = $('#imageviewer').outerHeight();

    var stage = new Konva.Stage({
        container: 'imageviewer',
        width: width,
        height: height,
    });
    // stage.add(layer);


    function drawFileContent(file_layer, file_index, page_index){
        var pages = fileData[file_index].children;
        if(page_index < pages.length){
            var page_thumb_index = page_index + 1;
            if(page_thumb_index > 4){
                page_thumb_index = 1;
            }
            var imageObj = new Image();
            imageObj.src = './assets/image/page' + page_thumb_index + '.jpeg';
            imageObj.onload = function () {
                // getting x, y
                var img_width = 120;
                var img_height = 120;
                var padding_w = 20;
                var padding_h = 20;
                var stage_width = stage.width();
                var stage_height = stage.height();

                var x = page_index * img_width + padding_w * page_index;
                var y = 0;

                var h_count = stage_width / (img_width + padding_h);
                var thumb_img = new Konva.Image({
                    x: x,
                    y: y,
                    image: imageObj,
                    width: img_width,
                    height: img_height,
                    file_index: file_index,
                    page_index: page_index
                });
    
                // add the shape to the layer
                file_layer.add(thumb_img);
                file_layer.batchDraw();

                // thumb_img.on('click', function(evt){
                //     console.log('click', evt.target);
                //     var page_index = evt.target.attrs.page_index;
                //     var file_index = evt.target.attrs.file_index;
                //     var file_id = fileData[file_index].id;
                //     var page_id = fileData[file_index].children[page_index].id;
                //     showPageContent(page_id);
                // })

                thumb_img.on('mouseover', function() {
                    document.body.style.cursor = 'pointer';
                });
                thumb_img.on('mouseout', function() {
                    document.body.style.cursor = 'default';
                });

                // thumb_img.on('dblclick', function(evt){
                thumb_img.on('click', function(evt){
                    var page_index = evt.target.attrs.page_index;
                    var file_index = evt.target.attrs.file_index;
                    var file_id = fileData[file_index].id;
                    var page_id = fileData[file_index].children[page_index].id;
                    showPageContent(page_id);
                })

                drawFileContent(file_layer, file_index, page_index + 1);
            };
        }
        
    }

    function drawPageContent(page_layer, page_index){
        console.log('drawPageContent', page_layer, page_index);
        var page_thumb_index = page_index + 1;
        if(page_thumb_index > 4){
            page_thumb_index = 1;
        }
        var imageObj = new Image();
        imageObj.src = './assets/image/page' + page_thumb_index + '.jpeg';
        imageObj.onload = function () {
            // getting x, y
            var img_width = 60;
            var img_height = 60;
            var padding_w = 20;
            var padding_h = 20;
            var stage_width = stage.width();
            var stage_height = stage.height();

            var x = page_index * img_width + padding_w * page_index;
            var y = 0;
            x = 0;

            var h_count = stage_width / (img_width + padding_h);
            var bk_img = new Konva.Image({
                x: x,
                y: y,
                image: imageObj,
                width: stage_width,
                height: stage_height,
                page_index: page_index
            });

            // add the shape to the layer
            page_layer.add(bk_img);

            var page_box_index = page_index % 3;

            var pageBoxes = pageData.pages[page_box_index].boxes;
            for(i = 0; i < pageBoxes.length; i++){
                var boxLoc = JSON.parse(pageBoxes[i]['boxLoc']);

                var box = new Konva.Rect({
                    x: boxLoc[0],
                    y: boxLoc[1],
                    width: boxLoc[2],
                    height: boxLoc[3],
                    //fill: '#000000',
                    //opacity: 0.2,
                    stroke: 'red',
                    strokeWidth: 2,
                    draggable: true,
                    name: 'rect'
                });
                boxes.push(box);
                page_layer.add(box);
            }
            // for (i=0; i < 4; i++) {
            //     var box = new Konva.Rect({
            //         x: 50 + 150*i,
            //         y: 50 + 150*i,
            //         width: 100,
            //         height: 50,
            //         //fill: '#000000',
            //         //opacity: 0.2,
            //         stroke: 'black',
            //         strokeWidth: 1,
            //         draggable: true,
            //         name: 'rect'
            //     });
            //     boxes.push(box);
            //     page_layer.add(box);
    
            //     // add cursor styling
            //     // box.on('mouseover', function() {
            //     //     document.body.style.cursor = 'pointer';
            //     // });
            //     // box.on('mouseout', function() {
            //     //     document.body.style.cursor = 'default';
            //     // });
            // }

            var tr = new Konva.Transformer();
            page_layer.add(tr);
            // tr.nodes(boxes);
            // tr.nodes([rect1, rect2]);

            // page_layer.batchDraw();
            page_layer.draw();

            var selectionRectangle = new Konva.Rect({
                fill: 'rgba(0,0,255,0.5)',
            });
            page_layer.add(selectionRectangle);
        
            var x1, y1, x2, y2;
            stage.on('mousedown touchstart', (e) => {
                if(!isEdit){
                    return;
                }
                // do nothing if we mousedown on eny shape
                console.log(e.target);
                if (e.target !== bk_img) {
                    return;
                }
                x1 = stage.getPointerPosition().x;
                y1 = stage.getPointerPosition().y;
                x2 = stage.getPointerPosition().x;
                y2 = stage.getPointerPosition().y;
        
                selectionRectangle.visible(true);
                selectionRectangle.width(0);
                selectionRectangle.height(0);
                page_layer.draw();
            });
    
            stage.on('mousemove touchmove', () => {
                if(!isEdit){
                    return;
                }
                // no nothing if we didn't start selection
                if (!selectionRectangle.visible()) {
                    return;
                }
                x2 = stage.getPointerPosition().x;
                y2 = stage.getPointerPosition().y;
        
                selectionRectangle.setAttrs({
                    x: Math.min(x1, x2),
                    y: Math.min(y1, y2),
                    width: Math.abs(x2 - x1),
                    height: Math.abs(y2 - y1),
                });
                page_layer.batchDraw();
            });
    
            stage.on('mouseup touchend', () => {
                if(!isEdit){
                    return;
                }
                // no nothing if we didn't start selection
                if (!selectionRectangle.visible()) {
                    return;
                }
                // update visibility in timeout, so we can check it in click event
                setTimeout(() => {
                    selectionRectangle.visible(false);
                    page_layer.batchDraw();
                });
        
                var shapes = stage.find('.rect').toArray();
                var box = selectionRectangle.getClientRect();
                var selected = shapes.filter((shape) =>
                    Konva.Util.haveIntersection(box, shape.getClientRect())
                );
                console.log('selected:', selected);
                tr.nodes(selected);
                page_layer.batchDraw();
            });
        
            // clicks should select/deselect shapes
            stage.on('click tap', function (e) {
                if(!isEdit){
                    return;
                }
                // if we are selecting with rect, do nothing
                // if (selectionRectangle.visible()) {
                //     return;
                // }
        
                // if click on empty area - remove all selections
                if (e.target === bk_img) {
                    tr.nodes([]);
                    page_layer.draw();
                    return;
                }
        
                // do nothing if clicked NOT on our rectangles
                if (!e.target.hasName('rect')) {
                    return;
                }
        
                // do we pressed shift or ctrl?
                const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
                const isSelected = tr.nodes().indexOf(e.target) >= 0;
        
                if (!metaPressed && !isSelected) {
                    // if no key pressed and the node is not selected
                    // select just one
                    tr.nodes([e.target]);
                } else if (metaPressed && isSelected) {
                    // if we pressed keys and node was selected
                    // we need to remove it from selection:
                    const nodes = tr.nodes().slice(); // use slice to have new copy of array
                    // remove node from array
                    nodes.splice(nodes.indexOf(e.target), 1);
                    tr.nodes(nodes);
                } else if (metaPressed && !isSelected) {
                    // add the node into selection
                    const nodes = tr.nodes().concat([e.target]);
                    tr.nodes(nodes);
                }
                page_layer.draw();
            });
        };
    }

    // creating file and page layers
    var file_layers = {};
    var page_layers = {};

    for(var findex = 0; findex < fileData.length; findex++){
        var file_layer = new Konva.Layer();
        var file_id = fileData[findex].id;
        
        stage.add(file_layer);
        file_layers[file_id] = file_layer;

        var pages = fileData[findex].children;
        for(var pindex = 0; pindex < pages.length; pindex++){
            var page_id = pages[pindex].id;
            var page_layer = new Konva.Layer();

            stage.add(page_layer);
            page_layers[page_id] = page_layer;
        }
    }

    console.log('file_layers', file_layers);
    var showBBoxes = function() {
        
        // create shape
        for (i=0; i < 4; i++) {
            var box = new Konva.Rect({
                x: 50 + 150*i,
                y: 50 + 150*i,
                width: 100,
                height: 50,
                //fill: '#000000',
                //opacity: 0.2,
                stroke: 'black',
                strokeWidth: 1,
                draggable: true
            });
            boxes.push(box);
            layer.add(box);

            // add cursor styling
            box.on('mouseover', function() {
                document.body.style.cursor = 'pointer';
            });
            box.on('mouseout', function() {
                document.body.style.cursor = 'default';
            });
        }
    };

    var editBoxes = function() {
        for (i=0; i < boxes.length; i++) {
            var tr1 = new Konva.Transformer({
                nodes: [boxes[i]],
                keepRatio: false,
                anchorSize: 3,
                enabledAnchors: [
                  'top-left',
                  'top-right',
                  'bottom-left',
                  'bottom-right',
                ],
            });
            trs.push(tr1);
            layer.add(tr1);
        }
    }

    var unEditBoxes = function() {
        for (i=0; i < trs.length; i++) {
            trs[i].detach();
        }
    }

    showBBoxes();
    editBoxes();
    unEditBoxes();
    layer.draw();

    var editBtn = $('#editBtn');
    var isEdit = true;
    editBtn.on('click', function(e) {
        e.preventDefault();
        if (isEdit == false) {
            // editBoxes();
            // layer.draw();
            isEdit = true;
            //this.text = 'DONE'
        } else {
            // unEditBoxes();
            // layer.draw();
            isEdit = false;
            //this.text = 'EDIT'
        }
    });

    var imageObj = new Image();
    imageObj.onload = function () {
        var yoda = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: 100,
            height: 100,
        });

        // add the shape to the layer
        layer.add(yoda);
        layer.batchDraw();
    };
    imageObj.src = './assets/image/page1.jpeg';

    function hideFilesContent(){
        var file_ids = Object.keys(file_layers);
        for(var index = 0; index < file_ids.length; index++){
            file_layers[file_ids[index]].remove();
            // file_layers[file_ids[index]].hide();
        }
    }

    function hidePagesContent(){
        var page_ids = Object.keys(page_layers);
        for(var index = 0; index < page_ids.length; index++){
            page_layers[page_ids[index]].remove();
            // page_layers[page_ids[index]].hide();
        }
    }
    function showFileContent(file_id){
        
        hideFilesContent();
        hidePagesContent();

        // getting file_index
        var file_index = 0;
        for(var findex = 0; findex < fileData.length; findex ++){
            if(file_id == fileData[findex].id){
                file_index = findex;
                break;
            }
        }

        stage.add(file_layers[file_id]);
        drawFileContent(file_layers[file_id], file_index, 0);

        file_layers[file_id].show();
    }

    function showPageContent(page_id){

        console.log('showPageContent', page_id);
        hideFilesContent();
        hidePagesContent();

        // getting page_index
        var page_index = 0;
        for(var findex = 0; findex < fileData.length; findex ++){
            var pages = fileData[findex].children;
            for(var pindex = 0; pindex < pages.length; pindex++){
                if(page_id == pages[pindex].id){
                    page_index = pindex;
                    break;
                }
            }
            
        }

        stage.add(page_layers[page_id]);
        drawPageContent(page_layers[page_id], page_index);
        page_layers[page_id].show();

        const node = fileTree.tree('getNodeById', page_id);
        fileTree.tree('selectNode', node);
    }

    
    var selectedIcon =
    '<span class="selected-icon d-inline-block text-center border-1 bgc-warning px-1px mx-1 text-70 pb-1px radius-2px">\
        <i class="w-2 fa fa-check text-white"></i>\
    </span>';
    
    var deselectedIcon = 
    '<span class="deselected-icon d-inline-block text-center border-1 bgc-white brc-secondary-m3 px-1px mx-1 text-70 pb-1px radius-2px">\
        <i class="w-2 fa fa-times text-orange-l4"></i>\
    </span>';

    
    /*var categoryTree = $('#id-jqtree-categories');
    categoryTree.tree({
        data: categoryData,
        autoOpen: false,
        useContextMenu: false,
 
        closedIcon : $('<i class="bgc-white w-2 far fa-plus-square text-grey-l1 text-110"></i>'),
        openedIcon : $('<i class="bgc-white w-2 far fa-minus-square text-default-d2 text-110"></i>'),

        onCreateLi: function(node, $li, is_selected) {
            // insert the icon
            var title = $li.find('.jqtree-title');
            if(node.children.length == 0) {
                title.addClass('text-grey-d2 text-95');
                if( is_selected ) {
                    $(selectedIcon).insertBefore(title);
                }
                else {
                    $(deselectedIcon).insertBefore(title);
                }
            }
            else {
                title.addClass('text-secondary-d3 font-italic');
            }
            $li.find('.jqtree-element').addClass('bgc-h-warning-l3 radius-1');
        }
    });

    categoryTree.on( 'tree.click', function(e) {
        // Disable single selection
        e.preventDefault();

        var selectedNode = e.node;
        if (selectedNode.id === undefined || selectedNode.children.length > 0) {
            return;
        }

        if( categoryTree.tree('isNodeSelected', selectedNode) ) {
            //if already selected, deselect it
            categoryTree.tree('removeFromSelection', selectedNode);

            //insert deselectedIcon and remove .selected-icon
            var icon = $(selectedNode.element).find('.selected-icon');
            $(deselectedIcon).insertAfter(icon);
            icon.remove();
        }    
        else {
            categoryTree.tree('addToSelection', selectedNode);

            //insert selectedIcon and remove .deselected-icon
            var icon = $(selectedNode.element).find('.deselected-icon');
            $(selectedIcon).insertAfter(icon);
            icon.remove();
        }
    });*/

    ///////////

    //Browse Files Tree
    var fileTree = $('#id-jqtree-files');
    

    fileTree.tree({
          data: fileData,
          autoOpen: 1,
          dragAndDrop: true,
          useContextMenu: true,

          //used to specify drag & dropped items's color         
          /*onCanMoveTo: function(node) {
            node.element.querySelector('* > .jqtree-element').classList.add('bgc-warning-l1', 'border-x-2', 'brc-warning');         
            return true;
          },*/
         
          
          closedIcon : $('<i class="fa fa-caret-right text-muted"></i>'),
          openedIcon : $('<i class="fa fa-caret-right rotate-45 text-muted"></i>'),

          onCreateLi: function(node, $li) {
              $li.find('.jqtree-element').addClass('bgc-h-warning-l3');
              
              // insert the icons
              if(node.icons) {
                  var $title = $li.find('.jqtree-title');

                  var iconDefault = null
                  // prepend the `default` icon
                  if(node.icons.default) {
                    iconDefault = $( node.icons.default[0] ).addClass( node.icons.default[1] ).addClass('node-icon');
                    $title.prepend( iconDefault );
                  }

                  // prepend the `open` icon
                  if(node.icons.open) {
                      if(iconDefault) iconDefault.addClass('closed-icon');
                        $title.prepend(
                            $( node.icons.open[0] ).addClass( node.icons.open[1] ).addClass('opened-icon').addClass('node-icon')
                        );
                  }
              }
          }
    });

    var _highlightNode = function(node) {
        var className = node.children.length > 0 ? 'bgc-success-l2' : 'bgc-primary-l2';        
        var el = node.element.querySelector('* > .jqtree-element');
        el.classList.add(className)
        el.classList.remove('bgc-h-warning-l3');
    }
    var _unhighlightNode = function(node) {
        var el = node.element.querySelector('* > .jqtree-element')
        el.classList.remove('bgc-success-l2');
        el.classList.remove('bgc-primary-l2');
        el.classList.add('bgc-h-warning-l3');
    }

    var _lastContextMenu = null, _lastDropdownItem = null;
    var _hideContextMenu = function(menu) {        
        $(menu.parentNode).removeClass('dropdown dd-backdrop dd-backdrop-none-md');
        $(menu).next().remove();
        $(menu).dropdown('dispose').remove();
        _lastContextMenu = null;
        _lastDropdownItem = null;
    }

    var highlighted = null;
    fileTree.on('tree.click', function(e) {
        // Disable single selection
        //e.preventDefault();
        console.log('tree.click', e.node);

        if (_lastContextMenu != null ) return;       
        
        
        var selectedNode = e.node;
    
        if(selectedNode.children.length != 0){
            console.log('File Click');
            showFileContent(selectedNode.id);
        }
        else{
            console.log('Page Click');
            showPageContent(selectedNode.id);
        }
        if (selectedNode.id === undefined) {
            //console.warn('The multiple selection functions require that nodes have an id');
            return;
        }
    
        if (fileTree.tree('isNodeSelected', selectedNode)) {
            fileTree.tree('removeFromSelection', selectedNode);
            _unhighlightNode(selectedNode);
            highlighted = null;
        } else {
            if (highlighted != null) {
                _unhighlightNode(highlighted);
            }
            fileTree.tree('addToSelection', selectedNode);
            _highlightNode(selectedNode);
            highlighted = selectedNode;
        }
    })
    .on('tree.contextmenu',
        function(event) {            
            if(_lastContextMenu != null) {
                if( event.node.element == _lastDropdownItem ) return;//dropdown already shown
                _hideContextMenu(_lastContextMenu);//hide previous dropdown
            }

            _lastDropdownItem = event.node.element;

            var item = event.node.element.querySelector('.jqtree-title');
            $(item).addClass('dropdown dd-backdrop dd-backdrop-none-md').append('<a href="#" class="d-none" data-toggle="dropdown">&nbsp;</a>\
            <div class="dropdown-menu dropdown-caret radius-1 border-b-2 shadow-sm brc-default-m2 dd-slide-up dd-slide-none-md"><div class="dropdown-inner">\
                <div class="d-md-none dropdown-title px-3 text-secondary-d3">'+event.node.name+'</div>\
                <div class="d-md-none dropdown-divider"></div>\
                <a href="#" class="dropdown-item"><i class="fa fa-edit text-blue mr-1 w-2"></i> Rename</a>\
                <a href="#" class="dropdown-item"><i class="fa fa-trash-alt text-danger mr-1 w-2"></i> Delete</a>\
            </div></div>');

            _lastContextMenu = item.querySelector('[data-toggle=dropdown]');
            $(_lastContextMenu.nextElementSibling).on('click', function(e) {
                //e.stopImmediatePropagation();//so that node doesn't get selected
                $(_lastContextMenu).dropdown('hide');//so that dropdown gets hidden
            });
            $(_lastContextMenu).dropdown('show').parent().one('hide.bs.dropdown', function(e) {
                _hideContextMenu( this.querySelector('[data-toggle=dropdown]') );            
            });
        }
    );

var daterange_container = document.querySelector('#id-daterange-container');
  // Inject DateRangePicker into our container
  DateRangePicker.DateRangePicker(daterange_container, {
      mode: 'dp-modal'
  })
  .on('statechange', function (_, rp) {
      // Update the inputs when the state changes
      var range = rp.state;
      $('#id-daterange-from').val( range.start ? range.start.toDateString() : '' );
      $('#id-daterange-to').val( range.end ? range.end.toDateString() : '' );
  });

  $('#id-daterange-from, #id-daterange-to').on('focus', function() {    
    daterange_container.classList.add('visible');
  });

  var daterange_wrapper = document.querySelector('#id-daterange-wrapper');
  var previousTimeout = null;
  $( daterange_wrapper ).on('focusout', function() {
      if(previousTimeout) clearTimeout(previousTimeout);
      previousTimeout = setTimeout(function() {
        if ( !daterange_wrapper.contains(document.activeElement) ) {
          daterange_container.classList.remove('visible');
        }
      }, 10);
  });

  var TinyDatePicker = DateRangePicker.TinyDatePicker;
  var dp = TinyDatePicker('#id-date-1', {
    mode: 'dp-below',
  }).on('statechange', function(ev) {
      
  });

  //typeahead.js
    //example taken from plugin's page at: https://twitter.github.io/typeahead.js/examples/
    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;
            
            // an array that will be populated with substring matches
            matches = [];
            
            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');
            
            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });

            cb(matches);
        }
    }

    var US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
    var COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua & Deps","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Rep","Chad","Chile","China","Colombia","Comoros","Congo","Congo {Democratic Rep}","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland {Republic}","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea North","Korea South","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar, {Burma}","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russian Federation","Rwanda","St Kitts & Nevis","St Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Sao Tome & Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]

    $('input.typeahead').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1,
            classNames: {
                menu : 'dropdown-menu',
                suggestion : 'dropdown-item',
                cursor : 'bgc-yellow-m2'
            }
        },
        {
            name: 'states',
            displayKey: 'value',
            source: substringMatcher(US_STATES),
            limit: 10
        }
    );

    $('input.typeahead2').typeahead(
        {
            hint: true,
            highlight: true,
            minLength: 1,
            classNames: {
                menu : 'dropdown-menu',
                suggestion : 'dropdown-item',
                cursor : 'bgc-yellow-m2'
            }
        },
        {
            name: 'states',
            displayKey: 'value',
            source: substringMatcher(COUNTRIES),
            limit: 10
        }
    );

     $('#aside-1')
    .aceAside({
        placement: 'right',
        dismiss: true,
        belowNav: true,
        extraClass: 'my-2'
    })

    
});