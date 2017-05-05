function DOMNodeCollection(htmlEls) {
  this.htmlEls = htmlEls;
}

DOMNodeCollection.prototype.each = function (callback) {
  this.htmlEls.forEach((htmlElement) => {
    callback(htmlElement);
  });
};

DOMNodeCollection.prototype.html = function (string) {
  if (string) {
    this.each((htmlElement) => {
      htmlelement.innerHTML = string;
    });
  } else {
    return this.htmlEls[0].innerHTML;
  }
}

DOMNodeCollection.prototype.empty = function () {
  this.each((htmlElement) => {
    htmlElement.innerHTML = '';
  });
};

DOMNodeCollection.prototype.append = function (children) {
  this.each( (htmlElement) => {
    if (children instanceof DOMNodeCollection) {
      children.htmlEls.forEach( (child) => {
        htmlElement.innerHTML += child.outerHTML;
      })
    } else if (children instanceof HTMLElement) {
      htmlElement.innerHTML += children.outerHTML;
    } else if (typeof children === "string") {
      htmlElement.innerHTML += children;
    }
  })
};

DOMNodeCollection.prototype.attr = function (attributeName, value) {
  if (value) {
    this.each((htmlElement) => {
      htmlElement.setAttribute(attributeName, value);
    })
  } else {
    return this.htmlEls[0].getAttribute(attributeName)
  }
}

DOMNodeCollection.prototype.addClass = function (className) {
  this.each((htmlElement) => {
    htmlElement.classList.add(className);
  })
}

DOMNodeCollection.prototype.removeClass = function (className) {
  this.each((htmlElement) => {
    htmlElement.classList.remove(className);
  })
}

DOMNodeCollection.prototype.children = function (className) {
  const childEls = [];
  this.each((htmlElement) => {
    for (var item of htmlElement.children) {
      childEls.push(item);
    }
  });
  return new DOMNodeCollection(childEls);
}

DOMNodeCollection.prototype.parent = function (className) {
  const parents = [];
  this.each((htmlElement) => {
    if (!parents.includes(htmlElement.parentNode)) {
      parents.push(htmlElement.parentNode);
    }
  });
  return new DOMNodeCollection(parents);
}

DOMNodeCollection.prototype.find = function (selector) {
  if (typeof selector === "string") {
    let elementList = [];
    this.each( (htmlElement) => {
      elementList = elementList.concat([...htmlElement.querySelectorAll(selector)]);
    });
    return new DOMNodeCollection(elementList);
  }
}

DOMNodeCollection.prototype.remove = function () {
  this.each((htmlElement) => {
    htmlElement.remove();
  });
  debugger
  this.htmlEls = [];
};

DOMNodeCollection.prototype.on = function (type, handler) {
  this.each((htmlElement) => {
    htmlElement[type] = handler;
    htmlElement.addEventListener(type, handler)
  });
};

DOMNodeCollection.prototype.off = function (type) {
  this.each((htmlElement) => {
    htmlElement.removeEventListener(type, htmlElement[type])
  });

  this[type] = null;
};



module.exports = DOMNodeCollection;
