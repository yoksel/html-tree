function Animal() {}

function Rabbit() {}
Rabbit.prototype = Object.create(Animal.prototype);
Rabbit.prototype.constructor = Rabbit;

var rabbit = new Rabbit();

console.log( rabbit.constructor ); // что выведет?
