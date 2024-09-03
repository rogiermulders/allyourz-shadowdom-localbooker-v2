
var targetContainer = document.querySelector('.header')
var targetContainer = document.querySelector('#react_0HN60082LKMBD')

var div = document.createElement('div');
div.setAttribute('id', 'localbooker');
div.setAttribute('data-pid', '002C85C0-F76B-43C3-B98E-F191CB775E55');
div.setAttribute('data-page', 'spa');
div.setAttribute('data-scroll', 'true');
div.setAttribute('offset', '#react_0HN60082LNME1');
// div.setAttribute('data-mainfilter','{"where":{"range":10,"disabled":true,"destinationZip":"4401ED"}}');
div.setAttribute('style','width:98%; border:solid 1px #F4F4F4; border-radius: 5px; margin:auto;')
targetContainer.innerHTML = '';
targetContainer.appendChild(div);

var script = document.createElement('script');
script.setAttribute('src', 'https://demo.localbooker.nl/localbooker.js');
document.head.appendChild(script);

var targetContainer = document.querySelector('.et_pb_text_inner')
var form = document.createElement('form');
var input = document.createElement('input');
input.value = ''
form.appendChild(input);
targetContainer.appendChild(form);
