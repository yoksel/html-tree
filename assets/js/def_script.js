var doc = document;
var wrapper = doc.getElem('.wrapper');

var styles = doc.createElem('style');
doc.head.addElem(styles);

var cells;
var cellsContent;
var matrix = [];
var cellsList = [];
var cellsNum;

var range;
var output;
var size = {};

var paletteElem;
var colorsList = [
    'darkred',
    'brown',
    'orangered',
    'crimson',
    'orange',
    'yellow',
    'chartreuse',
    'limegreen',
    'green',
    'lightgreen',
    'mediumseagreen',
    'seagreen',
    'darkslategray',
    'lightskyblue',
    'dodgerblue',
    'blue',
    'mediumblue',
    'darkblue',
    'mediumpurple',
    'rebeccapurple',
    'indigo',
    'burlywood',
    'peru',
    'chocolate',
    'saddlebrown',
    'silver',
    'gray',
    'black'
];
var currentColor = {
    pos: 0,
    name: colorsList[0]
};

// console.dir( wrapper );

//------------------------------

function createRange() {
    var rangeDefault = 7;
    range = doc.createElem('input');
    range.setAttr({
        'type': 'range',
        'min': 5,
        'max': 10,
        'step': 1,
        'value': rangeDefault
    });

    cellsNum = doc.createElem('span');
    cellsNum.classList.add('cells-in-line');
    cellsNum.innerHTML = rangeDefault;

    wrapper.addElem(range);
    wrapper.addElem(cellsNum);

    range.oninput = function() {
        output.value = '';
        resetField(this.value);
    }
}

//------------------------------

function resetField(cellsNewNum) {
    cellsNum.innerHTML = cellsNewNum;
    size.matrix = Number(cellsNewNum);
    size.cell = size.cells / size.matrix;

    matrix = [];
    cellsList = [];
    cellsContent.remove();

    createField();
    createStyles();
}

//------------------------------

function createCells() {
    cells = doc.createElem('div');
    cells.classList.add('cells')

    wrapper.addElem(cells);
}

//------------------------------

function createOut() {
    output = doc.createElem('textarea');
    output.classList.add('output');
    wrapper.addElem(output);

    output.oninput = function() {
        refillCells(this.value);
    }

    // console.log('------------');
}

//------------------------------

function clearArray(arr) {
    var newArray = [];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
            newArray.push(arr[i]);
        }
    }

    return newArray;
}

//------------------------------

function refillCells(value) {
    var inputList = value.split('[');
    inputList = clearArray(inputList);
    var realY = 0;

    resetField(inputList.length);

    for (var y = 0; y < inputList.length; y++) {
        var xLine = inputList[y];

        if (xLine) {
            var xLineList = xLine.replace(']', '').split(',');

            for (var x = 0; x < xLineList.length; x++) {
                var xVal = parseInt(xLineList[x], 10);

                if (!isNaN(xVal)) {

                    matrix[realY][x] = xVal;

                    var chBox = cellsList[realY][x];
                    if (xVal) {
                        chBox.checked = true;
                    }
                }
            }
            realY++;
        }
    }
}

//------------------------------

function setSizes() {

    size = {
        matrix: Number(range.value),
        cells: cells.clientWidth
    };

    size.cell = size.cells / size.matrix;

}

//------------------------------

function createStyles() {
    var stylesSet = [
        'width: ' + size.cell + 'px',
        'height: ' + size.cell + 'px'
    ].join(';');
    var style = '\n.cell {' + stylesSet + '}';
    styles.innerHTML += style;
}

//------------------------------

function createColorsStyles() {

    var stylesList = [];

    for (var x = 0; x < colorsList.length; x++) {
        var color = colorsList[x];
        var style = '.bg-' + color + ' { background: ' + color + '; }';
        stylesList.push(style);
    }

    styles.innerHTML += stylesList.join('\n');

    var cellSize = paletteElem.clientWidth / colorsList.length + 'px';
    var styleSize = '\n.palette .cell { width: ' + cellSize + '; height: ' + cellSize + '; }';

    styles.innerHTML += styleSize;

    console.log(styles);
    console.dir(paletteElem);
}

//------------------------------

function createField() {
    var counter = 0;
    var actionFunc = changeMatrix;

    cellsContent = doc.createElem('div');
    cellsContent.classList.add('cells-content');

    for (var y = 0; y < size.matrix; y++) {
        if (!matrix[y]) {
            matrix[y] = [];
        }

        if (!cellsList[y]) {
            cellsList[y] = [];
        }

        for (var x = 0; x < size.matrix; x++) {
            var params = {
                x: x,
                y: y,
                counter: counter,
                actionFunc: actionFunc,
                group: 'cells'
            };
            var cell = new Cell(params);
            var cellElem = cell.create();

            matrix[y][x] = 0;
            cellsList[y][x] = cell.checkBox;

            cellsContent.addElem(cellElem);
            counter++;
        }
    }

    cells.addElem(cellsContent);
}

//------------------------------

function Cell( params ) {
    this.params = params;
    this.x = params.x;
    this.y = params.y;
    this.counter = params.counter;
    this.actionFunc = params.actionFunc;
    this.color = params.color;
}

//------------------------------

function getChboxId( params ) {
    var x = params.x;
    var y = params.y;
    var group = params.group;
    return group + '-chbox--x' + x + '-y' + y;
}

//------------------------------

Cell.prototype.create = function() {
    var x = this.x;
    var y = this.y;
    var elemId = getChboxId( this.params );
    var color = this.color;
    var actionFunc = this.actionFunc;
    var that = this;

    this.elem = doc.createElem('div');
    this.elem.classList.add('cell');

    if (this.color) {
        this.elem.classList.add('bg-' + this.color);
    }

    this.checkBox = doc.createElem('input');
    this.checkBox.setAttr({
        'type': 'checkbox',
        'id': elemId
    });

    this.checkBox.onclick = function() {
        that.actionFunc( that.params );
    }

    this.label = doc.createElem('label');
    this.label.classList.add('label');
    this.label.setAttr({
        'for': elemId
    });

    this.elem.addElem(this.checkBox);
    this.elem.addElem(this.label);

    return this.elem;
}

//------------------------------

function changeMatrix( params ) {
    var x = params.x;
    var y = params.y;

    if (!matrix[y]) {
        matrix[y] = [];
    }

    if (matrix[y][x] === 1) {
        matrix[y][x] = 0;
    } else {
        matrix[y][x] = 1;
    }

    fillOutput();
}

//------------------------------

function changeCurrentColor( params ) {
    //currentColor
    currentColor = params.color;

    console.log( currentColor );
}

//------------------------------

function fillOutput() {
    var out = '';

    var yList = [];
    for (var y = 0; y < matrix.length; y++) {
        if (matrix[y]) {
            var xOut = matrix[y].join(',');
            yList.push('[' + xOut + ']');
        }
    }

    out = yList.join(',\n');
    output.value = out;
}

//------------------------------

function createPalette() {
    var counter = 0;
    var actionFunc = changeCurrentColor;

    paletteElem = doc.createElem('div');
    paletteElem.classList.add('palette');

    for (var x = 0; x < colorsList.length; x++) {

        var params = {
            x: x,
            y: 0,
            counter: counter,
            actionFunc: actionFunc,
            color: colorsList[x],
            group: 'palette'
        };
        var cell = new Cell(params);
        var cellElem = cell.create();

        //matrix[x] = 0;
        cellsList[x] = cell.checkBox;

        paletteElem.addElem(cellElem);
        counter++;

    }
    //colorsList

    wrapper.addElem(paletteElem);
    createColorsStyles();
}

//------------------------------

createRange();
createCells();
createOut();
createPalette();
setSizes();
createStyles();
createField();