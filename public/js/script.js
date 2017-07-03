var current_dir;
var selected = [];
var p ;
// Download
$("#download-btn").click(function () {
    var spl = current_dir.split('/');
    var url = spl.slice(2).join('/');
  //  window.location = '/archive/' + url;
    post('/archive', {'selected': selected});

});
$(document).ready(function () {

    $.ajax({
        url: "/files",
        success: function (result) {
            contentAdder(result);
        }
    });

    $('#checkbox-all').change(function () {
        var h = $("#checkbox-all").is(':checked');
        $(".checkbox-class").prop('checked', $(this).prop('checked'));
        console.log(this);
    });

    $(document).on('change','.checkbox-class', function(){
        console.log(this);
        var data = $(this).attr("data");
        console.log(data)
        selected.push(data)
        /*if($(this).)*/
    });
    function up() {
        if (current_dir === "/") {
            alert("Currently in Root")
        } else {
            var pre_dir = current_dir.substring(0, current_dir.lastIndexOf('/'));
            ajaxReload(pre_dir)
        }
    }

    $("#up-btn").on("click", up);
    $('html').keyup(function (e) {
        if (e.keyCode === 8) {
            up();
        }
    });

});
//hh

function contentAdder(data) {
    if (data.isDir) {
        selected = [];
        current_dir = data.path;
        $("#t-body").html('');
        data.files.forEach(function (file) {
            var file_url = file.name
            var icon;
            if (file.isDir) {
                icon = "fa fa-folder";
            } else {
                icon = "fa " + file.icon;
            }
            var row = "<tr class='sortable'>" +
                "<td><input type='checkbox' class='checkbox-class' data='"+file_url+"'></td>" +
                "<td class='td-small'><i class='" + icon + " '></i></td>" +
                "<td><a href='javascript: ajaxReload(&#39;" + file.path + "&#39;)' >" + file.name + "</a></td>" +
                "<td>" + file.size + "</td>" +
                "<td>" + file.time + "</td>" +
                "</tr>";
            $("#t-body").append(row)
        });
    } else {
        alert("Its a file")
    }
}
function ajaxReload(url) {
    $.ajax({
        url: url,
        success: function (result) {
            contentAdder(result);
        }
    });
}


function post(path, params, method) {
    console.log("I am called")
    method = method || "post";
    console.log(params);
    p = params
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}