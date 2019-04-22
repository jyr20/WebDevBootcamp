var faker = require('faker');

for (var i =0; i<10; i++){
	console.log(faker.fake("{{commerce.productName}} for just {{finance.currencySymbol}}{{commerce.price}}!!!"));
}
