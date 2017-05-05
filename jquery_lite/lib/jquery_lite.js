/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1)

const functions = [];

document.addEventListener("DOMContentLoaded", function(event){
  functions.forEach((fn) => {
    fn.call(null)
  });
});

const $l = function (argument) {
  if (typeof argument === "string") {
    const elementList = [...document.querySelectorAll(argument)];
    return new DOMNodeCollection(elementList);
  } else if (argument instanceof(HTMLElement)) {
    return new DOMNodeCollection([argument]);
  } else if (argument instanceof Function) {
    functions.push(argument)
  }

}

$l.extend = function (...objs) {
  Object.assign(objs);
}


$l.ajax = function (options) {
  let defaults = {
    method: "GET",
    url: window.location.href,
    data: {},
    success: () => {},
    error: () => {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  Object.assign(defaults, options);

  const xhr = new XMLHttpRequest();
  xhr.open(defaults.method, defaults.url);
  const optionalData = defaults.data;
  xhr.onload = function () {
    defaults.success(JSON.parse(xhr.response));
  }
  xhr.onerror = function () {
    defaults.error(JSON.parse(xhr.response));
  }
  xhr.send(optionalData);
};

window.$l = $l
window.DOMNodeCollection = DOMNodeCollection;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);