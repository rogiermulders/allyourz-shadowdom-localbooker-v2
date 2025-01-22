var targetContainer = document.querySelector('.header-img.p-0')

var div = document.createElement('div');
div.setAttribute('id', 'localbooker');
div.setAttribute('data-pid', 'abn');
div.setAttribute('data-page', 'spa');
div.setAttribute('data-locale', 'nl');

targetContainer.innerHTML = '';
targetContainer.appendChild(div);

var script = document.createElement('script');
script.setAttribute('src', 'https://provinciezeeland.localbooker.nl/localbooker.js');
document.head.appendChild(script);

