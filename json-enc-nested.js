htmx.defineExtension('json-enc-nested', {
  onEvent: function (name, evt) {
    if (name === "htmx:configRequest") {
      evt.detail.headers['Content-Type'] = "application/json";
    }
  },

  encodeParameters: function (xhr, parameters, elt) {
    xhr.overrideMimeType('text/json');

    parameters =
      Object.keys(parameters).reduce(function (prev, key) {
        const value = parameters[key];

        let i = key.indexOf('[');
        if (i > 0) {
          const path = [key.slice(0, i)];
          let j = key.indexOf(']', i + 1);
          while (j > 0) {
            if (j === i + 1) {
              prev[key] = value;
              return prev;
            }

            path.push(key.slice(i + 1, j));
            i = key.indexOf('[', j + 1);
            if (i < 0) {
              break;
            }

            j = key.indexOf(']', i + 1);
          }

          if (j !== key.length - 1) {
            prev[key] = value;
            return prev;
          }

          let oo = prev;
          while (path.length > 1) {
            let key = path.shift()
            if (typeof oo[key] === "object") {
              oo = oo[key];
            } else {
              oo[key] = {};
              oo = oo[key];
            }
          }

          oo[path[0]] = value;
          return prev;
        }

        prev[key] = value;
        return prev;
      }, {});

    return (JSON.stringify(parameters));
  }
});
