/**Upload File Functionality 7/1/2017. */

$('#upload-input').on('click', function(){
  });
$('#upload-input').on('change', function(){
    var files = $(this).get(0).files;
    if (files.length > 0){
        var formData = new FormData();         //Ajax Req for creating and sending the FormData
        // loop through all files after selecting send to formdata.
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
           formData.append('uploads[]', file, file.name);
        }
        $.ajax({
            url: '/Uploads',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data){
                console.log('upload successful!\n' + data);
            }

        });
    }
  /*  $('#upload-input').on('hidden.bs.modal', function(){

        $(this).find.val('').end();})


});*/