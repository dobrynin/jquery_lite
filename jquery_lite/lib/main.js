const DOMNodeCollection = require('./dom_node_collection.js')

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
