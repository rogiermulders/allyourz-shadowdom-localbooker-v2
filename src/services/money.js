export const toEuro = (cents, showCurrency) => {

  if(cents === ''){
    cents = 0;
  }

  let eur = new Intl
    .NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
    .format(cents/100);
  eur = eur.replace(',00',',-')

  return showCurrency ? eur : eur.substring(2);

};

export const toCents = (cents, showCurrency) => {


  let money = showCurrency ? cents.substring(2) : cents;

  // remove all non numebr and make to 123.4 whatever
  money = money.replace(/[^0-9,.]/g,'').replace(',','.');

  // Add leading 0 so 1 -> 1.00 and 1.1 => 1.10
  if(money.split('.').length === 1){
    money = money + '.00';
  } else {
    if (money.split('.')[1].length === 1) {
      money = money + '0';
    }
  }

  // Remove . and make int
  return parseInt(money.replace(/\D/g,''),10);

};
