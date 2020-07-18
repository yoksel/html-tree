var doc = document;
var codeInput = doc.querySelector(`.gnr-code-input`);
var treeContent = doc.querySelector(`.gnr-tree__content`);
var treePlaceHolder = doc.querySelector(`.gnr-tree__placeholder`);
var rangeDeep = doc.querySelector(`.gnr-deep__range`);
var valDeep = doc.querySelector(`.gnr-deep__digit`);
var maxDeep = 1;
var bemMessage = doc.querySelector(`.gnr-message--bem`);
var headersMessage = doc.querySelector(`.gnr-message--headers`);
var headersMessageContent = doc.querySelector(`.gnr-message--headers .gnr-message__content`);
var headersMessageTree = doc.querySelector(`.gnr-message--headers-tree`);
var headersMessageTreeContent = doc.querySelector(`.gnr-message--headers-tree .gnr-message__content`);
var headersLevels = {};
var headersOrder = [`H1`, `H2`, `H3`, `H4`, `H5`, `H6`];
var headersList = [];
var isWHolePage = false;
var hasBemWarning = false;
var bodyClass = ``;

var wholePageMarkers = [`META`, `TITLE`, `LINK`];
var skippedTags = [`SCRIPT`, `META`, `TITLE`, `LINK`, `NOSCRIPT`, `BR`];

var highlightColorNum = 0;

var styleElem = doc.createElement(`style`);
doc.head.appendChild(styleElem);

// DEV ONLY
// Add to textarea code for easy testing
runDev();

// ------------------------------

codeInput.oninput = function () {
  setHeadersDefs();
  isWHolePage = false;
  hasBemWarning = false;
  maxDeep = 1;

  headersMessage.classList.add(`gnr-hidden`);
  headersMessageTree.classList.add(`gnr-hidden`);
  bemMessage.classList.add(`gnr-hidden`);

  createTreeFromHTML(this.value);

  addClassesActions();
};

// ------------------------------

function setHeadersDefs () {
  headersLevels = {
    H1: false,
    H2: false,
    H3: false,
    H4: false,
    H5: false,
    H6: false
    };

  headersList = [];
}

// ------------------------------

function createTreeFromHTML (code) {
  var codeOutput = document.createElement(`div`);

  if (!code) {
    treeContent.classList.add(`gnr-hidden`);
    treePlaceHolder.classList.remove(`gnr-hidden`);
    setRange();
    return;
  }

  // Fix for minified code
  code = code.replace(/></g, `>\n<`);

  bodyClass = getBodyClass(code);

  if (bodyClass) {
    bodyClass.forEach(function (item) {
      item && codeOutput.classList.add(item);
    });
  }
  codeOutput.innerHTML = code;

  var items = makeList(codeOutput, 1);

  if (treeContent.childElementCount > 0) {
    treeContent.removeChild(treeContent.firstElementChild);
  }

  var list = doc.createElement(`ul`);
  list.classList.add(`gnr-level`, `gnr-level--0`);
  list.appendChild(items);
  treeContent.appendChild(list);

  treeContent.classList.remove(`gnr-hidden`);
  treePlaceHolder.classList.add(`gnr-hidden`);

  setRange();

  showCodeErrors();
}

// ------------------------------

function makeList (elem, level) {
  var item = doc.createElement(`li`);
  item.classList.add(`gnr-level__item`);
  var tagName = elem.tagName;
  // elem.className not appropriate for svg
  var className = elem.classList.value;
  elem.classList.forEach = [].forEach;
  elem.children.forEach = [].forEach;

  if (!elem.customDataSet) {
    elem.customDataSet = {
      prefixes: {},
      level: level
    };
  }

  if (level === 1) {
    tagName = `BODY`;
  }

  var liContent = doc.createElement(`div`);
  liContent.classList.add(`gnr-level__elem`, `gnr-elem`);

  var tagSpan = doc.createElement(`span`);
  tagSpan.classList.add(`gnr-elem__tag`);
  tagSpan.innerHTML = tagName;

  // Check headers levels
  if (headersLevels[tagName] !== undefined) {
    headersLevels[tagName] = true;
    headersList.push({
 tagName: tagName,
                        text: elem.innerText
});
  }

  liContent.appendChild(tagSpan);

  addClassesAsPrefixes(elem);

  if (className) {
    checkBemForElem(elem);

    var classSpan = doc.createElement(`span`);
    classSpan.classList.add(`gnr-elem__class`, `gnr-class`);

    elem.classList.forEach(function (classItem, i) {
      var classItemSpan = doc.createElement(`span`);
      classItemSpan.classList.add(`gnr-class__item`);
      classItemSpan.innerHTML += classItem;

      // Check valid Bem naiming
      if (elem.classList.validBem &&
           elem.classList.validBem[classItem] === false) {
        classItemSpan.classList.add(`gnr-highlight-bem`);
      }

      classSpan.appendChild(classItemSpan);

      if (i < elem.classList.length - 1) {
        classSpan.innerHTML += ` `;
      }
    });

    var classDotSpan = doc.createElement(`span`);
    classDotSpan.classList.add(`gnr-class__dot`);
    classDotSpan.innerHTML = `.`;
    liContent.appendChild(classDotSpan);

    liContent.appendChild(classSpan);
  }

  item.appendChild(liContent);

  if (elem.children) {
    var childrenList = doc.createElement(`ul`);
    childrenList.classList.add(`gnr-level`, `gnr-level--` + level);

    level++;

    elem.children.forEach(function (child) {
      checkIsWholePage(child);

      if (!checkIsSkippedTag(child)) {
        var newElem = makeList(child, level);

        if (newElem) {
          childrenList.appendChild(newElem);
        }
      }
    });

    if (childrenList.children.length > 0) {
      if (level > maxDeep) {
        maxDeep = level;
      }

      item.appendChild(childrenList);
    }
  }

  return item;
}

// ------------------------------

function addClassesActions () {
  var colors = [`aqua`, `lime`, `yellow`, `fuchsia`];

  var classItemSpanList = document.querySelectorAll(`.gnr-class__item`);

  classItemSpanList.forEach(function (classItemSpan) {
    classItemSpan.onclick = function () {
      var color = colors[highlightColorNum];

      if (this.dataset.color && this.dataset.color !== ``) {
        color = ``;
      }

      this.dataset.color = color;
    };
  });
}

// ------------------------------

function checkBemForElem (elem) {
  // elem.className not appropriate for svg
  var className = elem.classList.value;
  elem.classList.forEach = [].forEach;

  if (className.indexOf(`__`) < 0 &&
       className.indexOf(`--`) < 0) {
    return;
  }

  elem.classList.validBem = {};
  elem.classList.forEach(function (classItem) {
    // Check first part of class with __ (block name)
    if (classItem.split(`__`).length > 1) {
      var prefixCorrect = false;
      var prefix = classItem.split(`__`)[0];

      if (elem.customDataSet.prefixes[prefix]) {
        prefixCorrect = true;
      }

      elem.classList.validBem[classItem] = prefixCorrect;

      if (!prefixCorrect) {
        hasBemWarning = true;
      }
    }

    // Check first part of class with -- (modificator)
    if (classItem.split(`--`).length > 1) {
      var modifPrefixCorrect = false;
      var modifPrefix = classItem.split(`--`)[0];

      if (elem.classList.contains(modifPrefix)) {
        modifPrefixCorrect = true;
      }

      elem.classList.validBem[classItem] = modifPrefixCorrect;

      if (!modifPrefixCorrect) {
        hasBemWarning = true;
      }
    }
  });
}

// ------------------------------

function addClassesAsPrefixes (elem) {
  var classList = elem.classList;
  classList.forEach = [].forEach;

  copyPrefixes(elem);

  classList.forEach(function (classItem) {
    // Copy only block names
    if (classItem.split(`__`).length === 1 &&
         classItem.split(`--`).length === 1) {
      elem.customDataSet.prefixes[classItem] = classItem;
    }
  });
}

// ------------------------------

function copyPrefixes (elem) {
  var parent = elem.parentNode;

  if (!parent) {
    return;
  }

  for (var prefix in parent.customDataSet.prefixes) {
    elem.customDataSet.prefixes[prefix] = prefix;
  }
}

// ------------------------------

function setRange () {
  rangeDeep.max = maxDeep;
  rangeDeep.value = maxDeep;
  valDeep.innerHTML = maxDeep;
}

// ------------------------------

rangeDeep.oninput = function () {
  var level = +this.value;
  var styles = `.gnr-level--` + level + `{ display: none }`;
  styleElem.innerHTML = styles;
  valDeep.innerHTML = this.value;
};

// ------------------------------

function showCodeErrors () {
  showBemMessage();
  checkHeadersLevels();
  printHeadersTree();
}

// ------------------------------

function showBemMessage () {
  bemMessage.classList.toggle(`gnr-hidden`, !hasBemWarning);
}

// ------------------------------

function checkHeadersLevels () {
  var isWrongOrder = false;
  var realOrder = doc.createElement(`dl`);
  realOrder.classList.add(`headers__list`);
  var maxUsedHeaders = 0;
  var tempHeadersStack = 0;
  var longestHeadersStack = 0;

  var realOrderDt = doc.createElement(`dt`);
  realOrderDt.classList.add(`headers__title`);
  realOrderDt.innerHTML = `Заголовки: `;
  realOrder.appendChild(realOrderDt);

  for (var key in headersLevels) {
      if (headersLevels[key]) {
        maxUsedHeaders++;
        tempHeadersStack++;
      } else {
        if (longestHeadersStack < tempHeadersStack) {
          longestHeadersStack = tempHeadersStack;
        }
        tempHeadersStack = 0;
      }
  }

  if (maxUsedHeaders > longestHeadersStack) {
    isWrongOrder = true;
  } else if (isWHolePage && !headersLevels.H1) {
   isWrongOrder = true;
  }

  if (isWrongOrder) {
    headersOrder.forEach(function (headerItem) {
      var headerItemSpan = doc.createElement(`dd`);
      headerItemSpan.classList.add(`headers__item`);
      headerItemSpan.innerHTML = headerItem;

      if (headersLevels[headerItem]) {
        headerItemSpan.classList.add(`headers__item--found`);
      } else {
        headerItemSpan.classList.add(`headers__item--notfound`);
      }

      realOrder.appendChild(headerItemSpan);
    });

    if (headersMessageContent.firstChild) {
      headersMessageContent.removeChild(headersMessageContent.firstChild);
    }
    headersMessageContent.appendChild(realOrder);
  }

  headersMessage.classList.toggle(`gnr-hidden`, !isWrongOrder);
}

// ------------------------------

function printHeadersTree () {
  var out = ``;

  if (headersList.length === 0) {
    return;
  }

  for (var i = 0; i < headersList.length; i++) {
    var tag = headersList[i].tagName;
    var text = headersList[i].text;

    out += `<` + tag + `><span>` + tag + `</span> ` + text + `</` + tag + `>`;
  }

  headersMessageTreeContent.innerHTML = out;
  headersMessageTree.classList.remove(`gnr-hidden`);
}

// ------------------------------

function checkIsSkippedTag (elem) {
  return skippedTags.indexOf(elem.tagName) >= 0;
}

// ------------------------------

function checkIsWholePage (elem) {
  if (wholePageMarkers.indexOf(elem.tagName) >= 0) {
    isWHolePage = true;
  }
}

// ------------------------------

function getBodyClass (code) {
  var result = code.match(/<body[^>]*class="(.*)"/);

  if (result) {
    return result[1].split(` `);
  }

  return ``;
}

// ------------------------------

function runDev () {
  var testMarkup = `<h1 class="page__title">Title</h1><div class="wrapper"><section class="prices1"><div><h2 class="prices__title">Title</h2><div class="prices__content prices__content--disabled">Content</div></div></section><section class="reviews"><div><h2 class="reviews__title">Title</h2><div class="reviews__content">Content</div></div></section><footer class="footer"><div><h2 class="footer__title">Footer Title</h2><div class="footer__content"><h4 class="footer__subtitle">Footer SubTitle</h4>Footer Content</div></div></footer></div></div>`;
  codeInput.value = testMarkup;
  setHeadersDefs();
  hasBemWarning = false;
  createTreeFromHTML(testMarkup);
}
