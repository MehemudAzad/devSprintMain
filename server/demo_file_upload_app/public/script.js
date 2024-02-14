$(document).ready(function() {
    $('#fileUploadForm').submit(function(event) {
        event.preventDefault();
        var formData = new FormData($(this)[0]);

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log('File uploaded successfully');
                displayFiles();
            },
            error: function(err) {
                console.error('Error uploading file:', err);
            }
        });
    });

    function displayFiles() {
        $.get('/files', function(files) {
            $('#fileList').empty();
            files.forEach(function(file) {
                $('#fileList').append(`<p><a href="/file/${file.id}">${file.originalname}</a></p>`);
            });
        });
    }

    displayFiles();
});
