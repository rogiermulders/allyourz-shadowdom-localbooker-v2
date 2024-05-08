
var targetContainer = document.querySelector('.et_pb_row.et_pb_row_1.et_pb_equal_columns')
var div = document.createElement('div');
div.setAttribute('id', 'localbooker');
div.setAttribute('data-pid', '002C85C0-F76B-43C3-B98E-F191CB775E55');
div.setAttribute('data-page', 'spa');
div.setAttribute('data-scroll', 'true');
div.setAttribute('offset', '#main-header');
div.setAttribute('data-mainfilter','{"where":{"range":10,"disabled":true,"destinationZip":"4401ED"}}');
div.setAttribute('style','width:80%; border:solid 0px gray; margin:auto;')
targetContainer.innerHTML = '';
targetContainer.appendChild(div);

var script = document.createElement('script');
script.setAttribute('src', 'http://local.localbooker.nl/localbooker.js');
document.head.appendChild(script);




var targetContainer = document.querySelector('.et_pb_text_inner')
var form = document.createElement('form');
var input = document.createElement('input');
input.value = ''
form.appendChild(input);
targetContainer.appendChild(form);
