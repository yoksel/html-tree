console.clear();
// Tiny library for SVG
// has conflict with greensock :'(((

var doc = document;
var ns = 'http://www.w3.org/2000/svg';

//---------------------------------

// Object.prototype.createElem = function( elemName ) {
//     return this.createElement( elemName );
// }

//---------------------------------

// Object.prototype.createNS = function( elemName ) {
//     return this.createElementNS( ns, elemName );
// }

//---------------------------------

// Object.prototype.getElem = function( selector ) {
//     return this.querySelector( selector );
// }

//---------------------------------

// Object.prototype.getElemsList = function( selector ) {
//     return this.querySelectorAll( selector );
// }

//---------------------------------

// Object.prototype.addElem = function( elem ) {
//     return this.appendChild( elem );
// }

//---------------------------------

// Object.prototype.getAttr = function( attrName ) {

//     var out = this.getAttribute( attrName );

//     if ( attrName === 'value' ) {
//         // Wtf? Why value is null?
//         out = this.value;
//     }
//     return out;

// }

//---------------------------------

// Object.prototype.setAttr = function( attrObj ) {

//     for ( var attrName in attrObj ) {
//         var attrVal = attrObj[attrName];

//         if( typeof attrVal !== 'function' ) {
//             this.setAttribute( attrName, attrVal );
//         }
//     }
//     return;
// }

//---------------------------------

// Object.prototype.setProp = function( attrObj ) {

//     for ( var attrName in attrObj ) {
//         var attrVal = attrObj[attrName];

//         if( typeof attrVal !== 'function' ) {
//             this[ attrName ] = attrVal;
//         }
//     }
//     return;
// }

//---------------------------------

// Object.prototype.fillShape = function( hue ){
//     var colorSet = [hue, '100%', '50%'].join(',');
//     var color = 'hsl(' + colorSet + ')';
//     this.setAttr('fill', color);
// }

//---------------------------------
// Colored console output
var consoleStyles = {
    'h1': 'font: 2.5em/1 Arial; color: crimson;',
    'h2': 'font: 2em/1 Arial; color: orangered;',
    'h3': 'font: 1.6em/1 Arial; color: olivedrab;',
    'val': 'font: bold 1.3em/1 Arial; color: midnightblue',
    'warn': 'padding: 0 .3rem; background: crimson; font: 2em/1 Arial; color: white'
}

// Object.prototype.style = function( msg, style ) {
//     if ( !style || !consoleStyles[ style ] ) {
//         style = 'val';
//     }
//     console.log( '%c' + msg, consoleStyles[ style ] );
// }
