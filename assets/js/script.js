var doc = document;
var codeInput = doc.querySelector('.code-input');
var codeOutput = doc.querySelector('.code-output');
var tree = doc.querySelector('.tree');
var rangeDeep = doc.querySelector('.deep__range');
var valDeep = doc.querySelector('.deep__digit');
var maxDeep = 0;

var styleElem = doc.createElement('style');
doc.head.appendChild( styleElem );

codeInput.oninput = function() {

  codeOutput.innerHTML = this.value;

  var items =  makeList( codeOutput, 0 );

  if ( tree.childElementCount > 0 ) {
    tree.removeChild( tree.firstElementChild );
  }

  var list = doc.createElement('ul');
  list.classList.add('level','level--0');
  list.appendChild( items );
  tree.appendChild( list );

  setRange();

};

//------------------------------

function makeList( elem, level ) {

  var item = doc.createElement('li');
  item.classList.add('level__item');
  var tagName = elem.tagName;
  var className = elem.className;

  if ( level === 0) {
    tagName = 'BODY';
    className = '';
  }

  var liContent = doc.createElement('div');
  liContent.classList.add('level__content');

  var tagSpan = doc.createElement('span');
  tagSpan.classList.add('elem-tag');
  tagSpan.innerHTML = tagName;

  liContent.appendChild ( tagSpan );

  if ( className ) {
    var classSpan = doc.createElement('span');
    classSpan.classList.add('elem-class');
    classSpan.innerHTML = '.' + className;
    liContent.appendChild ( classSpan );
  }

  item.appendChild( liContent );

  if ( elem.children ) {

    level++;

    if ( level > maxDeep ) {
      maxDeep = level;
    }

    var childrenList = doc.createElement('ul');
    childrenList.classList.add('level','level--' + level);

    for ( var pos in elem.children ){
      var child = elem.children[ pos ];

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

