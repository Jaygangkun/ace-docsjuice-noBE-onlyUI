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
    // console.log( $(this).data('ace_input_files') )
    // console.log( $(this).data('ace_input_method') )
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

})