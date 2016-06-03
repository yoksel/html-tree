var doc = document;
var codeInput = doc.querySelector('.gnr-code-input');
var codeOutput = doc.querySelector('.gnr-code-output');
var treeContent = doc.querySelector('.gnr-tree__content');
var treePlaceHolder = doc.querySelector('.gnr-tree__placeholder');
var rangeDeep = doc.querySelector('.gnr-deep__range');
var valDeep = doc.querySelector('.gnr-deep__digit');
var maxDeep = 1;
var message = doc.querySelector('.gnr-message');
var bemMessage = doc.querySelector('.gnr-message--bem');
var headersMessage = doc.querySelector('.gnr-message--headers');
var headersMessageContent = doc.querySelector('.gnr-message--headers .gnr-message__content');
var headersLevels = {};
var headersOrder = ['H1','H2','H3','H4','H5','H6'];
var isWHolePage = false;
var hasBemWarning = false;

var wholePageMarkers = ['META', 'TITLE', 'LINK'];
var skippedTags = ['SCRIPT', 'META', 'TITLE', 'LINK', 'NOSCRIPT', 'BR', 'svg'];

var styleElem = doc.createElement('style');
doc.head.appendChild( styleElem );

// DEV ONLY
// runDev();

//------------------------------

codeInput.oninput = function () {
  setHeadersDefs();
  isWHolePage = false;
  hasBemWarning = false;
  maxDeep = 1;

  headersMessage.classList.add( 'gnr-hidden' );
  bemMessage.classList.add( 'gnr-hidden' );

  createTreeFromHTML ( this.value );
};

//------------------------------

function setHeadersDefs () {
  headersLevels = {
    'H1': false,
    'H2': false,
    'H3': false,
    'H4': false,
    'H5': false,
    'H6': false
    };
}

//------------------------------

function createTreeFromHTML ( code ) {

  if( !code ) {
    treeContent.classList.add('gnr-hidden');
    treePlaceHolder.classList.remove('gnr-hidden');
    setRange();
    return;
  }

  codeOutput.innerHTML = code;

  var items = makeList( codeOutput, 1 );

  if ( treeContent.childElementCount > 0 ) {
    treeContent.removeChild( treeContent.firstElementChild );
  }

  var list = doc.createElement('ul');
  list.classList.add('gnr-level','gnr-level--0');
  list.appendChild( items );
  treeContent.appendChild( list );

  treeContent.classList.remove('gnr-hidden');
  treePlaceHolder.classList.add('gnr-hidden');

  setRange();

  showCodeErrors();
}

//------------------------------

function makeList ( elem, level ) {

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

  // Check headers levels
  if ( headersLevels[ tagName ] !== undefined ) {
    headersLevels[ tagName ] = true;
  }

  liContent.appendChild ( tagSpan );

  if ( className ) {

    elem.level = level;

    // Check Bem in levels more then firts child
    if ( level > 2 ) {
      checkBemForElem ( elem );
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

      checkIsWholePage( child );

      if ( !checkIsSkippedTag( child )) {

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

function checkBemForElem ( elem ) {

  if ( elem.className.indexOf('__') < 0 &&
       elem.className.indexOf('--') < 0 ) {
    return;
  }

  elem.classList['validBem'] = {};
  var parentPrefixes = findPrefixInParentNode( elem );

  for ( var i = 0; i < elem.classList.length; i++ ) {
    var classItem = elem.classList[ i ];

    // Check first part of class with __
    if ( classItem.split('__').length > 1 ) {
      var prefixCorrect = false;
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

      if ( !prefixCorrect ) {
        hasBemWarning = true;
      }
    }

    // Check first part of class with --
    if ( classItem.split('--').length > 1 ) {
      var modifPrefixCorrect = false;
      var modifPrefix = classItem.split('--')[0];

      if ( elem.classList.contains( modifPrefix ) ) {
        modifPrefixCorrect = true;
      }

      elem.classList['validBem'][ classItem ] = modifPrefixCorrect;

      if ( !modifPrefixCorrect ) {
        hasBemWarning = true;
      }
    }

  }
}

//------------------------------

function findPrefixInParentNode ( elem ) {
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

//------------------------------

function showCodeErrors () {

  checkHeadersLevels();
  showBemMessage();

}

function showBemMessage () {

  if ( hasBemWarning ) {
    bemMessage.classList.remove( 'gnr-hidden' );
  }
  else {
    bemMessage.classList.add( 'gnr-hidden' );
  }
}

//------------------------------

function checkHeadersLevels () {
  var isWrongOrder = false;
  var realOrder = doc.createElement('dl');
  realOrder.classList.add('headers__list');
  var maxUsedHeaders = 0;
  var tempHeadersStack = 0;
  var longestHeadersStack = 0;

  var realOrderDt = doc.createElement('dt');
  realOrderDt.classList.add('headers__title');
  realOrderDt.innerHTML = 'Заголовки: ';
  realOrder.appendChild( realOrderDt );

  for( var key in headersLevels ) {
      if ( headersLevels[ key ] ) {
        maxUsedHeaders++;
        tempHeadersStack++;
      }
      else {
        if ( longestHeadersStack < tempHeadersStack ) {
          longestHeadersStack = tempHeadersStack;
        }
        tempHeadersStack = 0;
      }
  }

  if ( maxUsedHeaders > longestHeadersStack ) {
    isWrongOrder = true;
  }
  else if ( isWHolePage && !headersLevels[ 'H1' ] ){
   isWrongOrder = true;
  }

  if ( isWrongOrder ) {
    for (var i = 0; i < headersOrder.length; i++) {
      var headerItem = headersOrder[i];
      var headerItemSpan = doc.createElement('dd');
      headerItemSpan.classList.add('headers__item');
      headerItemSpan.innerHTML = headerItem;

      if ( headersLevels[ headerItem ] ) {
        headerItemSpan.classList.add('headers__item--found');
      }
      else {
        headerItemSpan.classList.add('headers__item--notfound');
      }

      realOrder.appendChild( headerItemSpan );
    }

    if ( headersMessageContent.firstChild ) {
      headersMessageContent.removeChild( headersMessageContent.firstChild );
    }
    headersMessageContent.appendChild( realOrder );
  }

  if ( isWrongOrder ) {
    headersMessage.classList.remove( 'gnr-hidden' );
  }
  else {
    headersMessage.classList.add( 'gnr-hidden' );
  }

}

//------------------------------

function checkIsSkippedTag ( elem ) {

  if ( skippedTags.indexOf( elem.tagName) >= 0 ) {
    return true;
  }

  return false;
}

//------------------------------

function checkIsWholePage( elem ){

  if ( wholePageMarkers.indexOf( elem.tagName ) >= 0) {
    isWHolePage = true;
  }
}

//------------------------------

function runDev () {
  var testMarkup = '<section class="pricеs"><h2>Hello</h2><input class="price" type="radio" id="btn-4" name="toggle" checked><input class="price" type="radio" id="btn-5" name="toggle"><input class="price" type="radio" id="btn-6" name="toggle"><h4>Hello</h4><div class="prices__controls"><label class="control" for="btn-4"></label><label class="control" for="btn-5"></label><label class="control" for="btn-6"></label></div></section>';
  codeInput.value = testMarkup;
  setHeadersDefs();
  hasBemWarning = false;
  createTreeFromHTML ( testMarkup );
}