function makeTextNode(text) {
    var ele = document.createElement('span');
    ele.innerHTML = text;
    
    return ele;
}

module.exports = makeTextNode;