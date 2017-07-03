/**
 * Created by SOFTMAN on 02-07-2017.
 */
var current_dir;
$(document).ready(function () {

    $.ajax({
        url: "/files",
        success: function (result) {
            contentAdder(result);

        }
    });
    $("#download-btn").click(function () {
        var spl = current_dir.split('/');
        var url = spl.slice(2).join('/');
        window.location = '/archive/'+url;
        console.log(url)
    });
    function up() {
        console.log("Curr:" + current_dir)
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

function contentAdder(data) {
    if (data.isDir) {
        current_dir = data.path;
        $("#t-body").html('');
        data.files.forEach(function (file) {

            var row = "<tr class='sortable'>" +
                "<td><input type='checkbox'></td>" +
                "<td><span>Icon</span></td>" +
                "<td><a href='javascript: ajaxReload(&#39;" + file.path + "&#39;)' >" + file.name + "</a></td>" +
                "<td>" + file.name + "</td>" +
                "<td>" + file.name + "</td>" +
                "</tr>";
            $("#t-body").append(row)
        });
    } else {
        alert("Its a file")
    }
}
function ajaxReload(url) {
    //  console.log("ajax Reload called");
    $.ajax({
        url: url,
        success: function (result) {
            contentAdder(result);
            console.log(result);
        }
    });
}
