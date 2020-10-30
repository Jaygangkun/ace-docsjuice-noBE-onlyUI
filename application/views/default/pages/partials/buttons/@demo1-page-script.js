jQuery(function($) {

  $('#id-ripple').on('click', function() {
    Waves.attach('.btn:not([class*="btn-light"]):not([class*="btn-h-light"]):not([class*="btn-h-outline"])', ['waves-light'])
    Waves.attach('.btn[class*="btn-h-outline"]:not([class*="btn-a-outline"])', ['waves-light'])

    Waves.attach('.btn[class*="btn-light"]')
    Waves.attach('.btn[class*="btn-h-light"][class*="btn-a-light"]')
    Waves.attach('.btn[class*="btn-h-outline"][class*="btn-a-outline"]')

    Waves.init()
    
    this.setAttribute('disabled', 'disasbled')
    this.blur()

    $('#btn-app-1 .badge').removeClass('m-n2')
  })

    $('#ace-file-input2').aceFileInput({
    style: 'drop',
    droppable: true,

    container: 'border-1 border-dashed brc-grey-l1 brc-h-blue-m2 shadow-sm',

    placeholderClass: 'text-125 text-600 text-grey-l2 my-2',
    placeholderText: 'Drop files here or click to choose',
    placeholderIcon: '<i class="fa fa-cloud-upload-alt fa-3x text-blue-l1 my-2"></i>',

    //previewSize: 80,
    thumbnail: 'large',

    //allowExt: 'gif|jpg|jpeg|png|webp|svg',
    //allowMime: 'image/png|image/jpeg',
    //allowMime: '*/*',

    //maxSize: 100000,
    
  })
  .on('change', function() {
    console.log( $(this).data('ace_input_files') )
    console.log( $(this).data('ace_input_method') )

    var ace_input_files = $(this).data('ace_input_files');
    var files = [];
    var file_id = 1;
    for(var findex = 0; findex < ace_input_files.length; findex++){
      var icon = {
        'default': ['<i class="fas fa-file-pdf"></i>', 'text-danger-m1']
      };

      var file_name = ace_input_files[findex].name;
      if(file_name.indexOf('.pdf') != -1){
        icon = {
          'default': ['<i class="fas fa-file-pdf"></i>', 'text-danger-m1']
        };
      }
      else if(file_name.indexOf('.doc') != -1){
        icon = {
          'default': ['<i class="fa fa-file-word"></i>', 'text-blue2-m2']
        }
      }
      else if(file_name.indexOf('.xlsx') != -1){
        icon = {
          'default': ['<i class="fa fa-file-excel"></i>', 'text-blue2-m2']
        }
      }
      var children = [];

      var pages = Math.floor(Math.random() * 10) + 1;
      var page_id = file_id + 1;
      for(var pindex = 0; pindex < pages; pindex++){
        var page_index = pindex + 1;
        children.push({
            id: page_id,
            name: 'page' + page_index,
            icons: {
                'default': ['<i class="far fa-file"></i>', 'text-grey'],
            }
        });
        page_id ++;
      }

      files.push({
        id: file_id,
        name: file_name, 
        icons: icon,
        children: children
      });

      file_id = page_id;
    }

    console.log('files', files);
    localStorage.setItem('uploaded_files', JSON.stringify(files));
    var get_files = JSON.parse(localStorage.getItem('uploaded_files'));
    console.log('get_files', get_files);
  })
  .on('invalid.ace.file', function(e, errors) {
    // console.log(errors)
  })
  .on('preview_failed.ace.file', function(e, error) {
    // console.log(error)
    // if(error.code == 2) alert(error.filename + ' is not an image!')
  })
  .on('reset.ace.file', function(e) {
    // e.preventDefault()
  })

  localStorage.removeItem('doc_type');
  $(document).on('click', '#btn_lading', function(){
    localStorage.setItem('doc_type', 'lading');
    $('#btn_continue').removeClass('disabled');
  })

  $(document).on('click', '#btn_invoice', function(){
    localStorage.setItem('doc_type', 'invoice');
    $('#btn_continue').removeClass('disabled');
  })

  
})