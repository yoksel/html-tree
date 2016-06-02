var doc = document;
var codeInput = doc.querySelector('.gnr-code-input');
var codeOutput = doc.querySelector('.gnr-code-output');
var tree = doc.querySelector('.gnr-tree');
var rangeDeep = doc.querySelector('.gnr-deep__range');
var valDeep = doc.querySelector('.gnr-deep__digit');
var maxDeep = 1;
var styleElem = doc.createElement('style');
doc.head.appendChild( styleElem );

// DEV
var testMarkup = '<ul class="main-nav header__nav"><li class="main-nav__item header__li"><a class="link main-nav__link" href="https://htmlacademy.ru/">HMTL Academy</a></li></ul>';
codeInput.value = testMarkup;
createTreeFromHTML ( testMarkup );

codeInput.oninput = function() {
  createTreeFromHTML ( this.value );
};

function createTreeFromHTML ( code ) {

  codeOutput.innerHTML = code;

  var items =  makeList( codeOutput, 1 );

  if ( tree.childElementCount > 0 ) {
    tree.removeChild( tree.firstElementChild );
  }

  var list = doc.createElement('ul');
  list.classList.add('gnr-level','gnr-level--0');
  list.appendChild( items );
  tree.appendChild( list );

  setRange();

}

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

    elem.level = level;

    // Check Bem in levels more then firts child
    if ( level > 2 ) {
      checkBemNaming ( elem );
    }

    var classSpan = doc.createElement('span');
    classSpan.classList.add('gnr-elem__class', 'gnr-class');

    for (var i = 0; i < elem.classList.length; i++) {
      var classItem = elem.classList[ i ];
      var classItemSpan = doc.createElement('span');
      classItemSpan.classList.add('gnr-class__item');
      classItemSpan.innerHTML += classItem;

      // Check valid Bem naiming
      if ( elem.classList.validBem &&
           elem.classList.validBem[ classItem ] === false  ) {

        classItemSpan.classList.add('gnr-class__item--warning');
      }

      classSpan.appendChild( classItemSpan );

      if ( i < elem.classList.length - 1) {
        classSpan.innerHTML += ' ';
      }
    }

    classSpan.innerHTML = '.' + classSpan.innerHTML;
    liContent.appendChild ( classSpan );
  }

  item.appendChild( liContent );

  if ( elem.children ) {


    var childrenList = doc.createElement('ul');
    childrenList.classList.add('gnr-level','gnr-level--' + level);

    level++;

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

function checkBemNaming( elem ) {

  if ( elem.className.indexOf('__') < 0 &&
       elem.className.indexOf('--') < 0 ) {
    return;
  }

  elem.classList['validBem'] = {};
  var parentPrefixes = findPrefixInParentNode( elem );

  for ( var i = 0; i < elem.classList.length; i++ ) {
    var classItem = elem.classList[ i ];
    var prefixCorrect = false;
    var modifPrefixCorrect = false;

    // Check first part of class with __
    if ( classItem.split('__').length > 1 ) {
      var prefix = classItem.split('__')[0];

      if ( elem.parentNode.classList.contains( prefix ) ) {
        prefixCorrect = true;
      }
      else {
        // Try to find prefix in parent classes prefixes
        var parentPrefixes = findPrefixInParentNode( elem );

        if ( parentPrefixes[ prefix ] ) {
          prefixCorrect = true;
        }
      }

      elem.classList['validBem'][ classItem ] = prefixCorrect;
    }

    // Check first part of class with --
    if ( classItem.split('--').length > 1 ) {
      var modifPrefix = classItem.split('--')[0];

      if ( elem.classList.contains( modifPrefix ) ) {
        modifPrefixCorrect = true;
      }

      elem.classList['validBem'][ classItem ] = modifPrefixCorrect;
    }

  }
}

//------------------------------

function findPrefixInParentNode( elem ) {
  var classList = elem.parentNode.classList;
  var prefixes = {};

  for (var i = 0; i < classList.length; i++) {
    var classItem = classList[i];

    if ( classItem.split('__').length > 1 ) {
      var prefix = classItem.split('__')[0];
      prefixes[ prefix ] = prefix;
    }
  }

  return prefixes;
}

//------------------------------

function setRange () {
  rangeDeep.max = maxDeep;
  rangeDeep.value = maxDeep;
  valDeep.innerHTML = maxDeep;
}

//------------------------------

rangeDeep.oninput = function () {
  var level = +this.value;
  var styles = '.gnr-level--' + level + '{ display: none }';
  styleElem.innerHTML = styles;
  valDeep.innerHTML = this.value;
}

