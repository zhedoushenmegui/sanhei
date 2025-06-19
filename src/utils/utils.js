export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function deepCopy(source) {
  if (isArray(source)) {
    var arr = [];
    source.forEach(function (v, k) {
      arr[k] = deepCopy(v)
    });
    return arr;
  } else if (typeof source === 'object') {
    var result = {};
    for (var key in source) {
      result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
    }
    return result;
  } else {
    return source;
  }
}

export function base64Encoder(e) {
  var t, n, o, r, a, i, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  e += "";
  for (o = e.length, n = 0, t = ""; o > n;) {
    if (r = 255 & e.charCodeAt(n++), n == o) {
      t += u.charAt(r >> 2), t += u.charAt((3 & r) << 4), t += "==";
      break;
    }
    if (a = e.charCodeAt(n++), n == o) {
      t += u.charAt(r >> 2), t += u.charAt((3 & r) << 4 | (240 & a) >> 4), t += u.charAt((15 & a) << 2), t += "=";
      break;
    }
    i = e.charCodeAt(n++), t += u.charAt(r >> 2), t += u.charAt((3 & r) << 4 | (240 & a) >> 4), t += u.charAt((15 & a) << 2 | (192 & i) >> 6), t += u.charAt(63 & i)
  }
  return t
}

export function base64Decoder(str) {
  var c1, c2, c3, c4;
  var base64DecodeChars = [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
    58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
    37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
    -1, -1];
  var i = 0, len = str.length, string = '';

  while (i < len) {
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (
        i < len && c1 == -1
        );

    if (c1 == -1) break;

    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (
        i < len && c2 == -1
        );

    if (c2 == -1) break;

    string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61)
        return string;

      c3 = base64DecodeChars[c3]
    } while (
        i < len && c3 == -1
        );

    if (c3 == -1) break;

    string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61) return string;
      c4 = base64DecodeChars[c4]
    } while (
        i < len && c4 == -1
        );

    if (c4 == -1) break;

    string += String.fromCharCode(((c3 & 0x03) << 6) | c4)
  }
  return string;
}



function funcGetQuery(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return null;
}
function funcGetHash(variable) {
  let rst = null;
  location.hash.substring(1).split("&").forEach((s) => {
    let pair = s.split("=");
    if (pair[0] === variable) {
      rst = pair[1];
    }
  });
  return rst;
}
function funcUpdateQuery(key, val) {
  let dict = {};
  location.search.substring(1).split("&").forEach((s) => {
    let pair = s.split("=");
    if (pair.length === 2) {
      dict[pair[0]] = pair[1];
    }
  });
  dict[key] = val;
  let arr = [];
  for (const [key1, val1] of Object.entries(dict)) {
    arr.push(key1 + '='+ val1)
  }
  location.search = '?' + arr.join('&');
}
function funcUpdateQuery2(search, newdict) {
  let dict = {};
  search.substring(1).split("&").forEach((s) => {
    let pair = s.split("=");
    if (pair.length === 2) {
      dict[pair[0]] = pair[1];
    }
  });
  for(const [key1, val1] of Object.entries(newdict)) {
    if(val1 !== undefined && val1 !== null) {
      dict[key1] = val1;
    }
  }
  let arr = [];
  for (const [key1, val1] of Object.entries(dict)) {
    arr.push(key1 + '='+ val1)
  }
  return  '?' + arr.join('&');
}
function funcUpdateHash(key, val) {
  let dict = {};
  location.hash.substring(1).split("&").forEach((s) => {
    let pair = s.split("=");
    if (pair.length === 2) {
      dict[pair[0]] = pair[1];
    }
  });
  dict[key] = val;
  let arr = [];
  for (const [key1, val1] of Object.entries(dict)) {
    arr.push(key1 + '=' + val1)
  }
  location.hash = '#' + arr.join('&');
}
function funcRemoveHash(key) {
  let dict = {};
  location.hash.substring(1).split("&").forEach((s) => {
    let pair = s.split("=");
    if (pair.length === 2) {
      dict[pair[0]] = pair[1];
    }
  });
  let arr = [];
  for (const [key1, val1] of Object.entries(dict)) {
    if (key1 !== key) {
      arr.push(key1 + '=' + val1)
    }
  }
  location.hash = '#' + arr.join('&');
}
function stringShrink(s, length) {
  if (s && s.length) {
    return s.length > length ? s.substring(0, length) + '...' : s;
  }
  return s
}

function csvStringify(s) {
  return '"' + s.trim().replace('"', '""') + '"';
}
function downloadCSVProcess(str, name) {
  //encodeURIComponent解决中文乱码
  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement("a");
  link.href = uri;
  //对下载的文件命名
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default {
  getQueryVariable: funcGetQuery,
  getHashVariable: funcGetHash,
  updateHash:funcUpdateHash,
  updateQuery: funcUpdateQuery,
  calQuery: funcUpdateQuery2,
  removeHash: funcRemoveHash,
  ss: stringShrink,
}

