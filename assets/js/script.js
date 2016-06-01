var doc = document;
var codeInput = doc.querySelector('.gnr-code-input');
var codeOutput = doc.querySelector('.gnr-code-output');
var tree = doc.querySelector('.gnr-tree');
var rangeDeep = doc.querySelector('.gnr-deep__range');
var valDeep = doc.querySelector('.gnr-deep__digit');
var maxDeep = 1;

var styleElem = doc.createElement('style');
doc.head.appendChild( styleElem );

codeInput.oninput = function() {

  codeOutput.innerHTML = this.value;

  console.log( 'value.length: ', this.value.length );

  var items =  makeList( codeOutput, 1 );

  if ( tree.childElementCount > 0 ) {
    tree.removeChild( tree.firstElementChild );
  }

  var list = doc.createElement('ul');
  list.classList.add('gnr-level','gnr-level--0');
  list.appendChild( items );
  tree.appendChild( list );

  setRange();

};

//------------------------------

function makeList( elem, level ) {

  var item = doc.createElement('li');
  item.classList.add('gnr-level__item');
  var tagName = elem.tagName;
  var className = elem.className;

  if ( level === 1 ) {
    tagName = 'BODY';
    className = '';
  }

  var liContent = doc.createElement('div');
  liContent.classList.add('gnr-level__elem','gnr-elem');

  var tagSpan = doc.createElement('span');
  tagSpan.classList.add('gnr-elem__tag');
  tagSpan.innerHTML = tagName;

  liContent.appendChild ( tagSpan );

  if ( className ) {

    var classSpan = doc.createElement('span');
    classSpan.classList.add('gnr-elem__class');
    classSpan.innerHTML = '.' + className;
    liContent.appendChild ( classSpan );
  }

  item.appendChild( liContent );

  if ( elem.children ) {

    level++;

    var childrenList = doc.createElement('ul');
    childrenList.classList.add('gnr-level','gnr-level--' + level);

    for ( var i = 0; i < elem.children.length; i++ ){

      var child = elem.children[ i ];

      if ( child.tagName
           && child.tagName != 'SCRIPT'
           && child.tagName != 'META'
           && child.tagName != 'TITLE'
           && child.tagName != 'LINK'
           && child.tagName != 'NOSCRIPT'
           && child.tagName != 'BR') {

        var newElem = makeList( child, level );
        if ( newElem ) {
          childrenList.appendChild( newElem );
        }
      }
    }

    if ( childrenList.children.length > 0 ) {
      if ( level > maxDeep ) {
        maxDeep = level;
      }

      item.appendChild( childrenList );
    }

  }

  return item;
}

//------------------------------

function setRange () {
  rangeDeep.max = maxDeep;
  rangeDeep.value = maxDeep;
  valDeep.innerHTML = maxDeep;
}

//------------------------------

rangeDeep.oninput = function () {
  var level = +this.value + 1;
  var styles = '.level--' + level + '{ display: none }';
  styleElem.innerHTML = styles;
  valDeep.innerHTML = this.value;
}

