var patt = /^[a-zA-Z][a-zA-Z0-9_]*$/;

function showBox(front, back) {
    var bg = $(back);
    $(front).css('display', 'block');
    bg.css('display', 'block');
    bg.width($(document.body).width());
    bg.height($(document.body).height());
}

function closeBox(front, back) {
    $(front).css('display', 'none');
    $(back).css('display', 'none');
}

function getUsername(inputbox) {
    var username = '';
    if (patt.test($(inputbox).val())) {
        username =  $(inputbox).val();
        closeBox('#login', '#back');
        return username;
    } else {
        $('<p id="warn"><b>User name invalid!</b></p>').appendTo('#login div');
        console.log('username invalid!');
        return '';
    }
}