//var ns_root = window;

var _j_document = $(document);
var _j_window = $(window);

function GetBrowserInfo() {

    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {
            name: 'IE',
            version: (tem[1] || '')
        };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem != null)
            return {
                name: 'Opera',
                version: tem[1]
            };
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null)
        M.splice(1, 1, tem[1]);
    return {
        name: M[0],
        version: M[1]
    };
}

//ns_root.GetBrowserInfo = GetBrowserInfo;
// -----------------------------------------------------------------

var browser_info = GetBrowserInfo();
if (browser_info.name !== "MSIE") {

    (function (ns_root) {

        var _root_namespace = ns_root;

        /*!
* JavaScript Cookie v2.0.4
* https://github.com/js-cookie/js-cookie
*
* Copyright 2006, 2015 Klaus Hartl & Fagner Brack
* Released under the MIT license
*/
        (function (factory) {
            if (typeof window.define === 'function' && window.define.amd) {
                window.define(factory);
            } else if (typeof exports === 'object') {
                window.module.exports = factory();
            } else {
                var old_cookies = window.Cookies;
                var api = window.Cookies = factory();
                api.noConflict = function () {
                    window.Cookies = old_cookies;
                    return api;
                };
            }
        }(function () {
            function extend() {
                var i = 0;
                var result = {};
                for (; i < arguments.length; i++) {
                    var attributes = arguments[i];
                    for (var key in attributes) {
                        result[key] = attributes[key];
                    }
                }
                return result;
            }

            function init(converter) {
                function set(key, value, attributes) {
                    var result;
                    attributes = extend({
                        path: '/'
                    }, re.defaults, attributes);
                    if (typeof attributes.expires === 'number') {
                        var expires = new Date();
                        expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                        attributes.expires = expires;
                    }
                    try {
                        result = JSON.stringify(value);
                        if (/^[\{\[]/.test(result)) {
                            value = result;
                        }
                    } catch (e) {
                    }
                    value = encodeURIComponent(String(value));
                    value = value.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                    key = encodeURIComponent(String(key));
                    key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                    key = key.replace(/[\(\)]/g, window.escape);
                    return (document.cookie = [key, '=', value, attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                        attributes.path && '; path=' + attributes.path, attributes.domain && '; domain=' + attributes.domain, attributes.secure ? '; secure' : ''].join(''));
                }

                function get(key, value, attributes) {
                    var result;
                    if (!key)
                        result = {};
                    var cookies = document.cookie ? document.cookie.split('; ') : [];
                    var rdecode = /(%[0-9A-Z]{2})+/g;
                    var i = 0;
                    for (; i < cookies.length; i++) {
                        var parts = cookies[i].split('=');
                        var name = parts[0].replace(rdecode, decodeURIComponent);
                        var cookie = parts.slice(1).join('=');
                        if (cookie.charAt(0) === '"')
                            cookie = cookie.slice(1, -1);
                        try {
                            cookie = converter && converter(cookie, name) || cookie.replace(rdecode, decodeURIComponent);
                            if (this.json) {
                                try {
                                    cookie = JSON.parse(cookie);
                                } catch (e) {
                                }
                            }
                            if (key === name) {
                                result = cookie;
                                break;
                            }
                            if (!key)
                                result[name] = cookie;
                        } catch (e) {
                        }
                    }
                    return result;
                }

                var re = {};
                re.get = get;
                re.set = set;
                re.getJSON = function () {
                    return re.apply({
                        json: true
                    }, [].slice.call(arguments));
                };
                re.defaults = {};
                re.remove = function (key, attributes) {
                    re(key, '', extend(attributes, {
                        expires: -1
                    }));
                };
                re.withConverter = init;
                return re;
            }

            return init();
        }));


        // local

        function Defined(x) {
            return (typeof x !== 'undefined');
        }

        function EnsureDefined(x) {
            if (Defined(x) !== true)
                Err();
            return x;
        }

        function HasValue(x) {
            return (Defined(x) === true && x != null);
        }

        ns_root.HasValue = HasValue;

        function EnsureValue(x) {
            if (HasValue(x) !== true)
                Err();
            return x;
        }

        function EnsureValues() {
            var array_argument = IsArray(arguments[0]);
            if (array_argument === true && arguments.length !== 1)
                Err();
            var items = array_argument ? arguments[0] : arguments;
            for (var i = 0; i < items.length; ++i)
                if (HasValue(items[i]) !== true)
                    return false;
        }

        function EnsureNumbers() {
            var array_argument = IsArray(arguments[0]);
            if (array_argument === true && arguments.length !== 1)
                Err();
            var items = array_argument ? arguments[0] : arguments;
            for (var i = 0; i < items.length; ++i)
                if (HasValue(items[i]) !== true || window.isNaN(items[i]) === true)
                    return false;
        }

        function HasMembers(x) {
            if (HasValue(x) !== true || arguments.length < 2)
                return false;
            var args = Array.prototype.slice.call(arguments, 1);
            var items = IsArray(args[0]) ? args[0] : args;
            for (var i = 0; i < items.length; ++i)
                if (HasValue(x[items[i]]) !== true)
                    return false;
            return true;
        }

        function EnsureMembers(x) {
            if (HasValue(x) !== true)
                Err('Object not specified');
            if (arguments.length < 2)
                Err('At least two arguments expected');
            var args = Array.prototype.slice.call(arguments, 1);
            var items = IsArray(args[0]) ? args[0] : args;
            for (var i = 0; i < items.length; ++i)
                if (HasValue(x[items[i]]) !== true)
                    Err();
            return x;
        }

        function IsFunc(fn) {
            return (HasValue(fn) === true && (typeof fn === 'function'));
        }

        // is there need for HasValue() here?
        function EnsureFunc(fn) {
            if (IsFunc(fn) !== true)
                Err('Argument is not a function');
            return fn;
        }

        function IsJQuery(j) {
            return (j instanceof jQuery);
        }

        // || jquery in Object(obj);
        function IsArray(a) {
            return (HasValue(a) === true && a.constructor === Array);
        }

        function EnsureArray(a) {
            if (IsArray(a) !== true)
                Err('Argument is not an array');
            return a;
        }

        function EnsureArrayOrDefault(a) {
            if (HasValue(a) !== true)
                return [];
            return EnsureArray(a);
        }

        function IsNumber(n) {
            return IsInt(n) || IsFloat(n);
        }

        function EnsureNumber(n) {
            if (IsNumber(n) !== true)
                Err();
            return n;
        }

        function IsFloat(n) {
            return n === +n && n !== (n | 0);
        }

        function EnsureFloat(n) {
            if (IsFloat(n) !== true)
                Err();
            return n;
        }

        function IsInt(n) {
            return n === +n && n === (n | 0);
        }

        function EnsureInt(n) {
            if (IsInt(n) !== true)
                Err();
            return n;
        }

        function IsString(s) {
            return ((typeof s === 'string') || (s instanceof String));
        }

        function EnsureString(s) {
            if (IsString(s) !== true)
                Err();
            return s;
        }

        function EnsureStringValue(s) {
            if (IsString(s) !== true || s.length < 1)
                Err();
            return s;
        }

        function LeadingZero2(arg) {
            return ('0' + arg).slice(-2);
        }

        function LeadingZero3(arg) {
            return ('00' + arg).slice(-3);
        }

        function Freeze(o) {
            return Object.freeze(o);
        }

        function Seal(o) {
            return Object.seal(o);
        }

        function DeleteArrayElems(a) {
            EnsureArray(a);
            for (var i = 0; i < a.length; ++i)
                delete a[i];
        }

        function NoOp() {
        }

        function GetTime() {
            var dt = new Date();
            return Fmt('{0}:{1}:{2}.{3}', LeadingZero2(dt.getHours()), LeadingZero2(dt.getMinutes()), LeadingZero2(dt.getSeconds()), LeadingZero3(dt.getMilliseconds()));
        }

        function TagTxt(text) {
            return document.createTextNode(text);
        }

        function TagSVG(tag) {
            return $(document.createElementNS('http://www.w3.org/2000/svg', tag));
        }

        function Tag(tag_name, attrs, hotfix) {
            if (HasValue(tag_name) === false || !IsString(tag_name) || tag_name.length < 1)
                Err('tag_name');
            var local_tag_name;
            if (tag_name[0] === '$') {
                if (tag_name.length < 2)
                    return TagTxt(attrs);
                if (tag_name.length === 3 && tag_name[1] === '_' && IsNumber(tag_name[2]))
                    return TagTxt(attrs);
                local_tag_name = tag_name.substr(1);
            } else {
                local_tag_name = tag_name;
            }
            var re = !hotfix ? $(document.createElement(local_tag_name)) : $(document.createElementNS('http://www.w3.org/2000/svg', local_tag_name));
            if (HasValue(attrs) === false)
                return re;
            var props = Object.getOwnPropertyNames(attrs);
            if (props.length < 1)
                return re;
            var pass_attrs = {};
            for (var i = 0; i < props.length; ++i) {
                var pname = props[i];
                var pval = attrs[props[i]];
                if (pname[0] === '$') {
                    var tail_idx = pname.indexOf('_');
                    if (tail_idx >= 0)
                        pname = pname.substring(0, tail_idx);
                    if (IsArray(pval)) {
                        for (var pval_i = 0; pval_i < pval.length; ++pval_i)
                            re.append(Tag(pname, pval[pval_i], hotfix));
                    } else {
                        re.append(Tag(pname, pval, hotfix));
                    }
                } else if (pname.match(/^_[0-9]+$/)) {
                    if (HasValue(pval)) {
                        if (IsJQuery(pval))
                            re.append(pval);
                        else
                            Err('Not a jQuery object in numeric property');
                    }
                } else if (pname === 'style') {
                    re.css(pval);
                } else if (pname === '_data') {
                    re.data(pval.K, pval.V);
                } else {
                    pass_attrs[props[i]] = attrs[props[i]];
                }
            }
            re.attr(pass_attrs);
            return re;
        }

        ns_root.Tag = Tag;

        function GetScrollDirection(mouse_event) {
            return HasValue(mouse_event.originalEvent.wheelDelta) ? (mouse_event.originalEvent.wheelDelta / 120 > 0) : mouse_event.originalEvent.detail < 0;
        }

        function DelayedCallFactory(fn, delay, ctx) {
            var timer = null;
            var context = HasValue(ctx) ? ctx : this;
            return function () {
                var args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        }

        function Fit2(x_what, y_what, x_where, y_where) {
            var new_x, new_y;
            var what_ratio = x_what / y_what;
            var diff_x = x_what - x_where;
            var up = diff_x < 0;
            new_x = x_where;
            new_y = up ? y_what + Math.abs(diff_x) / what_ratio : y_what - Math.abs(diff_x) / what_ratio;
            if (new_y > y_where) {
                what_ratio = y_what / x_what;
                var diff_y = y_what - y_where;
                up = diff_y < 0;
                new_y = y_where;
                new_x = up ? x_what + Math.abs(diff_y) / what_ratio : x_what - Math.abs(diff_y) / what_ratio;
            }
            return {
                x: new_x,
                y: new_y
            };
        }

        function StopAllVideos() {
            Log1();
            _cell_controllers.Each(function (cc) {
                cc.StopVideo();
            });
        }

        function StopAll() {
            Log1();
            if (window.stop !== undefined)
                window.stop();
            else if (document.execCommand !== undefined)
                document.execCommand('Stop', false);
        }

        function Guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }

            return s4();
        }

        function Round(f) {
            return Math.round(f * 100) / 100;
        }

        function InvokeCallbackArray(cb_array) {
            EnsureArray(cb_array);
            var pass_args = null;
            if (arguments.length > 1)
                pass_args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < cb_array.length; ++i) {
                // 'this' is passed as-is here?
                try {
                    cb_array[i].apply(this, pass_args);
                } catch (err) {
                    Log1(Trace(err));
                }
            }
        }

        function StartsWith(string, prefix) {
            return string.slice(0, prefix.length) === prefix;
        }

        void function () {
            if ('dispose' in ArrayBuffer.prototype)
                return;
            var blob = new Blob([''], {
                type: 'text/javascript'
            });
            var url = URL.createObjectURL(blob);
            var worker = new Worker(url);
            URL.revokeObjectURL(url);
            Object.defineProperty(ArrayBuffer.prototype, 'dispose', {
                writable: true,
                enumerable: false,
                value: function () {
                    worker.postMessage(this, [this]);
                }
            });
        }();

        function DisposeVideoElem(elem) {
            if (HasValue(elem) === false)
                return;
            Log1();
            if (elem.toString() === 'BufferedVideo { }') {
                elem.Dispose();
                return;
            }
            var smth = elem.data('event_state_object');
            if (HasValue(smth))
                smth.Deleted = true;
            try {
                elem.stop();
            } catch (e) {
            }
            try {
                elem[0].pause();
            } catch (e) {
            }
            try {
                elem[0].src = '';
            } catch (e) {
            }
            try {
                elem.remove();
            } catch (e) {
            }
            delete elem;
            elem = null;
        }

        function CSize(x, y) {
            var _X = x;
            var _Y = y;

            function GetX() {
                return _X;
            }

            function SetX(v) {
                _X = v;
            }

            function GetY() {
                return _Y;
            }

            function SetY(v) {
                _Y = v;
            }

            Object.defineProperties(this, {
                Width: {
                    get: GetX,
                    set: SetX,
                    enumerable: true
                },
                Height: {
                    get: GetY,
                    set: SetY,
                    enumerable: true
                },
                X: {
                    get: GetX,
                    set: SetX,
                    enumerable: true
                },
                Y: {
                    get: GetY,
                    set: SetY,
                    enumerable: true
                }
            });
            {
                Freeze(this);
            }
        }

        var _g = Freeze({
            Colors: Freeze({
                StandoutHigh: '#33b5e5',
                CellSelected: '#222',
                CellStalled: '#300',
                CellDefault: '#000',
                DefaultBackground: '#000'
            }),
            Constants: Freeze({
                SideMenuWidth: 300,
                MainHeaderHeight: 40
            }),
            PtzCaps: Freeze({
                None: 0,
                Known: 1 << 1,
                PanTilt: 1 << 2,
                Zoom: 1 << 3,
                Focus: 1 << 4,
                AutoFocus: 1 << 5,
                Iris: 1 << 6,
                AutoIris: 1 << 7,
                OverwritePreset: 1 << 8
            }),
            PtzMode: Freeze({
                Selected: 1,
                Always: 2,
                Never: 3
            }),
            StreamMode: Freeze({
                Auto: 1,
                Main: 2,
                Sub: 3
            }),
            IsFirefox: navigator.userAgent.toLowerCase().indexOf('firefox') !== -1
        });

        function XhrToAjax(e, fn) {
            fn(e.target.response, e.target.statusText, e.target);
        }

        function Ajax(cb, cfg) {
            if (!HasValue(cfg.url))
                Err('Empty url in ajax request');
            var fn_success = cfg.success;
            var fn_error = cfg.error;
            cfg.success = HasValue(cfg.success) ? function (e) {
                    XhrToAjax(e, fn_success);
                }
                : null;
            cfg.error = HasValue(cfg.success) ? function (e) {
                    XhrToAjax(e, fn_error);
                }
                : null;
            AjaxXhr(cb, $.extend({}, cfg, {
                complete: cb,
                timeout: 7000
            }));
        }

        function AjaxJson(cb, cfg) {
            if (!HasValue(cfg.url))
                Err('Empty url in ajax request');
            var fn_success = cfg.success;
            var fn_error = cfg.error;
            cfg.success = HasValue(fn_success) ? function (e) {
                    XhrToAjax(e, fn_success);
                }
                : null;
            cfg.error = HasValue(fn_error) ? function (e) {
                    XhrToAjax(e, fn_error);
                }
                : null;
            AjaxXhr(cb, $.extend({}, cfg, {
                complete: cb,
                timeout: 7000,
                MimeType: 'application/json',
            }));
        }

        ns_root.AjaxJson = AjaxJson;

        // login page
        function AjaxXhr(cb, cfg) {
            if (!HasValue(cfg.url))
                Err('Empty url in ajax request');
            var method = HasValue(cfg.type) ? cfg.type : 'GET';
            if (!(method === 'GET' || method === 'HEAD'))
                Err();
            var xhr = new XMLHttpRequest;
            xhr.open(method, cfg.url);
            xhr.setRequestHeader('X-Connection', 'close');
            if (HasValue(cfg.Authorize))
                xhr.setRequestHeader('Authorization', cfg.Authorize);
            if (HasValue(cfg.timeout))
                xhr.timeout = cfg.timeout;
            if (HasValue(cfg.MimeType)) {
                xhr.overrideMimeType(cfg.Type);
                if (cfg.MimeType === 'application/json')
                    xhr.responseType = 'json';
            }
            if (HasValue(cfg.responseType))
                xhr.responseType = cfg.responseType;
            xhr.onload = cfg.success;
            xhr.onloadend = cb;
            xhr.send();
        }

        function IsHttps() {
            return (location.protocol === 'https:');
        }

        function HttpOrHttps() {
            return IsHttps() ? 'https:' : 'http:';
        }

        var VideoContentType = new (function () {
                var _that = this;
                this.Unknown = 0;
                this.JPEG = 1;
                this.MP4 = 2;
                this.WEBM = 3;
                this.FromString = function (s) {
                    if (s.substring(0, 24) === 'application/octet-stream' || s.indexOf('image/jpeg') > -1) {
                        return _that.JPEG;
                    } else {
                        if (s.indexOf('mp4') > -1)
                        // video/mp4
                            return _that.MP4;
                        else if (s.indexOf('webm') > -1)
                        // video/webm
                            return _that.WEBM;
                        else
                            return _that.Unknown;
                    }
                }
                this.ToString = function (n) {
                    switch (n) {
                        case _that.MP4:
                            return 'mp4';
                        case _that.WEBM:
                            return 'webm';
                        case _that.JPEG:
                            return 'jpeg';
                        default:
                        case _that.Unknown:
                            return 'Unknown';
                    }
                }
                Freeze(this);
            }
        )();

        function Fmt(format) {
            if (arguments.length === 1)
                return format;
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return Defined(args[number]) ? args[number] : match;
            });
        }

        ns_root.Fmt = Fmt;

        function PrintableValue(item) {
            var skip_quote = true;
            var override_name = '';
            var printable;
            if (Defined(item)) {
                switch (typeof item) {
                    case 'boolean':
                        skip_quote = true;
                        break;
                    case 'function':
                        skip_quote = true;
                        override_name = Fmt(' (*){0}() ', item.name);
                        break;
                    default:
                        if (item instanceof Event) {
                            override_name = 'Event { type="' + item.type + '" }';
                        } else if (item instanceof jQuery.Event) {
                            override_name = 'jEvent { type="' + item.type + '" }';
                        } else if (item instanceof jQuery) {
                            if (item.length === 1)
                                override_name = Fmt('{0}#{1}.{2}', item[0].tagName, item[0].id, item[0].className);
                            else
                                override_name = 'jQuery { }';
                        } else if (item instanceof AppController) {
                        } else if (IsArray(item)) {
                            override_name = '[ ... ]';
                            skip_quote = true;
                        } else if (IsNumber(item)) {
                            skip_quote = true;
                        } else {
                            skip_quote = false;
                        }
                }
                if (!HasValue(item)) {
                    printable = 'null';
                    skip_quote = true;
                }
                if (override_name.length > 0) {
                    printable = override_name;
                } else {
                    var item_txt = HasValue(item) ? item.toString() : 'null';
                    printable = (item_txt.length > 64) ? item_txt.substr(0, 64 - 4) + ' ...' : item_txt;
                }
            } else {
                printable = 'undefined';
                skip_quote = true;
            }
            if (IsNumber(printable)) {
                printable = Round(printable);
                skip_quote = true;
            } else if (printable.startsWith('[object ')) {
                printable = printable.substring(8).slice(0, -1) + ' { }';
                skip_quote = true;
            }
            var quote = (skip_quote) ? '' : "'";
            return quote + printable + quote;
        }

        function CNA2(skip, x) {
            var tmp = arguments.callee;
            if (!HasValue(tmp))
                throw new Error('arguments.callee seems to be unavailable');
            var re = '';
            var local_skip = HasValue(skip) ? skip : 1;
            var anon_func = null;
            var i;
            for (i = 0; i < 15; ++i) {
                try {
                    tmp = tmp.caller;
                } catch (e) {
                    continue;
                }
                if (i < local_skip)
                    continue;
                if (!HasValue(tmp) || !HasValue(tmp.name))
                    break;
                if (tmp.name.length < 1) {
                    if (anon_func == null)
                        anon_func = tmp;
                    continue;
                }
                re += tmp.name;
                break;
            }
            if (HasValue(x))
                return re + (anon_func != null ? 'λ' : '') + '(?)';
            var tmp_args = '';
            var tmp_args_object;
            if (anon_func != null)
                tmp_args_object = anon_func.arguments;
            else
                tmp_args_object = (tmp != null) ? tmp.arguments : [];
            for (i = 0; i < tmp_args_object.length; ++i) {
                var item = tmp_args_object[i];
                tmp_args += PrintableValue(item) + ', ';
            }
            if (tmp_args.length > 1)
                tmp_args = tmp_args.slice(0, -2);
            if (re.length > 0 && anon_func != null)
                re += ': ';
            return re + (anon_func != null ? 'λ' : '') + '(' + tmp_args + ')';
        }

        function Err(message) {
            var msg = HasValue(message) ? Fmt.apply(message, arguments) : '';
            var err = new Error(Fmt('\n{0}: {1}', CNA2(1), msg));
            // 1 frame offset by default
            var stack = err.stack || err.stackTrace;
            var lines = stack.split('\n');
            if (StartsWith(stack, 'Err@')) {
                lines.splice(0, 1);
                //ff
            } else {
                lines.splice(2, 1);
            }
            var empty_idx = lines.indexOf('');
            if (empty_idx >= 0) {
                lines.splice(empty_idx, 1);
            }
            var new_stack = lines.join('\n', true);
            console.log('%c[' + GetTime() + ']\n' + new_stack, 'color: red');
            throw err;
        }

        function Trace(a, b) {
            var is_error = a instanceof Error;
            var msg = '';
            if (is_error) {
                msg = HasValue(b) ? Fmt.apply(b, Array.prototype.slice.call(arguments, 1)) : '';
            } else {
                if (HasValue(a))
                    msg = Fmt.apply(a, arguments);
            }
            var err = is_error ? a : new Error(msg);
            //new Error(Fmt('\n{0}: {1}', CNA2(1), msg)); // 1 frame offset by default
            var stack = err.stack || err.stackTrace;
            var lines = stack.split('\n');
            if (msg.length > 0 && msg !== '\n') {
                lines.splice(0, 1);
                lines.unshift(msg);
            } else if (!HasValue(a)) {
                lines.splice(0, 2);
                lines.unshift('');
            }
            /*
var empty_idx = lines.indexOf('');
if (empty_idx >= 0) {
lines.splice(empty_idx, 1);
}*/
            var new_stack = lines.join('\n', true);
            return new_stack;
        }

        function LogFmt(message, args) {
            var message_base = Fmt('[{0}] {1}', GetTime(), CNA2(2));
            if (!HasValue(message))
                return message_base + ';';
            var txt = message_base + ': ';
            var args_len = HasValue(args) ? args.length : 0;
            txt += (args_len <= 1) ? message : Fmt.apply(message, args);
            return txt;
        }

        function LogFmtB(message, args) {
            var message_base = Fmt('[{0}] {1}', GetTime(), CNA2(2, false));
            if (!HasValue(message))
                return message_base + ';';
            var txt = message_base + ': ';
            var args_len = HasValue(args) ? args.length : 0;
            txt += (args_len <= 1) ? message : Fmt.apply(message, args);
            return txt;
        }

        var _Console = new (function () {
                var _colors = Freeze({
                    Black: 'black',
                    Red: 'red',
                    Green: 'green',
                    Orange: 'orange',
                    Blue: 'blue',
                    Purple: 'purple',
                    Cyan: 'darkcyan'
                });
                this.WriteLine = function (message, color) {
                    console.log('%c' + message, 'color: ' + color);
                }
                Object.defineProperties(this, {
                    Colors: {
                        get: function () {
                            return _colors;
                        }
                    }
                });
            }
        )();

        function Log(message) {
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Black);
        }

        function Log1(message) {
            if (_enable_log !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Red);
        }

        function Log2(message) {
            if (_enable_log !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Green);
        }

        function Log3(message) {
            if (_enable_log !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Orange);
        }

        function Log4(message) {
            if (_enable_log !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Blue);
        }

        function Log5(message) {
            if (_enable_log !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Purple);
        }

        function Log6(message) {
            if (_enable_log !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Cyan);
        }

        function Log1_(message) {
            _Console.WriteLine(LogFmtB(message, arguments), _Console.Colors.Red);
        }

        function Log2_(message) {
            _Console.WriteLine(LogFmtB(message, arguments), _Console.Colors.Green);
        }

        function Log3_(message) {
            _Console.WriteLine(LogFmtB(message, arguments), _Console.Colors.Orange);
        }

        function Log4_(message) {
            _Console.WriteLine(LogFmtB(message, arguments), _Console.Colors.Blue);
        }

        function Log5_(message) {
            _Console.WriteLine(LogFmtB(message, arguments), _Console.Colors.Purple);
        }

        function Log6_(message) {
            _Console.WriteLine(LogFmtB(message, arguments), _Console.Colors.Cyan);
        }

        function LogD1(message) {
            if (_debug !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Red);
        }

        function LogD2(message) {
            if (_debug !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Green);
        }

        function LogD3(message) {
            if (_debug !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Orange);
        }

        function LogD4(message) {
            if (_debug !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Blue);
        }

        function LogD5(message) {
            if (_debug !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Purple);
        }

        function LogD6(message) {
            if (_debug !== true)
                return;
            _Console.WriteLine(LogFmt(message, arguments), _Console.Colors.Cyan);
        }

        function PrintObj(arg) {
            return JSON.stringify(arg, null, 2);
        }

        var _enable_log = false;
        (function SetDefaultLogValue() {
            var tmp = Cookies.get('enable_log');
            _enable_log = (HasValue(tmp) && tmp === 'on');
        })();

        function LogToggle() {
            if (_enable_log === true) {
                _enable_log = false;
                Cookies.set('enable_log', 'off');
            } else {
                _enable_log = true;
                Cookies.set('enable_log', 'on');
            }
        }

        ns_root.LogToggle = LogToggle;

        (function (ns_root) {
            var _ = new (function () {
                }
            )();

            function GenerateCNonce() {
                var characters = 'abcdef0123456789';
                var token = '';
                for (var i = 0; i < 16; i++) {
                    var rnd = Math.round(Math.random() * characters.length);
                    token += characters.substr(rnd, 1);
                }
                return token;
            }

            function ReadDigestHeader(xhr) {
                var response_headers = xhr.getAllResponseHeaders();
                response_headers = response_headers.split('\n');
                var digest_header;
                for (var i = 0; i < response_headers.length; i++) {
                    if (response_headers[i].match(/^www-authenticate/i) != null)
                        return response_headers[i];
                }
                return null;
            }

            ns_root.DigestAuth = function DigestAuth(host, username, password, completion) {
                Log2_();
                var that = this;
                var _completion = completion;
                EnsureValue(host);
                var _auth_url = Fmt(HttpOrHttps() + '//{0}/xhr', host);
                var _ctx = null;

                function Initialize() {
                    _ctx = Seal({
                        Scheme: null,
                        Nonce: null,
                        Realm: null,
                        Qop: null,
                        Response: null,
                        Opaque: null,
                        Nc: 0,
                        CNonce: null,
                        Timeout: 10000,
                        Host: host,
                        AuthNeeded: true,
                        Initialized: false,
                        Uuid: Guid(),
                    });
                }

                this.Initialize = Initialize;
                Initialize();
                this.Request = function (completion) {
                    if (HasValue(completion))
                        _completion = completion;
                    (HasValue(_ctx.Nonce) ? that.AuthorizedRequest : that.UnauthorizedRequest)();
                }
                var _unauth_request;
                var _auth_request;
                this.UnauthorizedRequest = function UnauthorizedRequest() {
                    _unauth_request = new XMLHttpRequest();
                    _unauth_request.open('GET', _auth_url);
                    _unauth_request.timeout = _ctx.Timeout;
                    _unauth_request.onreadystatechange = function (e) {
                        if (_unauth_request.readyState === 2 && (_unauth_request.status === 401 || _unauth_request.status === 0)) {
                            var digest_header = ReadDigestHeader(_unauth_request);
                            if (digest_header === null)
                                return;
                            digest_header = digest_header.split(':')[1];
                            digest_header = digest_header.split(',');
                            _ctx.Scheme = digest_header[0].split(/\s/)[1];
                            _ctx.Scheme = _ctx.Scheme.replace(/MaybeDigest/g, 'Digest');
                            for (var i = 0; i < digest_header.length; i++) {
                                var equalIndex = digest_header[i].indexOf('=');
                                var key = digest_header[i].substring(0, equalIndex);
                                var val = digest_header[i].substring(equalIndex + 1);
                                val = val.replace(/['"]+/g, '');
                                if (key.match(/realm/i) != null)
                                    _ctx.Realm = val;
                                if (key.match(/nonce/i) != null)
                                    _ctx.Nonce = val;
                                if (key.match(/opaque/i) != null)
                                    _ctx.Opaque = val;
                                if (key.match(/qop/i) != null)
                                    _ctx.Qop = val.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
                                // remove control chars
                            }
                            _ctx.CNonce = GenerateCNonce();
                            _ctx.AuthNeeded = true;
                            that.AuthorizedRequest();
                            return;
                        }
                        if (_unauth_request.readyState === 4) {
                            if (_unauth_request.status === 200 || _unauth_request.status === 204) {
                                Log2('Authorization not required for {0}', _auth_url);
                                _ctx.AuthNeeded = false;
                                _ctx.Initialized = true;
                                Log4('Initialized {0}', _auth_url);
                                if (IsFunc(_completion))
                                    _completion(true);
                            } else if (_unauth_request.status === 0) {
                                if (IsFunc(_completion))
                                    _completion(false);
                            }
                        }
                    }
                    _unauth_request.onerror = function () {
                        if (_unauth_request.status !== 401)
                            Log('Error {0} on unauthorized request to {1}', _unauth_request.status, _auth_url);
                        if (IsFunc(_completion))
                            _completion(false);
                    }
                    Log('Unauthorized request to ' + _auth_url);
                    _unauth_request.send();
                }
                this.CreateResponse = function (method, url) {
                    var ha1 = CryptoJS.MD5([username, _ctx.Realm, password].join(':')).toString();
                    var ha2 = CryptoJS.MD5([method, url].join(':')).toString();
                    return CryptoJS.MD5([ha1, _ctx.Nonce, ('00000000' + _ctx.Nc).slice(-8), _ctx.CNonce, _ctx.Qop, ha2].join(':')).toString();
                }
                this.GetDigestHeader = function (method, url) {
                    if (_ctx.Initialized === false)
                        Err('Not initialized');
                    return GetDigestHeaderImpl(method, url);
                }

                function GetDigestHeaderImpl(method, url, b) {
                    EnsureValue(method);
                    EnsureValue(url);
                    if (!HasValue(b))
                        ++(_ctx.Nc);
                    _ctx.Response = that.CreateResponse(method, url);
                    var re = ('' + _ctx.Scheme + ' ' + 'username="' + username + '", ' + 'realm="' + _ctx.Realm + '", ' + 'nonce="' + _ctx.Nonce + '", ' + 'uri="' + url + '", ' + 'response="' + _ctx.Response + '", ' + 'opaque="' + _ctx.Opaque + '", ' + 'qop=' + _ctx.Qop + ', ' + 'nc=' + ('00000000' + _ctx.Nc).slice(-8) + ', ' + 'cnonce="' + _ctx.CNonce + '"');
                    Log6(re);
                    return re;
                }

                this.AuthorizedRequest = function AuthorizedRequest() {
                    var digest_auth_header = GetDigestHeaderImpl('GET', _auth_url);
                    _auth_request = new XMLHttpRequest();
                    _auth_request.open('GET', _auth_url);
                    _auth_request.timeout = _ctx.Timeout;
                    _auth_request.setRequestHeader('Authorization', digest_auth_header);
                    Log4('digest auth header response to be sent:');
                    Log4(digest_auth_header);
                    _auth_request.onload = function () {
                        if (_auth_request.status >= 200 && _auth_request.status < 400) {
                            Log2_('Successfuly authorized on {0}', _auth_url);
                            _ctx.Initialized = true;
                            if (IsFunc(_completion))
                                _completion(true);
                        } else if (_auth_request.status === 500) {
                            if (IsFunc(_completion))
                                _completion(_auth_request);
                        } else {
                            Log1_('Authorization failed on {0}', _auth_url);
                            if (IsFunc(_completion))
                                _completion(false);
                        }
                    }
                    _auth_request.onerror = function () {
                        Log4('Error {0} on authenticated request to {1}', _auth_request.status, _auth_url);
                        if (IsFunc(_completion))
                            _completion(false);
                    };
                    _auth_request.send();
                    Log4('Sending authorized request to {0}', _auth_url);
                }
                this.Abort = function () {
                    Log4('Aborted request to {0}', _auth_url);
                    var fn = function (xhr) {
                        if (HasValue(xhr) && xhr.readyState !== 4)
                            xhr.Abort();
                    }
                    fn(_unauth_request);
                    fn(_auth_request);
                }
                this.GetContext = function (scope) {
                    if (scope !== _)
                        Err('access');
                    return _ctx;
                }
                {
                    Freeze(this);
                }
            }
            ns_root.DigestAuth.prototype = Freeze({
                get AuthNeeded() {
                    return this.GetContext(_).AuthNeeded;
                },
                get Initialized() {
                    return this.GetContext(_).Initialized;
                },
                get Host() {
                    return this.GetContext(_).Host;
                },
                BumpNc: function () {
                    ++(this.GetContext(_).Nc);
                },
            });
            Freeze(ns_root.DigestAuth);
        })(_root_namespace);

        function Markup() {
        }

        Markup.AsideElem = function () {
            return Tag('aside', {
                id: 'aside',
                $div: [{
                    'class': 'button_panel',
                    style: {
                        color: '#fff'
                    },
                    $div: [{
                        'class': 'button_panel button_panel_selected linkblock',
                        id: 'btn_devices',
                        style: {
                            width: '50%'
                        },
                        $: 'Cameras'
                    }, {
                        'class': 'button_panel button_panel_idle linkblock',
                        id: 'btn_setup',
                        $: 'Setup'
                    }]
                }, {
                    'class': 'menupanel',
                    style: {
                        'overflow-y': 'scroll'
                    },
                    id: 'devices_box'
                }]
            });
        }
        Freeze(Markup);

        (function (ns_root) {
            var _ = new (function () {
                }
            )();
            ns_root.Dispatcher = function Dispatcher(x, y) {
                var _flag = (x === true);
                var _fn_list = new Array();
                var _that = this;
                var _active;
                var DISPATCHER_TICK_TIMEOUT = 300;//100
                var _server = y || {
                    Host: '?'
                };
                var _depleted_callbacks = [];
                var _stopped = false;

                function ReloadPage() {
                    StopAll();
                    location.reload();
                }

                this.OnDepleted = function () {
                    InvokeCallbackArray(_depleted_callbacks);
                }
                this.Enque2 = function Enque2(fn, config) {
                    if (_stopped) {
                        Log('Stopped');
                        return;
                    }
                    if (_fn_list.length >= 12)
                        ReloadPage();
                    // Consider: this might trigger after some intensive PTZ
                    EnsureFunc(fn);
                    EnsureValue(config);
                    (_flag ? Log1 : Log)('<{0}> total: {1}', (_flag ? 'queue' : _server.Host), _fn_list.length + 1);
                    _fn_list.push(Seal({
                        SendFunc: fn,
                        Config: config
                    }));
                    // fn + args
                }
                this.Deque = function Deque() {
                    if (_fn_list.length < 1)
                        return null;
                    (_flag ? Log1 : Log)('<{0}> remaining: {1}', (_flag ? 'queue' : _server.Host), _fn_list.length - 1);
                    return _fn_list.shift();
                }
                this.Peek = function () {
                    if (_fn_list.length < 1)
                        Err();
                    return _fn_list[_fn_list.length - 1];
                }
                var _current_timer;

                function Drop() {
                    Log1('<{0}>', (_flag ? 'queue' : _server.Host));
                    _fn_list = [];
                }

                this.Drop = Drop;

                function TaskFinished(a, b, c) {
                    if (HasValue(a)) {
                        Log('<{0}> Completion: {1}', (_flag ? 'queue' : _server.Host), a.Config.url);
                        console.log(a);
                    }


                    _active = false;
                    _current_timer = setTimeout(DispatcherTick, DISPATCHER_TICK_TIMEOUT);//100
                    if (_fn_list.length === 0)
                        InvokeCallbackArray(_depleted_callbacks);
                    _depleted_callbacks = [];
                }

                function Stop() {
                    _stopped = true;
                    _fn_list = new Array();
                    clearTimeout(_current_timer);
                }

                this.Stop = Stop;

                function Start() {
                    _stopped = false;
                    _current_timer = setTimeout(DispatcherTick, DISPATCHER_TICK_TIMEOUT);//100
                }

                this.Start = Start;

                function DispatcherTick() {
                    var item = _that.Deque();
                    if (HasValue(item)) {
                        _active = true;
                        try {
                            var fn_completion = (function () {
                                var _item = item;
                                return function (a, b, c) {
                                    if (a.target.status === 0 && HasValue(_item.Config.error))
                                        _item.Config.error(a);
                                    TaskFinished(_item);
                                }
                            })();
                            if (_server.Auth.AuthNeeded) {
                                var method = item.Config.type || 'GET';
                                var dh = _server.Auth.GetDigestHeader(method, item.Config.url);
                                EnsureValue(dh);
                                item.Config.Authorize = dh;
                            }
                            item.Config.url = HttpOrHttps() + '//' + _server.Host + item.Config.url;
                            var info = (_flag ? 'queue' : _server.Host);
                            Log4('<{0}> Task start: {1}', info, item.Config.url);
                            item.SendFunc(fn_completion, item.Config);
                            Log2('<{0}> Task finish: {1}', info, item.Config.url);
                        } catch (err) {
                            (_flag ? Log1 : Log)(Trace(err));
                            TaskFinished();
                        }
                    } else
                        TaskFinished();
                }

                this.Tick = DispatcherTick;
                Object.defineProperties(this, {
                    FnList: {
                        get: function () {
                            return _fn_list.slice();
                        }
                    },
                    OnDepleted: {
                        set: function (x) {
                            _depleted_callbacks.push(x);
                        }
                    }
                });
                {
                    Freeze(this);
                    if (_flag === false)
                        TaskFinished();
                }
            }
            Freeze(ns_root.Dispatcher);
        })(_root_namespace);
        (function (ns_root) {
            var _ = new (function () {
            })();
            ns_root.DateTimeControl = function (date) {
                var _that = this; // this is this
                var dropdown_year = false;
                var _ctx = Seal({
                    get That() {
                        return _that;
                    },
                    elem_year: null,
                    elem_month: null,
                    elem_day: null,
                    elem_hour: null,
                    elem_minute: null,
                    elem_second: null,
                    elem_button: null,
                    DateTime: null,
                    CreateTimeFragElem: function (x, y, z) {
                        var tag = Tag('div', {
                            'class': 'ycenter inline linkblock dt_field tip',
                            style: {
                                width: '30px',
                                'text-align': 'center'
                            },
                            $: HasValue(x) ? LeadingZero2(x) : '--'
                        })
                            .on('mousewheel DOMMouseScroll', function HandleScroll(e) {
                                _ctx.DateTime = new Date(_ctx.DateTime.getTime() + (GetScrollDirection(e) ? y : -y));
                                _that.UpdateElems();
                            })
                            .on('click', function HandleClick(e) {
                                var elem = $('.time_selector');
                                if (elem.length > 0) {
                                    elem.remove();
                                    return;
                                }
                                elem = $(e.target);
                                var elem_offset = elem.offset();
                                var parent_elem = elem.parent();
                                var data = elem.data('kind');
                                if (!HasValue(data))
                                    return;
                                var range = [0, 0];
                                switch (data) {
                                    case 'second':
                                    case 'minute':
                                        range = [0, 59];
                                        break;
                                    case 'hour':
                                        range = [0, 23];
                                        break;
                                    case 'day':
                                        range = [1, 31];
                                        break;
                                    case 'month':
                                        range = [1, 12];
                                        break;
                                    case 'year':
                                        range = [10, new Date().getFullYear() - 2000];
                                        break;
                                }
                                var tmp_elem = Tag('div', {
                                    'class': 'time_selector linkblock2',
                                    style: {
                                        'background-color': 'rgba(0,0,0,0.5)',
                                        border: '1px solid #555',
                                        position: 'fixed',
                                        width: '26px',
                                        height: '200px',
                                        'overflow-y': 'scroll',
                                        left: elem_offset.left + 1,
                                        top: '34px',
                                        'text-align': 'right'
                                    },
                                });
                                for (var i = range[0]; i <= range[1]; ++i) {
                                    var div = Tag('div', {
                                        'class': 'linkblock',
                                        style: {
                                            margin: '2px'
                                        },
                                        $: i
                                    });
                                    var entry = Tag('a', {
                                        _0: div
                                    })
                                        .on('click', function (e) {
                                            var selector_elem = $(e.target);
                                            var data = selector_elem.data('kind');
                                            if (!HasValue(data))
                                                return;
                                            var val = EnsureNumber(parseInt(selector_elem.html()));
                                            switch (data) {
                                                case 'second':
                                                    _ctx.DateTime.setSeconds(val);
                                                    break;
                                                case 'minute':
                                                    _ctx.DateTime.setMinutes(val);
                                                    break;
                                                case 'hour':
                                                    _ctx.DateTime.setHours(val);
                                                    break;
                                                case 'day':
                                                    _ctx.DateTime.setDate(val);
                                                    break;
                                                case 'month':
                                                    _ctx.DateTime.setMonth(val);
                                                    break;
                                                case 'year':
                                                    _ctx.DateTime.setFullYear(val + 2000);
                                                    break;
                                            }
                                            var elem = $('.time_selector');
                                            if (elem.length > 0)
                                                elem.remove();
                                            _ctx.That.UpdateElems();
                                        });
                                    div.data('kind', data);
                                    tmp_elem.append(entry);
                                }
                                parent_elem.append(tmp_elem);
                            });
                        tag.data('kind', z);
                        return tag;
                    }
                });
                this.GetContext = function (scope) {
                    if (scope !== _) Err('access');
                    return _ctx;
                }
                {
                    _ctx.DateTime = (HasValue(date)) ? date : null;
                    Freeze(this);
                }
            }
            var second_len_ms = 1000;
            var minute_len_ms = second_len_ms * 60;
            var hour_len_ms = minute_len_ms * 60;
            var day_len_ms = hour_len_ms * 24;
            var month_len_ms = day_len_ms * 31;
            var year_len_ms = day_len_ms * 365;

            function CreateYearElem(ctx) {
                return ctx.CreateTimeFragElem(HasValue(ctx.DateTime) ? ctx.DateTime.getFullYear() : '--', year_len_ms, 'year');
            }

            function CreateMonthElem(ctx) {
                return ctx.CreateTimeFragElem(HasValue(ctx.DateTime) ? ctx.DateTime.getMonth() + 1 : '--', month_len_ms, 'month');
            }

            function CreateDayElem(ctx) {
                return ctx.CreateTimeFragElem(HasValue(ctx.DateTime) ? ctx.DateTime.getDate() : '--', day_len_ms, 'day');
            }

            function CreateHourElem(ctx) {
                return ctx.CreateTimeFragElem(HasValue(ctx.DateTime) ? ctx.DateTime.getHours() : '--', hour_len_ms, 'hour');
            }

            function CreateMinuteElem(ctx) {
                return ctx.CreateTimeFragElem(HasValue(ctx.DateTime) ? ctx.DateTime.getMinutes() : '--', minute_len_ms, 'minute');
            }

            function CreateSecondElem(ctx) {
                return ctx.CreateTimeFragElem(HasValue(ctx.DateTime) ? ctx.DateTime.getSeconds() : '--', second_len_ms, 'second');
            }

            ns_root.DateTimeControl.prototype = Freeze({
                GetDateTime: function () {
                    return this.GetContext(_).DateTime;
                },
                SetDateTime: function (v) {
                    this.GetContext(_).DateTime = v;
                    this.UpdateElems();
                },
                UpdateElems: function () {
                    var _ctx = this.GetContext(_);
                    var dt = _ctx.DateTime;
                    var fn = function (x, y, fn_create_elem) {
                        if (HasValue(x))
                            $(x).html(fn_create_elem(_ctx).html());
                        else
                            y(fn_create_elem(_ctx));
                    }
                    fn(_ctx.elem_year, function (x) {
                        _ctx.elem_year = x
                    }, CreateYearElem);
                    fn(_ctx.elem_month, function (x) {
                        _ctx.elem_month = x
                    }, CreateMonthElem);
                    fn(_ctx.elem_day, function (x) {
                        _ctx.elem_day = x
                    }, CreateDayElem);
                    fn(_ctx.elem_hour, function (x) {
                        _ctx.elem_hour = x
                    }, CreateHourElem);
                    fn(_ctx.elem_minute, function (x) {
                        _ctx.elem_minute = x
                    }, CreateMinuteElem);
                    fn(_ctx.elem_second, function (x) {
                        _ctx.elem_second = x
                    }, CreateSecondElem);
                },
                CreateElems: function () {
                    this.UpdateElems();
                    var ctx = this.GetContext(_);
                    var fn_elem = function (x) {
                        return {
                            'class': 'ycenter inline',
                            $: x
                        }
                    }
                    var tag = Tag('div', {
                        id: 'head_center',
                        'class': 'inline',
                        style: {
                            width: 'auto',
                            height: '40px'
                        },
                        _0: ctx.elem_year,
                        $div_1: fn_elem('/'),
                        _1: ctx.elem_month, //
                        $div_2: fn_elem('/'),
                        _2: ctx.elem_day,
                        $div_3: fn_elem('-'),
                        _3: ctx.elem_hour,
                        $div_4: fn_elem(':'),
                        _4: ctx.elem_minute,
                        $div_5: fn_elem(':'),
                        _5: ctx.elem_second,
                        _6: ctx.elem_button = Tag('div', {
                            style: {
                                'float': 'right',
                                'background-size': 'contain'
                            },
                            'class': 'ycenter icon linkblock emb_icon_ar_24'
                        }).on('click', function () {
                            var cc = _cell_controllers.Selected;
                            EnsureValue(cc);
                            cc.AbsoluteSeek(ctx.DateTime.getTime());
                        })
                    });
                    $(tag).data('dt_control', ctx.That);
                    return tag;
                }
            });
            Freeze(ns_root.DateTimeControl.prototype);
            Freeze(ns_root.DateTimeControl);
        })(_root_namespace);

        (function (ns_root) {
            var _ = new (function () {
            })();
            ns_root.Range = function Range(range, id) {
                var copy = Range.SameType(arguments[arguments.length - 1]);
                if (copy) {
                    var ctx = (arguments[arguments.length - 1]).GetContext(_);
                    range = ctx.Range;
                    id = ctx.Id;
                }
                EnsureArray(range);
                if (range.length !== 2 || range[0] > range[1])
                    Err();
                var _ctx = Seal({
                    Range: [range[0], range[1]],
                    Id: id,
                });
                this.GetContext = function (scope) {
                    if (scope !== _) Err('access');
                    return _ctx;
                }
                {
                    Freeze(this);
                }
            }
            ns_root.Range.prototype = Freeze({
                get From() {
                    return this.GetContext(_).Range[0];
                },
                set From(v) {
                    this.GetContext(_).Range[0] = v;
                },
                get To() {
                    return this.GetContext(_).Range[1];
                },
                set To(v) {
                    this.GetContext(_).Range[1] = v;
                },
                get Length() {
                    var ctx = this.GetContext(_);
                    return ctx.Range[1] - ctx.Range[0]; // premature optimization
                },
                get Range() {
                    return this.GetContext(_).Range;
                },
                get Id() {
                    return this.GetContext(_).Id;
                },
                InRange: function (x) {
                    return (x >= this.From && x <= this.To);
                },
                toString: function () {
                    return Fmt('{0} ~ {1} ({2})',
                        this.From.toLocaleString(),
                        this.To.toLocaleString(),
                        (this.To - this.From).toLocaleString());
                }
            });
            Range.SameType = function (x) {
                return HasValue(x) === true && (x instanceof Range);
            }
            Range.EnsureType = function (x) {
                if (Range.SameType(x) !== true)
                    Err();
                return x;
            }
            Freeze(ns_root.Range);
        })(_root_namespace);
        (function (ns_root) {
            var _ = new (function () {
            })();
            ns_root.TimelineData = function TimelineData() {
                var _that = this; // this is this
                var _ctx = Seal({
                    That: function () {
                        var _that = this;
                        return _that;
                    },
                    From: null,
                    To: null,
                    TimeRanges: [],
                    MergedRanges: [],
                });
                this.GetContext = function (scope) {
                    if (scope !== _) Err('access');
                    return _ctx;
                }
                {
                    Freeze(this);
                }
            }

            function AddDataRange(ctx) {
            }

            ns_root.TimelineData.prototype = Freeze({
                AddRanges2: function (from, to, ranges) {
                    EnsureArray(ranges);
                    if (from === 0 || to === 0)
                        Err();
                    var ctx = this.GetContext(_);
                    if (HasValue(ctx.From)) {
                    } else {
                        ctx.From = from;
                    }
                    if (HasValue(ctx.To)) {
                        if (to > ctx.To)
                            ctx.To = to;
                        else
                            Log('Warning');
                    } else {
                        ctx.To = to;
                    }
                    for (var i = 0; i < ranges.length; ++i) {
                        var range = ranges[i];
                        Range.EnsureType(range);
                    }
                    ctx.TimeRanges = ctx.TimeRanges.concat(ranges);
                },
                get MergedRanges() {
                    var tmp = [];
                    var ctx = this.GetContext(_);
                    for (var i = 0; i < ctx.TimeRanges.length; ++i) {
                        var range = ctx.TimeRanges[i];
                        var intersecting = [];
                        for (var ti = 0; ti < tmp.length; ++ti) {
                            var tmp_item = tmp[ti];
                            if (tmp_item.InRange(range.From) && tmp_item.InRange(range.To))
                                continue;
                            if (tmp_item.InRange(range.From) || tmp_item.InRange(range.To))
                                intersecting.push(tmp_item);
                        }
                        var from;
                        var to;
                        if (intersecting.length > 0) {
                            from = intersecting[0].From;
                            to = intersecting[0].To;
                            if (intersecting.length > 1) {
                                for (var x = 0; x < intersecting.length; ++x) {
                                    if (intersecting[x].From < from)
                                        from = intersecting[x].From;
                                    if (intersecting[x].To > to)
                                        to = intersecting[x].To;
                                }
                            }
                        } else {
                            from = range.From;
                            to = range.To;
                        }
                        tmp.push(new Range([from, to]));
                    }
                    var re = [];
                    var fn = function (x, y) {
                        re.push(new Range(x, {
                            Data: y,
                            ServerId: 0
                        }));
                    }
                    if (tmp.length < 1) {
                        fn([ctx.From, ctx.To], false);
                        return re;
                    }
                    if (ctx.From < tmp[0].From)
                        fn([ctx.From, tmp[0].From], false);
                    fn([tmp[0].From, tmp[0].To], true);
                    if (tmp.length > 1) {
                        for (var i = 1; i < tmp.length; ++i) {
                            if (tmp[i].From > re[re.length - 1].To)
                                fn([re[re.length - 1].To, tmp[i].From], false);
                            fn([tmp[i].From, tmp[i].To], true);
                        }
                    }
                    if (ctx.To > re[re.length - 1].To)
                        fn([re[re.length - 1].To, ctx.To], false);
                    return re;
                },
                AddRanges: function (from, to, ranges, sv_id) {
                    Err();
                    EnsureArray(ranges);
                    var ctx = this.GetContext(_);
                    var fn = function (x, y) {
                        ctx.TimeRanges.push(new Range(x, {
                            Data: y,
                            ServerId: sv_id
                        }));
                    }
                    if (ranges.length < 1) {
                        fn([from, to], false);
                        return;
                    }
                    if (from < ranges[0][0])
                        fn([from, ranges[0][0]], false);
                    fn(ranges[0], true);
                    if (ranges.length > 1) {
                        for (var i = 1; i < ranges.length; ++i) {
                            fn([ranges[i - 1][1], ranges[i][0]], false);
                            fn(ranges[i], true);
                        }
                    }
                    var last = ranges.length - 1;
                    if (to > ranges[last][1])
                        fn([ranges[last][1], to], false);
                },
                IsDataRange: function (utcms) {
                    EnsureNumber(utcms);
                    var ctx = this.GetContext(_);
                    var ranges = this.MergedRanges;
                    for (var i = 0; i < ranges.length; ++i) {
                        if (ranges[i].InRange(utcms))
                            return ranges[i].Id.Data;
                    }
                    return null;
                },
                FindNextData: function (utcms) {
                    EnsureNumber(utcms);
                    var ctx = this.GetContext(_);
                    for (var i = 0; i < ctx.TimeRanges.length; ++i) {
                        if (ctx.TimeRanges[i].From >= utcms && ctx.TimeRanges[i].Id.Data === true)
                            return new Range(ctx.TimeRanges[i]);
                    }
                    return null;
                },
                FindNextMergedData: function (utcms) {
                    EnsureNumber(utcms);
                    var ranges = this.MergedRanges;
                    for (var i = 0; i < ranges.length; ++i) {
                        if (ranges[i].From >= utcms && ranges[i].Id.Data === true)
                            return new Range(ranges[i]);
                    }
                    return null;
                },
                FindServer: function (utcms) {
                    EnsureNumber(utcms);
                    var ctx = this.GetContext(_);
                    for (var i = 0; i < ctx.TimeRanges.length; ++i) {
                        if (ctx.TimeRanges[i].InRange(utcms))
                            return ctx.TimeRanges[i].Id;
                    }
                    utcms += 5000;
                    for (var i = 0; i < ctx.TimeRanges.length; ++i) {
                        if (ctx.TimeRanges[i].InRange(utcms)) {
                            Log3('Nearby range');
                            return ctx.TimeRanges[i].Id;
                        }
                    }
                    return null;
                },
                get Ranges() {
                    var re = [];
                    var ctx = this.GetContext(_);
                    for (var i = 0; i < ctx.TimeRanges.length; ++i)
                        re.push(new Range(ctx.TimeRanges[i]));
                    return re;
                },
                get Length() {
                    return this.GetContext(_).TimeRanges.length;
                },
                get Start() { // abs
                    return this.GetContext(_).TimeRanges[0].From;
                },
                get Last() {
                    var ctx = this.GetContext(_);
                    return new Range(ctx.TimeRanges[ctx.TimeRanges.length - 1]);
                },
                get End() { // abs
                    var ctx = this.GetContext(_);
                    return ctx.TimeRanges[ctx.TimeRanges.length - 1].To;
                },
                get IsEmpty() {
                    return (this.GetContext(_).TimeRanges.length < 1);
                }
            });
            Freeze(ns_root.TimelineData);
        })(_root_namespace);

        function GetDataHeaders(xhr) {
            var content_type = xhr.getResponseHeader('Content-Type');
            var header_len = parseInt(xhr.getResponseHeader('X-Stream-Header-Length'));
            var start_time = parseInt(xhr.getResponseHeader('X-Stream-Start-Time'));
            var end_time = parseInt(xhr.getResponseHeader('X-Stream-End-Time'));
            if (!HasValue(content_type))
                Err('Content-Type');
            if (!HasValue(header_len))
                Err('X-Stream-Header-Length');
            if (!HasValue(start_time))
                Err('X-Stream-Start-Time');
            if (!HasValue(end_time))
                Err('X-Stream-End-Time');
            return new (function () {
                    var _header_len = header_len;
                    var _content_type = content_type;
                    var _start_time = start_time;
                    var _end_time = end_time;
                    Object.defineProperties(this, {
                        HeaderLength: {
                            get: function () {
                                return _header_len;
                            }
                        },
                        ContentType: {
                            get: function () {
                                return _content_type
                            }
                        },
                        StartTime: {
                            get: function () {
                                return _start_time;
                            }
                        },
                        EndTime: {
                            get: function () {
                                return _end_time;
                            }
                        },
                        Length: {
                            get: function () {
                                return this.EndTime - this.StartTime;
                            }
                        }
                    });
                    Freeze(this);
                }
            )();
        }

        (function (ns_root) {
            var _ = new (function () {
                }
            )();
            ns_root.Server = function Server(obj, authorize) {
                var _ctx = Seal({
                    Id: null,
                    Host: null,
                    Name: null,
                    Dispatcher: null,
                    Auth: null,
                    Timer: null,
                    EventsConnected: true,
                });
                this.GetContext = function (scope) {
                    if (scope !== _)
                        Err('access');
                    return _ctx;
                }
                {
                    Freeze(this);
                    EnsureMembers(obj, 'id', 'ip', 'name');
                    _ctx.Id = EnsureInt(parseInt(obj.id));
                    _ctx.Host = IsHttps() ? EnsureValue(obj.httpsIp) : EnsureValue(obj.ip);
                    _ctx.Name = EnsureStringValue(obj.name);
                    _ctx.Dispatcher = new Dispatcher(false, this);
                    EnsureValues(_user, _pass);
                    _ctx.Auth = new DigestAuth(_ctx.Host, _user, _pass);
                    if (!HasValue(authorize))
                        _ctx.Auth.Request();
                }
            }
            ns_root.Server.prototype = Freeze({
                get Name() {
                    return this.GetContext(_).Name;
                },
                set Name(v) {
                    this.GetContext(_).Name = v;
                },
                get Id() {
                    return this.GetContext(_).Id;
                },
                get Host() {
                    return this.GetContext(_).Host;
                },
                set Host(v) {
                    this.GetContext(_).Host = v;
                },
                get Auth() {
                    return this.GetContext(_).Auth;
                },
                get Dispatcher() {
                    return this.GetContext(_).Dispatcher;
                },
                get EventsConnected() {
                    return this.GetContext(_).EventsConnected;
                },
                set EventsConnected(v) {
                    this.GetContext(_).EventsConnected = v === true ? true : false;
                },
                Query: function Query(cb, cfg) {
                    if (cfg.url.startsWith('http'))
                        Err();
                    Log4(cfg.url);
                    var ctx = this.GetContext(_);
                    ctx.Dispatcher.Enque2(cb, cfg);
                },
                ResetDigestAuth: function ResetDigestAuth() {
                    Log();
                    var ctx = this.GetContext(_);
                    ctx.Dispatcher.Stop();
                    var that = this;
                    ctx.Auth.Initialize();
                    ctx.Auth.Request(function (x) {
                        Log();
                        if (x === true) {
                            ctx.EventsConnected = true;
                            ctx.Dispatcher.Start();
                        } else {
                            ctx.EventsConnected = false;
                            clearTimeout(ctx.Timer);
                            ctx.Timer = setTimeout(function () {
                                ResetDigestAuth.call(that);
                            }, 12000);
                        }
                    });
                },
                toString: function () {
                    return 'Server { }';
                },
            });
            ns_root.Server.EnsureType = function (x) {
                if (HasValue(x) !== true || !(x instanceof Server))
                    Err();
                return x;
            };
            Freeze(ns_root.Server);
        })(_root_namespace);
        (function (ns_root) {
            var _ = new (function () {
                }
            )();
            ns_root.Device = function Device(obj) {
                var _ctx = Seal({
                    Id: null,
                    ServerId: null,
                    Title: null,
                    PtzCaps: null,
                    Presets: [],
                    ArchiveServerIds: [],
                    ArchiveBoundaries: null,
                    HasArchive: null,
                });
                this.GetContext = function (scope) {
                    if (scope !== _)
                        Err('access');
                    return _ctx;
                }
                {
                    Freeze(this);
                    _ctx.Id = EnsureInt(parseInt(obj.id));
                    _ctx.ServerId = EnsureInt(parseInt(obj.server));
                    _ctx.Title = EnsureStringValue(obj.title);
                    _ctx.PtzCaps = EnsureInt(parseInt(obj.ptzCapabilities));
                    _ctx.Presets = EnsureArrayOrDefault((obj.ptzPresets));
                    _ctx.ArchiveServerIds = EnsureArrayOrDefault((obj.archiveServers));
                }
            }
            ns_root.Device.prototype = {
                get Id() {
                    return this.GetContext(_).Id;
                },
                get ServerId() {
                    return this.GetContext(_).ServerId;
                },
                set ServerId(v) {
                    this.GetContext(_).ServerId = v;
                },
                get Title() {
                    return this.GetContext(_).Title;
                },
                get PtzCaps() {
                    return this.GetContext(_).PtzCaps;
                },
                set PtzCaps(v) {
                    this.GetContext(_).PtzCaps = v;
                },
                get Presets() {
                    return this.GetContext(_).Presets.slice();
                },
                set Presets(v) {
                    EnsureArray(v);
                    this.GetContext(_).Presets = v;
                },
                get ArchiveServerIds() {
                    return this.GetContext(_).ArchiveServerIds.slice();
                },
                set ArchiveServerIds(v) {
                    this.GetContext(_).ArchiveServerIds = v;
                },
                get StreamLocation() {
                    var ctx = this.GetContext(_);
                    var re = '';
                    var server = _controller.Servers[ctx.ServerId];
                    Server.EnsureType(server);
                    if (server.Host.length < 1)
                        return re;
                    return HttpOrHttps() + '//' + server.Host;
                },
                get StreamLocation2() {
                    var stream_location = '';
                    var sp = GetStreamMode();
                    stream_location += Fmt('/live/{0}/{1}', this.Id, sp);
                    var opts = '';
                    if (sp === 'auto')
                        opts += Fmt('?width={0}&height={1}', _cell_width, _cell_height);
                    return stream_location + opts + (opts.length > 0 ? '&' : '?') + 'something=' + new Date().getTime();
                },
                get StreamLocation3() {
                    var stream_location = Fmt('/live/{0}/addStreamToken', this.Id);
                    var sp = GetStreamMode();
                    stream_location += '?stream=' + sp;
                    if (sp === 'auto')
                        stream_location += Fmt('&width={0}&height={1}', _cell_width, _cell_height);
                    return stream_location;
                },
                get BoundariesLocation() {
                    return Fmt('/archive/{0}/boundaries', this.Id);
                },
                GetNextFrameTimeLocation: function (utcms) {
                    return Fmt('/archive/{0}/nextFrameTime?time={1}', this.Id, utcms);
                },
                GetPrevFrameTimeLocation: function (utcms) {
                    return Fmt('/archive/{0}/prevFrameTime?time={1}', this.Id, utcms);
                },
                GetServer: function () {
                    return _controller.Servers[this.ServerId];
                },
                get HasArchive() {
                    return this.GetContext(_).HasArchive;
                },
                get ArchiveBoundaries() {
                    var re = {};
                    var keys = Object.keys(this.GetContext(_).ArchiveBoundaries);
                    for (var i = 0; i < keys.length; ++i)
                        re[keys[i]] = new Range(this.GetContext(_).ArchiveBoundaries[keys[i]]);
                    return re;
                },
                GetArchiveFrames:function(from,to){

                    var url = Fmt('/archive/{0}/timeline?start={1}&end={2}&interval=1000', this.Id,(to-24*60*60*1000),to);
                    var sv = this.GetServer();
                    sv.Query(AjaxJson, {
                        url: url,
                        success: function HandleTimelineResponse(response_data, text_status, request) {
                            var data;
                            if (response_data.length < 1) {
                                data = [];
                            } else {
                                data = response_data;
                            }
                            EnsureArray(data);
                            _l_options.vueApp.archiveFrames = data;
                        },
                        error: function HandleAjaxError(request, text_status, request_error) {
                            var tmp = request.getResponseHeader('X-VMS-Error');
                            if (HasValue(tmp))
                                Log1('VMS Error {0}', tmp);
                        }
                    });
                },
                UpdateArchiveBoundaries: function UpdateArchiveBoundaries(completion) {
                    var ctx = this.GetContext(_);
                    var that = this;
                    if (HasValue(this.HasArchive)) {
                        completion();
                        return;
                    }
                    Log4();
                    var pps = [];
                    for (var i = 0; i < ctx.ArchiveServerIds.length; ++i) {
                        var p = (function (ar_server) {
                            return new Promise(function (yes, no) {
                                    try {
                                        var url = that.BoundariesLocation;
                                        var sv = _controller.Servers[ar_server.Id];
                                        sv.Query(AjaxJson, {
                                            url: url,
                                            success: function HandleArchiveInfoResponse(response_data, text_status, request) {
                                                Log6();
                                                var tmp = response_data;
                                                if (HasMembers(tmp, 'from', 'to') && tmp.from !== tmp.to) {
                                                    if (!HasValue(ctx.ArchiveBoundaries))
                                                        ctx.ArchiveBoundaries = {};
                                                    ctx.HasArchive = true;
                                                    ctx.ArchiveBoundaries[ar_server.Id] = new Range([tmp.from, tmp.to], ar_server.Id);

                                                    if(_l_options.vueApp){
                                                        _l_options.vueApp.archiveBoundaries = {from:tmp.from,to:tmp.to};
                                                        /*that.GetArchiveFrames(tmp.from,tmp.to);*/
                                                    }
                                                    Log3('d[{0}]/s[{1}]: {2}', that.Id, ar_server.Id, ctx.ArchiveBoundaries[ar_server.Id].toString());
                                                }
                                                yes();
                                            },
                                            error: function HandleAjaxError(request, text_status, request_error) {
                                                var tmp = request.getResponseHeader('X-VMS-Error');
                                                if (HasValue(tmp))
                                                    Log1('VMS Error {0}', tmp);
                                                no();
                                            }
                                        });
                                    } catch (err) {
                                        no();
                                    }
                                }
                            );
                        })(_controller.Servers[ctx.ArchiveServerIds[i]]);
                        pps.push(p);
                    }
                    Promise.all(pps).then(function (v) {
                        Log1('waitall finished');
                        completion();
                    });
                },
                FindArchiveRange: function (utcms) {
                    EnsureNumber(utcms);
                    var ctx = this.GetContext(_);
                    var b = ctx.ArchiveBoundaries;
                    var keys = Object.keys(b);
                    for (var i = 0; i < keys.length; ++i) {
                        var item = b[keys[i]];
                        if (item.InRange(utcms))
                            return new Range(item);
                    }
                    return null;
                },
                FindNextFrame: function (utcms, completion) {
                    var ctx = this.GetContext(_);
                    var that = this;
                    var pps = [];
                    for (var i = 0; i < ctx.ArchiveServerIds.length; ++i) {
                        var p = (function (ar_server) {
                            return new Promise(function (yes, no) {
                                    try {
                                        var url = that.GetNextFrameTimeLocation(utcms);
                                        var sv = _controller.Servers[ar_server.Id];
                                        sv.Query(AjaxJson, {
                                            url: url,
                                            success: function HandleNextFrameResponse(response_data, text_status, request) {
                                                Log6(PrintObj(response_data));
                                                yes(Freeze({
                                                    Server: ar_server,
                                                    UtcMs: response_data
                                                }));
                                            },
                                            error: function CustomHandleAjaxError(request, text_status, request_error) {
                                                var tmp = request.getResponseHeader('X-VMS-Error');
                                                if (HasValue(tmp))
                                                    Log1('VMS Error {0}', tmp);
                                                no();
                                            }
                                        });
                                    } catch (err) {
                                        no();
                                    }
                                }
                            );
                        })(_controller.Servers[ctx.ArchiveServerIds[i]]);
                        pps.push(p);
                    }
                    Promise.all(pps).then(function (v) {
                        Log1('waitall finished');
                        completion(v);
                    });
                },
                get ArchiveFrom() {
                    var ctx = this.GetContext(_);
                    if (ctx.ArchiveBoundaries.length < 1)
                        Err();
                    var b = ctx.ArchiveBoundaries;
                    var keys = Object.keys(b);
                    var from = b[keys[0]].From;
                    for (var i = 1; i < keys.length; ++i) {
                        if (b[keys[i]].From < from)
                            from = b[keys[i]].From;
                    }
                    return from;
                },
                get ArchiveTo() {
                    var ctx = this.GetContext(_);
                    if (ctx.ArchiveBoundaries.length < 1)
                        Err();
                    var b = ctx.ArchiveBoundaries;
                    var keys = Object.keys(b);
                    var to = b[keys[0]].To;
                    for (var i = 1; i < keys.length; ++i) {
                        if (b[keys[i]].To > to)
                            to = b[keys[i]].To;
                    }
                    return to;
                },
                get ArchiveRange() {
                    return new Range([this.ArchiveFrom, this.ArchiveTo]);
                },
                toString: function () {
                    var ctx = this.GetContext(_);
                    return Fmt('Device "{0}" { ptz={1} }', ctx.Title, ctx.PtzCaps);
                }
            }
            Freeze(ns_root.Device.prototype);
            Freeze(ns_root.Device);
        })(_root_namespace);
        (function (ns_root) {
            var _ = new (function () {
            })();
            ns_root.BufferManager = function BufferManager() {
                var _ctx = Seal({
                    Chunks: [],
                });
                this.GetContext = function (scope) {
                    if (scope !== _) Err('access');
                    return _ctx;
                }
                Freeze(this);
            }
            ns_root.BufferManager.prototype = Freeze({
                AddRange: function (range) {
                    Range.EnsureType(range);
                    var _ctx = this.GetContext(_);
                    var start_from = 0;
                    if (this.IsEmpty === false && range.From < this.End) {
                        this.Last.To = range.From;
                        ++start_from;
                    }
                    _ctx.Chunks.push(range);
                },
                Print: function () {
                    var ctx = this.GetContext(_);
                    for (var i = 0; i < ctx.Chunks.length; ++i) {
                        var chunk = ctx.Chunks[i];
                        Log4('chunk[{0}]: {1}', i, chunk.toString());
                    }
                },
                GetCurrentChunk: function (utcms) {
                    var ctx = this.GetContext(_);
                    for (var i = 0; i < ctx.Chunks.length; ++i) {
                        var chunk = ctx.Chunks[i];
                        if (chunk.InRange(utcms))
                            return i;
                    }
                    return null;
                },
                Clear: function () {
                    var ctx = this.GetContext(_);
                    DeleteArrayElems(ctx.Chunks);
                    delete ctx.Chunks;
                    ctx.Chunks = [];
                },
                get Ranges() {
                    var re = [];
                    var ctx = this.GetContext(_);
                    for (var i = 0; i < ctx.Chunks.length; ++i)
                        re.push(new Range(ctx.Chunks[i]));
                    return re;
                }, // return copy
                get Count() {
                    return this.GetContext(_).Chunks.length;
                },
                get Start() { // abs
                    return this.GetContext(_).Chunks[0].From;
                },
                get End() { // abs
                    var _ctx = this.GetContext(_);
                    return _ctx.Chunks[_ctx.Chunks.length - 1].To;
                },
                get Length() {
                    var _ctx = this.GetContext(_);
                    return _ctx.Chunks[_ctx.Chunks.length - 1].To - _ctx.Chunks[0].From;
                },
                get Last() {
                    var _ctx = this.GetContext(_);
                    return _ctx.Chunks[_ctx.Chunks.length - 1]; // returns writable Range object
                },
                get IsEmpty() {
                    return (this.GetContext(_).Chunks.length < 1);
                }
            });
            Freeze(ns_root.BufferManager.prototype);
            Freeze(ns_root.BufferManager);
        })(_root_namespace);
        (function (ns_root) {
            var _ = new (function () {
            })();
            ns_root.BufferedVideo = function BufferedVideo(elem) {
                Log();
                var _elem_cell = elem;
                var _that = this;
                var _elem_video;
                var _chunk_offset = 0; // time offset relative to playback start, for next chunk
                var _first_chunk = true;
                var _chunk_content_type;
                var _last_end_time_utcms = null; // previous chunk end time
                var _buffered_end_abs = 0;
                var _start_time;
                var _paused = true;
                var _progress_callbacks = [];
                var _progress_timer = null;
                var _chunk_processed_callbacks = [];
                var _media_source;
                var _source_buffer;
                var _frames = [];
                var _curr_frame_i = 0; // current frame index
                var _current_time = 0;
                var _duration_ms = 0;
                var _last_image;
                var _current_pending_frame = null;

                function Play() {
                    Log();
                    if (_elem_video.paused === false)
                        return;
                    if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM) {
                        _elem_video[0].play();
                    } else if (_chunk_content_type === VideoContentType.JPEG) {
                        _paused = false;
                        PlayJpegFrame();
                        TriggerProgress();
                        if (HasValue(_progress_timer))
                            clearTimeout(_progress_timer);
                        _progress_timer = setTimeout(TriggerProgress, 250);
                    } else {
                        Err();
                    }
                }

                this.Play = Play;

                function Pause() {
                    if (_elem_video.paused === true)
                        return;
                    if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM) {
                        _paused = true;
                        _elem_video[0].pause();
                    } else if (_chunk_content_type === VideoContentType.JPEG) {
                        if (HasValue(_progress_timer))
                            clearInterval(_progress_timer);
                        _paused = true;
                    } else {
                        Err();
                    }
                    Log();
                }

                this.Pause = Pause;

                function Dispose() {
                    Log(Trace());
                    clearTimeout(_current_pending_frame);
                    clearInterval(_progress_timer);
                    var len = _frames.length;
                    for (var i = 0; i < len; ++i)
                        delete _frames[i];
                    delete _frames;
                    delete _source_buffer;
                    delete _media_source;
                    DisposeVideoElem(_elem_video);
                    _elem_video = null;
                }

                this.Dispose = Dispose;

                function PlayJpegFrame() {
                    clearTimeout(_current_pending_frame);
                    if (_curr_frame_i >= _frames.length)
                        return;
                    var frame = _frames[_curr_frame_i];
                    if (HasValue(frame)) { // err..
                        _current_time = _frames[_curr_frame_i].Age;
                        var _reader = new FileReader();
                        _reader.onload = function (e) {
                            var img = new Image();
                            img.src = e.target.result;
                            _last_image = img;
                            _elem_video[0].src = img.src; //e.target.result;
                            UpdateImageElem(_elem_video);
                            delete _reader;
                        }
                        _reader.readAsDataURL(frame.Blob);
                        if (_paused === false)
                            _current_pending_frame = setTimeout(PlayJpegFrame, _frames[_curr_frame_i].Time);
                    }
                    ++_curr_frame_i;
                }

                function SeekWithinBuffer(second) {
                    var wish_time_ms = second * 1000;
                    if (wish_time_ms > _duration_ms)
                        return;
                    for (var i = 0; i < _frames.length; ++i) {
                        if (_frames[i].Age >= wish_time_ms) {
                            _curr_frame_i = i;
                            _current_time = _frames[i].Age;
                            PlayJpegFrame();
                            TriggerProgress2();
                            break;
                        }
                    }
                }

                function TriggerProgress(e) {
                    _current_time += 250;
                    if (_chunk_content_type === VideoContentType.JPEG) {
                        if (HasValue(_progress_timer))
                            clearTimeout(_progress_timer);
                        if (_paused === false)
                            _progress_timer = setTimeout(TriggerProgress, 250);
                    }
                    TriggerProgress2();
                }

                function TriggerProgress2() {
                    InvokeCallbackArray(_progress_callbacks);
                }

                function CreateImageElem() {
                    if (HasValue(_elem_video)) {
                        DisposeVideoElem(_elem_video);
                        _elem_video = null;
                    }
                    var elem_img = Tag('img', {
                        'class': 'stream_image',
                    });
                    elem_img.one('load', function (e) {
                        UpdateImageElem(e.target);
                    });
                    _elem_video = elem_img;
                }

                function CreateVideoElem() {
                    Log();
                    _elem_video = Tag('video', {
                        id: 'stream_image',
                        muted:'true',
                        autoplay:'',
                        preload:'none',
                    });
                    var elem_video = _elem_video[0];
                    elem_video.addEventListener('timeupdate', TriggerProgress);
                    elem_video.addEventListener('ended', function OnVideoEnded(e) {
                        Log6();
                    });
                    (function BindMediaSource() {
                        _media_source = new MediaSource();
                        elem_video.src = URL.createObjectURL(_media_source);
                    })();
                }

                function ChangeContentElem(ct) {
                    Log();
                    if (ct === VideoContentType.MP4 || ct === VideoContentType.WEBM){
                        CreateVideoElem();
                    }
                    else if (ct === VideoContentType.JPEG)
                        CreateImageElem();
                    else Err();
                    _elem_cell.find('.spinner').remove();
                    _elem_cell.append(_elem_video); // test
                    Layout(); // err..
                    _chunk_content_type = ct;
                }

                var that = this;

                function HandleSourceBufferUpdate(e) {
                    InvokeCallbackArray(_chunk_processed_callbacks);
                }

                var _source_buffer_event_registered = false;

                function MaybeCreateSourceBuffer(content_type) {
                    if (!HasValue(_source_buffer)) {
                        _source_buffer = _media_source.addSourceBuffer(content_type);
                        AddSourceBufferEvent();
                    }
                }

                function AddSourceBufferEvent() {
                    if (_source_buffer_event_registered === true)
                        return;
                    _source_buffer.addEventListener('updateend', HandleSourceBufferUpdate);
                    _source_buffer_event_registered = true;
                }

                function RemoveSourceBufferEvent() {
                    if (_source_buffer_event_registered === false)
                        return;
                    _source_buffer.removeEventListener('updateend', HandleSourceBufferUpdate);
                    _source_buffer_event_registered = false;
                }

                function AppendJpegBuffer(response_data) {
                    var dv = new DataView(response_data);
                    var samples = dv.getUint32(0);
                    Log1('Samples: {0}', samples);
                    var header_len = 4 + 8 * samples;
                    var frame_offset = header_len;
                    var chunk_duration_ms = 0;
                    for (var i = 0; i < samples; ++i) {
                        var frame_time = dv.getUint32(4 + 8 * i);
                        var frame_size = dv.getUint32(4 + 8 * i + 4);
                        var image_chunk = new Uint8Array(response_data, frame_offset, frame_size);
                        var blob = new Blob([image_chunk], {
                            type: 'image/jpeg'
                        });
                        _frames.push(Freeze({
                            Blob: blob, // image blob
                            Time: frame_time, // display time
                            Age: _duration_ms + chunk_duration_ms // time offset relative to start
                        }));
                        frame_offset += frame_size;
                        chunk_duration_ms += frame_time;
                        delete image_chunk;
                    }
                    delete dv;
                    _duration_ms += chunk_duration_ms;
                }

                function HandleDataResponse(e) {
                    Log();
                    var xhr = e.currentTarget;
                    var headers = GetDataHeaders(xhr);
                    Log5('Content-Type: {0}, bytes: {1}, length: {2}', headers.ContentType, xhr.response.byteLength, headers.Length);
                    if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM) {
                        if (!MediaSource.isTypeSupported(headers.ContentType))
                            Err(Fmt('Unsupported archive type: {0}', headers.ContentType));
                    }
                    var chunk_content_type = VideoContentType.FromString(headers.ContentType);
                    if (HasValue(_chunk_content_type) && _chunk_content_type !== chunk_content_type)
                        Err('Archive type change not supported');
                    var correction_ms = 0;
                    if (_first_chunk === true) { // || !HasValue(_chunk_content_type)) {
                        _start_time = headers.StartTime;
                        ChangeContentElem(chunk_content_type);
                    } else {
                        correction_ms = _last_end_time_utcms - headers.StartTime;
                        if (correction_ms > 0) {
                            Log5('correction: {0}', correction_ms);
                            _chunk_offset -= correction_ms;
                        }
                        Log5('offset: {0}', _chunk_offset);
                    }
                    var fn = function () {
                        if (_chunk_content_type === VideoContentType.MP4 ||
                            _chunk_content_type === VideoContentType.WEBM) {
                            MaybeCreateSourceBuffer(headers.ContentType);
                            var chunk = new Uint8Array(xhr.response);
                            if (_first_chunk === false) {
                                chunk = chunk.slice(headers.HeaderLength); // only first header should be used
                                _source_buffer.timestampOffset = _chunk_offset / 1000.0;
                            }
                            _source_buffer.appendBuffer(chunk);
                        } else if (_chunk_content_type === VideoContentType.JPEG) {
                            AppendJpegBuffer(xhr.response);
                            if (_first_chunk === true) {
                                PlayJpegFrame(); // show first frame, will update playback time
                                TriggerProgress2();
                            }
                        } else {
                            Err();
                        }
                        _first_chunk = false;
                        _chunk_offset += headers.EndTime - headers.StartTime;
                        _last_end_time_utcms = headers.EndTime;
                        if (_buffered_end_abs !== headers.EndTime)
                            _buffered_end_abs = headers.EndTime;
                    };
                    if (_first_chunk && (_chunk_content_type === VideoContentType.MP4 ||
                            _chunk_content_type === VideoContentType.WEBM)) {
                        _media_source.addEventListener('sourceopen', fn);
                    } else {
                        fn.call(_that);
                        if (_chunk_content_type === VideoContentType.JPEG)
                            InvokeCallbackArray(_chunk_processed_callbacks);
                    }
                };
                this.HandleDataResponse = HandleDataResponse;
                this.toString = function () {
                    return 'BufferedVideo { }';
                }
                Object.defineProperties(this, {
                    '0': {
                        get: function () {
                            return _that;
                        }
                    },
                    Paused: {
                        get: function () {
                            return _paused;
                        }
                    },
                    BufferRange: {
                        get: function () {
                            if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM)
                                return _elem_video[0].buffered.length === 0 ? [0, 0] : [
                                    _elem_video[0].buffered.start(0),
                                    _elem_video[0].buffered.end(_elem_video[0].buffered.length - 1)
                                ];
                            else if (_chunk_content_type === VideoContentType.JPEG)
                                return [0, _duration_ms / 1000.0];
                            else Err();
                        }
                    },
                    BufferStart: {
                        get: function () {
                            if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM)
                                return _elem_video[0].buffered.length === 0 ? 0 : _elem_video[0].buffered.start(0);
                            else if (_chunk_content_type === VideoContentType.JPEG)
                                return 0.0; // err..
                            else Err();
                        }
                    },
                    BufferEnd: {
                        get: function () {
                            if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM)
                                return _elem_video[0].buffered.length === 0 ? 0 : _elem_video[0].buffered.end(_elem_video[0].buffered.length - 1);
                            else if (_chunk_content_type === VideoContentType.JPEG)
                                return _duration_ms / 1000.0; // TODO return jpeg currentTime
                            else Err();
                        }
                    },
                    BufferEndUms: {
                        get: function () {
                            return _buffered_end_abs;
                        },
                        set:function(v){
                            _buffered_end_abs = v;
                        }
                    },
                    CurrentTime: {
                        get: function () {
                            if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM)
                                return _elem_video[0].currentTime;
                            else if (_chunk_content_type === VideoContentType.JPEG)
                                return _current_time / 1000.0;
                            else Err();
                        },
                        set: function (v) {
                            if (_chunk_content_type === VideoContentType.MP4 || _chunk_content_type === VideoContentType.WEBM)
                                _elem_video[0].currentTime = v;
                            else if (_chunk_content_type === VideoContentType.JPEG) {
                                SeekWithinBuffer(v);
                            } else Err();
                        }
                    },
                    OnProgress: {
                        set: function (v) {
                            EnsureFunc(v);
                            _progress_callbacks.push(v);
                        }
                    },
                    OnChunkProcessed: {
                        set: function (v) {
                            EnsureFunc(v);
                            _chunk_processed_callbacks.push(v);
                        }
                    },
                    ContentType: {
                        get: function () {
                            return _chunk_content_type;
                        }
                    },
                    FirstChunk: {
                        get: function () {
                            return _first_chunk;
                        },
                        set:function(v){
                            _first_chunk = v;
                        }
                    }
                });
                {
                    Freeze(this);
                }
            }
            Freeze(ns_root.BufferedVideo.prototype);
            Freeze(ns_root.BufferedVideo);
        })(_root_namespace);
        var _archive_mode = false;

        (function (ns_root) {
            var _ = new (function () {
                }
            )();
            ns_root.CellController = function CellController(elem_cell) {
                if (!IsJQuery(elem_cell) || elem_cell.length < 1)
                    Err();
                if (!elem_cell.hasClass('cell'))
                    Err('Invalid root element');
                var _that = this;
                var _elem_cell = elem_cell;
                var SET_STALLED_TIMEOUT = 6000;//3000
                // root layout cell element
                var _id = elem_cell.attr('id');
                var _selected = false;
                // selection frame
                var _stalled = false;
                // this is set when 'onprogress()' is not being fired for a while
                var _zoom_mode = false;
                // sphere mode toggle
                var _restart_timer;
                var _elem_header;
                var _elem_footer;
                var _device;
                // device object (received by event)
                var _live_content_type;
                // device codec
                var _ptz_active = false;
                // pantilt command was issued and not yet stopped
                var _preset_list_active = false;
                // preset list state
                var _image_dimensions;
                //actual video dimensions
                var _elem_video = null;
                // stores created video elements for better termination
                var _layout_cell_position;
                // cell location within layout
                var _that_cc = this;
                var _bump_progress_timer;
                var _un_progress_timer;
                var _is_on_video_progress = false;
                // timer cancellation

                var fn_delayed_bump_progress = function (x) {
                    clearTimeout(_bump_progress_timer);
                    _bump_progress_timer = setTimeout(function () {
                        SetStalled.apply(_that);
                    }, 5000);
                }
                var fn_check_un_progressed = function (x) {
                    clearTimeout(_un_progress_timer);
                    var _deviceFound = window.DevicesData.find(x => parseInt(x.cctv_id) == parseInt(_device.Id));
                    if (!_is_on_video_progress && _deviceFound) {
                        Log('fn_check_un_progressed:{0}', _is_on_video_progress);
                        _un_progress_timer = setTimeout(function () {
                            SetStalled.apply(_that);
                        }, 10000);
                    }
                }
                var _ctx = Seal({
                    PlaybackTimeUms: null,
                });
                var _ctx_archive = Seal({
                    BufferManager: new BufferManager(),
                    VeryStart: null,
                });
                this.VideoElem = function () {
                    return _elem_video;
                }
                this.CellElem = function () {
                    return _elem_cell;
                }
                this.ClearTimer = function () {
                    Log2_('Clear previous data:{0}', _device);
                    clearTimeout(_bump_progress_timer);
                    clearTimeout(_un_progress_timer);
                    _is_on_video_progress = true;
                    _stalled = false;
                    delete this;
                }

                function Init() {
                    Log();
                    _stalled = false;
                    _elem_header = null;
                    _elem_footer = null;
                    _ptz_active = false;
                    _preset_list_active = false;
                    _image_dimensions = null;
                    _live_content_type = VideoContentType.Unknown;
                    _zoom_mode = false;
                    _elem_video = null;
                    ClearStalled();
                }

                function Save() {
                    if (_archive_mode === true)
                        return;
                    Cookies.set(_elem_cell.attr('id'), HasValue(_device) ? _device.Title : '');
                }

                this.Save = Save;

                function SetDevice(id) {
                    _device = _controller.Devices[id];
                }

                this.SetDevice = SetDevice;

                function ChangeDevice(id) {
                    Log();
                    Respawn();
                    _device = _controller.Devices[id];
                    if (!HasValue(_device))
                        return;
                    _device.UpdateArchiveBoundaries(function () {
                        if (_archive_mode === false) {
                            AddMediaContainer();
                        } else {
                            AddArchiveMediaContainer();
                        }
                    });
                }

                this.ChangeDevice = ChangeDevice;

                function StopVideo() {
                    if (!HasValue(_elem_video))
                        return;
                    if (HasValue(_bump_progress_timer)) {
                        Log5('clearTimeout()');
                        clearTimeout(_bump_progress_timer);
                    }
                    if (HasValue(_restart_timer))
                        clearTimeout(_restart_timer);
                    Log1('Stopping: {0}', _device.Title);
                    DisposeVideoElem(_elem_video);
                }

                this.StopVideo = StopVideo;

                function Respawn() {
                    Log();
                    StopVideo();
                    var sel = _selected;
                    Init.call(_that);
                    _selected = sel;
                    // keep selection
                    var cc = _elem_cell.data('cc');
                    _elem_cell.empty();
                    //find('*').remove(); // recursive removal
                    _elem_cell.html(_elem_cell.html());
                    _elem_cell.data('cc', cc);
                    // restore associated cell controller
                    if (HasValue(_device)) {
                        var sv = _controller.GetServerById(_device.ServerId);
                        if (!sv.EventsConnected)
                            CreateMessage("Disconnected");
                    }
                }

                this.Respawn = Respawn;
                this.HandleResize = function HandleResize() {

                }
                this.HandleSelectedCellChange = function () {
                    _elem_cell.css('border-color', _selected ? _g.Colors.StandoutHigh : '#333');
                    if (_selected)
                        _elem_cell.addClass('cell_active');
                    else
                        _elem_cell.removeClass('cell_active');
                    SetStateBackground();
                }
                function PlayLiveMedia(){
                    StopVideo();
                    ArchiveInit();
                    SwitchToLive.call(ns_root);
                    ForceLayoutUpdate();
                }
                this.PlayLiveMedia = PlayLiveMedia;
                function PlayArchiveMedia(fromUtcms,toUtcms) {
                    Log3(_device.Title);
                    SwitchToArchive.call(ns_root);
                    _controller.DropQues();
                    StopAllVideos();
                    _elem_cell.empty();
                    _elem_cell.addClass('archive_playback');
                    ForceLayoutUpdate();
                    Respawn();
                    ArchiveInit();
                    _play_from_utcms = fromUtcms;
                    _play_to_utcms = toUtcms;
                    setTimeout(AddArchiveMediaContainer,500);
                }

                this.PlayArchiveMedia = PlayArchiveMedia;

                function CreateBannerElem(txt) {
                    return Tag('div', {
                        'class': 'ycenter spinner cell_message',
                        style: {
                            'pointer-events': 'none',
                            'z-index': '10'
                        },
                        $: txt
                    });
                }

                function SetStateBackground() {
                    if (_stalled) {
                        _elem_cell.css('background-color', _g.Colors.CellStalled);
                        return;
                    }
                    var wish_color = _selected ? _g.Colors.CellSelected : _g.Colors.CellDefault;
                    var curr_color = rgb2hex(_elem_cell.css('background-color'));
                    if (!HasValue(curr_color) || curr_color !== s2l(wish_color))
                        _elem_cell.css('background-color', wish_color);
                }

                function rgb2hex(rgb) {
                    if (!HasValue(rgb))
                        return _g.Colors.DefaultBackground;
                    var match = null;
                    if (rgb === 'transparent')
                        rgb = _g.Colors.DefaultBackground;
                    else
                        match = rgb.match(/^rgb(a)?\((\d+),\s*(\d+),\s*(\d+)(,\s*)?(\d+)?\)$/);
                    if (HasValue(match)) {
                        if (HasValue(match[6]) && LeadingZero2(match[6]) !== '00') {
                            Log1('Alpha value truncated');
                        }
                        return '#' + LeadingZero2(match[2]) + LeadingZero2(match[3]) + LeadingZero2(match[4]);
                    } else {
                        return '#000';
                    }
                    // err unknown value
                }

                function s2l(arg) {
                    if (arg.length === 4 && arg[0] === '#') {
                        return arg[0] + arg[1] + arg[1] + arg[2] + arg[2] + arg[3] + arg[3];
                    }
                    Err('bad arg');
                    return null;
                }

                function ClearStalled() {
                    _stalled = false;
                    SetStateBackground();
                }

                function SetStalled() {
                    Log1('SetStalled');
                    if (!HasValue(_device))
                        return;
                    _stalled = true;
                    SetStateBackground();
                    if (HasValue(_restart_timer))
                        clearTimeout(_restart_timer);
                    _restart_timer = setTimeout(function () {
                        if (_stalled)
                            ChangeDevice.call(_that, _device.Id)
                    }, SET_STALLED_TIMEOUT);//3000
                }

                this.SetStalled = SetStalled;


                var _play_from_utcms = null; // current buffering start position
                var _play_to_utcms = null; // current buffering end position
                _ctx_archive.VeryStart = 0; // playback start (used to calculate current playback time)
                var _chunk_in_progress = false; // used to avoid avoid fetching multiple chunks while chunk being fetched is being appended
                var _timeline = new TimelineData();
                var _timeline_range_index = 0;
                var _timeline_edge_utcms = 0;
                var _first_timeline_update = true;
                var __chunk_in_progress_timeout = null;
                var _end_time_buffer = 0;

                function ArchiveInit() {
                    Log();
                    _play_from_utcms = null; // playback start/continue time
                    _play_to_utcms = null; // current buffering end position
                    _ctx_archive.VeryStart = 0; // playback start (used to calculate current playback time)
                    _chunk_in_progress = false;
                    _timeline_edge_utcms = 0;
                    _timeline_range_index = 0;
                    _first_timeline_update = true;
                    delete _timeline;
                    _timeline = new TimelineData();
                    _ctx_archive.BufferManager.Clear();
                    delete _ctx_archive.BufferManager;
                    _ctx_archive.BufferManager = new BufferManager();
                }

                this.ArchiveInit = ArchiveInit;

                function ToUms(s) {
                    EnsureNumber(s);
                    var re = parseFloat(s.toFixed(3)) * 1000 + _ctx_archive.VeryStart;
                    return re;
                }

                function ToRelTime(ums) {
                    return (ums - _ctx_archive.VeryStart) / 1000.0;
                }

                function RestartArchiveFrom(fromUtcms) {

                }

                function FindClosestBoundary(boundaries, dir, utcms) {
                    var min_prev;
                    var closest_prev;
                    var min_next;
                    var closest_next;
                    var keys = Object.keys(boundaries);
                    for (var i = 0; i < keys.length; ++i) {
                        var item = boundaries[keys[i]];
                        var diff;
                        if (item.From < utcms && item.To < utcms) {
                            diff = utcms - item.To;
                            if (!HasValue(min_prev) || diff < min_prev) {
                                min_prev = diff;
                                closest_prev = item;
                            }
                        } else if (item.From > utcms && item.To > utcms) {
                            diff = item.From - utcms;
                            if (!HasValue(min_next) || diff < min_next) {
                                min_next = diff;
                                closest_next = item;
                            }
                        } else {
                            Log1('Warning: item inside of range');
                        } // should have been found by previous loop
                    }
                    if (dir < 0) {
                        if (HasValue(closest_prev)) {
                            var tmp = closest_prev.To - 1000 * 60 * 5;
                            if (tmp < closest_prev.From) {
                                Log1('Warning: previous archive range is short');
                                tmp = closest_prev.To - 1000 * 60;
                                if (tmp < closest_prev.From)
                                    return null; // no-op
                            }
                            return tmp;
                        } else {
                            return null; // no-op
                        }
                    } else {
                        if (HasValue(closest_next)) {
                            return closest_next.From;
                        } else {
                            return null; // no-op
                        }
                    }
                }

                function FindValidStartPoint(dir, wish_pos_utcms) {
                    var can_seek = false;
                    var seek_utcms = null;
                    var boundaries = _device.ArchiveBoundaries;
                    var keys = Object.keys(boundaries);
                    for (var i = 0; i < keys.length; ++i) {
                        var item = boundaries[keys[i]];
                        if (item.InRange(wish_pos_utcms)) {
                            seek_utcms = wish_pos_utcms;
                            can_seek = true;
                            break;
                        }
                    }
                    if (can_seek === false) {
                        seek_utcms = FindClosestBoundary(boundaries, dir, wish_pos_utcms);
                        if (!HasValue(seek_utcms)) {
                            Log1('Warning: nowhere to seek');
                            return null;
                        }
                    }
                    return seek_utcms;
                }

                function RelativeSeek(s) {
                    EnsureNumber(s);
                    if (s === 0) return;
                    if (!(_elem_video instanceof BufferedVideo))
                        Err('bad video controller elem');
                    var elem_video = _elem_video;
                    if (!HasValue(elem_video.ContentType)) {
                        RestartArchiveFrom(_play_from_utcms);
                        return; // video element not displayed yet
                    }
                    var curr_time_s = elem_video.CurrentTime;
                    var buf_start_s = elem_video.BufferStart;
                    var buf_end_s = elem_video.BufferEnd;
                    var wish_pos_s = curr_time_s + s;
                    if (wish_pos_s > buf_start_s && wish_pos_s < buf_end_s) { // within fetched data
                        Log();
                        elem_video.CurrentTime = wish_pos_s;
                        return;
                    }
                    var wish_pos_utcms = Round(ToUms(wish_pos_s));
                    var p = FindValidStartPoint(s, wish_pos_utcms);
                    if (HasValue(p))
                        RestartArchiveFrom(p);
                }

                function AbsoluteSeek(utcms) {
                    if (_archive_mode !== true)
                        return;
                    Log();
                    var pp = FindValidStartPoint(1, utcms);
                    var pn = FindValidStartPoint(-1, utcms);
                    var closest;
                    var diff_pp;
                    if (HasValue(pp))
                        diff_pp = Math.abs(utcms - pp);
                    var diff_pn;
                    if (HasValue(pn))
                        diff_pn = Math.abs(utcms - pn);
                    var time;
                    if (HasValue(diff_pp) && HasValue(diff_pn)) {
                        var use_pp = (diff_pp < diff_pn);
                        closest = (use_pp) ? pp : pn;
                        time = use_pp ? closest - 1000 * 60 * 5 : closest;
                    } else if (HasValue(diff_pp)) {
                        time = pp - 1000 * 60 * 5;
                    } else if (HasValue(diff_pn)) {
                        time = pn;
                    }
                    if (HasValue(time))
                        RestartArchiveFrom(time);
                    else
                        Log1('Warning: Will not seek outside boundaries');
                }

                this.AbsoluteSeek = AbsoluteSeek;
                var TimelineSecondsVisibleForward = 30;

                function MsPerPixel(w) {
                    EnsureNumber(w);
                    var ms_visible = TimelineSecondsVisibleForward * 2 * 1000; //
                    return ms_visible / w;
                }

                function GetTimeline(utcms, x) {
                    EnsureNumbers(_play_from_utcms, _play_to_utcms);
                    var url = Fmt('/archive/{0}/timeline?start={1}&end={2}&interval=1000', _device.Id, _play_from_utcms, _play_to_utcms);
                    var pps = [];
                    for (var i = 0; i < _device.ArchiveServerIds.length; ++i) {
                        var p = (function(sv, from, to) {
                            return new Promise(function(yes, no) {
                                try {
                                    sv.Query(AjaxJson, {
                                        url: url,
                                        success: function HandleTimelineResponse(response_data, text_status, request) {
                                            try {
                                                var data;
                                                if (response_data.length < 1) {
                                                    Log('No timeline data on server {0}', sv.Id);
                                                    data = [];
                                                } else {
                                                    Log4(PrintObj(response_data));
                                                    Log('Timeline data found on server {0}', sv.Id);
                                                    data = response_data;
                                                }
                                                EnsureArray(data);
                                                var ranges = [];
                                                for (var i = 0; i < data.length; ++i) {
                                                    var range = new Range([data[i][0], data[i][1]], sv.Id);
                                                    ranges.push(range);
                                                }
                                                yes(Freeze({
                                                    Ranges: ranges,
                                                    From: from,
                                                    To: to
                                                }));
                                            } catch (err) {
                                                yes({
                                                    Ranges: [],
                                                    From: from,
                                                    To: to
                                                });
                                            }
                                        },
                                        error: no,
                                    });
                                } catch (err) {
                                    no();
                                }
                            });
                        })(_controller.Servers[_device.ArchiveServerIds[i]], _play_from_utcms, _play_to_utcms);
                        pps.push(p);
                    }
                    Promise.all(pps).then(function(v) {
                        Log1('Timeline waitall finished');
                        var all_ranges = [];
                        var from;
                        var to;
                        for (var i = 0; i < v.length; ++i) {
                            var ranges = v[i].Ranges;
                            all_ranges = all_ranges.concat(ranges);
                            from = v[i].From;
                            to = v[i].To;
                        }
                        EnsureValues(from, to);
                        _timeline.AddRanges2(from, to, all_ranges);
                        if (IsFunc(x)) {
                            setTimeout(x, 1);
                        }
                    });
                }

                function OnTimeUpdate() {
                    if (!(_elem_video instanceof BufferedVideo))
                        Err('bad video controller elem');
                    if (!HasValue(_device) || !_device.HasArchive)
                        Err('No archive data expected for {0}', _device.Title);
                    var curr_time_s = _elem_video.CurrentTime;
                    var buf_end_s = _elem_video.BufferEnd;
                    var curr_time_utcms = ToUms(curr_time_s);
                    _ctx.PlaybackTimeUms = curr_time_utcms;
                    var current_chunk_num = _ctx_archive.BufferManager.GetCurrentChunk(curr_time_utcms);
                    var is_data_range = _timeline.IsDataRange(curr_time_utcms);
                    Log2_('Playing.. BVid: {0}/{1}; BMgr: ?/{2}, chunk {3}, data: {4}',
                        Round(curr_time_s),
                        Round(buf_end_s),
                        Round(_ctx_archive.BufferManager.Length / 1000.0),
                        current_chunk_num || 0,
                        is_data_range);
                    if (curr_time_utcms >= _timeline.Ranges[_timeline_range_index].To - 1000){
                        Log2_('Play end of archive:{0}-{1}',curr_time_utcms,_timeline.Ranges[_timeline_range_index].To);
                        if(_timeline_range_index < _timeline.Ranges.length - 1)
                        {
                            _timeline_range_index++;
                            OnChunkNeeded();
                        }else{
                            _elem_video.Pause();
                        }
                    }
                    if (curr_time_utcms < _timeline.Ranges[_timeline_range_index].To - 1000) {
                        if(buf_end_s - curr_time_s < 20){
                            OnChunkNeeded();
                        }
                    }
                }

                function OnChunkNeeded() {
                    if (_chunk_in_progress === true)
                        return;
                    if(_timeline.Ranges.length == 0) return;
                    var end = _elem_video.BufferEndUms;
                    var next_time = EnsureNumber(_elem_video.FirstChunk ? _timeline.Ranges[_timeline_range_index].From : end);
                    var sv = _device.GetServer();
                    var sv_id = sv.Id;
                    _chunk_in_progress = true;
                    Log2_('Chunk in progress{0}',next_time);
                    var auth = _controller.Servers[sv_id].Auth;
                    var auth_needed = auth.AuthNeeded;
                    var host = auth.Host;
                    var url = Fmt('/archive/{0}/stream?time={1}', _device.Id, next_time);
                    Log4('Data expected on {0}, {1}', sv_id, HttpOrHttps() + '//' + host + url);
                    var xhr = new XMLHttpRequest;
                    xhr.open('get', HttpOrHttps() + '//' + host + url);
                    xhr.timeout = 7000;
                    if (auth_needed) {
                        var dh = _controller.Servers[sv_id].Auth.GetDigestHeader('GET', HttpOrHttps() + '//' + host + url);
                        xhr.setRequestHeader('Authorization', dh);
                    }
                    xhr.responseType = 'arraybuffer';
                    xhr.onload = function OnChunkLoad(e) {
                        Log4();
                        _elem_video.HandleDataResponse(e);
                    }
                    xhr.onreadystatechange = function OnReadyStateChange(e) {
                        if (xhr.readyState === 2) {
                            Log5(xhr.getAllResponseHeaders());
                            var headers = GetDataHeaders(e.currentTarget);
                            _ctx_archive.BufferManager.AddRange(new Range([headers.StartTime, headers.EndTime]));
                        }
                    }
                    xhr.onloadend = function OnChunkLoad(e) {
                        /* clearTimeout(__chunk_in_progress_timeout);
                         __chunk_in_progress_timeout = setTimeout(function(){
                             if(_chunk_in_progress){
                                 _timeline_range_index++;
                                 _elem_video.FirstChunk = true;
                                 _chunk_in_progress = false;
                                 OnChunkNeeded();
                             }
                         },10000)*/
                    }
                    xhr.onerror = function(e){
                        alert (e)
                    }
                    xhr.send();

                }

                function HandleAjaxError(request, text_status, request_error) {
                    var tmp = request_error.getResponseHeader('X-VMS-Error');
                    var message;
                    if (HasValue(tmp))
                        message = Fmt('Server error {0}', tmp);
                    else
                        message = "Connection error";
                    Log1(message);
                    CreateMessage(message);
                    SetStalled();
                }

                function CreateMessage(message) {
                    if (!HasValue(_device))
                        return;
                    var elem_banner = CreateBannerElem(message);
                    var elem_spinner = _elem_cell.find('.spinner');
                    if (elem_spinner.length < 1)
                        _elem_cell.append(elem_banner);
                    else
                        elem_spinner.replaceWith(elem_banner);
                }

                this.CreateMessage = CreateMessage;

                function CreateSpinner() {
                    var spinner_id = 'spinner_' + Guid();
                    var spinner = CreateBannerElem('Loading..')
                        .attr('id', spinner_id)
                        .addClass('icon_spin');
                    setTimeout(function () {
                        $('#' + spinner_id).replaceWith(CreateBannerElem('Waiting..'));
                    }, 15000);
                    var elem_spinner = _elem_cell.find('.spinner');
                    if (elem_spinner.length < 1)
                        _elem_cell.append(spinner);
                    else
                        elem_spinner.replaceWith(spinner);
                }

                function AddMediaContainer() {
                    if (!_device) return;
                    CreateSpinner();
                    var stream_location = _device.StreamLocation2;
                    //GetLiveQueryLocation(_device);
                    Log4('{0}', stream_location);
                    var sv = _device.GetServer();
                    sv.Query(Ajax, {
                        type: 'HEAD',
                        url: stream_location,
                        success: HandleContainerHeadResponse,
                        error: HandleAjaxError
                    });
                }

                function AddArchiveMediaContainer() {
                    CreateSpinner();
                    _ctx_archive.VeryStart = _play_from_utcms;
                    _elem_video = new BufferedVideo(_elem_cell);
                    _elem_video.OnProgress = OnTimeUpdate;
                    _elem_video.OnChunkProcessed = function() { // ...
                        Log1('Chunk finished');
                        _chunk_in_progress = false;
                    };
                    GetTimeline(_play_from_utcms, OnChunkNeeded);
                }
                function CreateVideoElem(content_type, stream_location) {
                    var elem_video = null;
                    switch (_live_content_type) {
                        case VideoContentType.MP4:
                        case VideoContentType.WEBM:
                            _elem_video = (function CreateVideoElemImpl() {
                                return Tag('video', {
                                    autoplay: '',
                                    preload: 'none',
                                    style: {
                                        height: '100%'
                                    },
                                    $source: {
                                        src: stream_location,
                                        type: content_type
                                    }
                                });
                                //.on('remove', function (e) { StopVideo(); });
                            })();
                            elem_video = _elem_video[0];
                            _is_on_video_progress = false;
                            var smth = new (function EventHandler() {
                                    var _that = this;
                                    this.Deleted = false;
                                    this.OnLoadedVideoMetaData = function OnLoadedVideoMetaData(e) {
                                        if (_that.Deleted === true)
                                            return;
                                        ClearStalled();
                                        _image_dimensions = new CSize(e.target.videoWidth, e.target.videoHeight);
                                        Log('Video size for {0}: {1}x{2}', _device.Title, _image_dimensions.Width, _image_dimensions.Height);
                                    }
                                    ;

                                    function FixLatency(x) {
                                        if (x.buffered.length === 0)
                                            return;
                                        if (x.buffered.length > 1)
                                            Err('buffered');
                                        var ct = x.currentTime;
                                        if (!HasValue(ct))
                                            Err('currentTime');
                                        var buf_end = x.buffered.end(x.buffered.length - 1);
                                        // always use last buffered range
                                        var diff = buf_end - ct;
                                        if (diff > 3) {
                                            Log1('Stream latency -{0}', Round(diff));
                                            x.currentTime = ct + diff - 0.5;
                                        }
                                    }
                                    ;this.OnVideoProgress = function OnVideoProgress(e) {
                                        if (_that.Deleted === true)
                                            return;
                                        if (_elem_video == null)
                                            return;
                                        ClearStalled();
                                        fn_delayed_bump_progress(elem_video);
                                        _is_on_video_progress = true;
                                        var x = _elem_video[0];
                                        if (x.buffered.length === 0)
                                            return;
                                        var ct = x.currentTime;
                                        var buf_end = x.buffered.end(x.buffered.length - 1);
                                        // always use last buffered range
                                        var diff = buf_end - ct;
                                        LogD5('[{3}] curr: {0}, buf_end: {1}, diff: {2}', Round(ct), Round(buf_end), Round(diff), _device.Title);
                                    }
                                    ;
                                    this.OnVideoError = function OnVideoError(e) {
                                        Log1('deleted: {0}', _that.Deleted);
                                    }
                                    ;
                                }
                            )();
                            _elem_video.data('event_state_object', smth);

                            elem_video.onloadedmetadata = smth.OnLoadedVideoMetaData;
                            elem_video.onprogress = smth.OnVideoProgress;
                            elem_video.onerror = smth.OnVideoError;
                            fn_check_un_progressed(elem_video);
                            break;
                        default:
                            Err();
                    }
                    _elem_cell.empty();
                    _elem_cell.append(elem_video);
                    Log2('Stream started: {0}', _device.Title);
                }

                function HandleContainerHeadResponse(response_data, status_text, request) {
                    if (request.status !== 204) {
                        Log('Bad server response');
                        CreateMessage('Stream error');
                        return;
                    }
                    if (!(status_text === 'nocontent' || status_text === 'No Content'))
                        Err('Bad server response');
                    var content_type = request.getResponseHeader('Content-Type');
                    if (!HasValue(content_type))
                        Err('Content-type header not set');
                    Log6('{0}, Content-Type: {1}', request.status, content_type);
                    if (content_type === 'blocked') {
                        return;
                    }
                    _live_content_type = VideoContentType.FromString(content_type);
                    var stream_location;
                    var token = Guid();
                    var url = _device.StreamLocation3 + '&token=' + token;
                    var sv = _device.GetServer();
                    sv.Query(Ajax, {
                        url: url,
                        success: function (a, b, c) {
                            stream_location = _device.StreamLocation + '/retrieveLiveStreamByToken?token=' + token;
                            CreateVideoElem(content_type, stream_location);
                        },
                        error: HandleAjaxError
                    });
                }

                Object.defineProperties(this, {
                    VideoElem: {
                        get: function () {
                            return _elem_video;
                        }
                    },
                    Id: {
                        get: function () {
                            return _id;
                        }
                    },
                    LayoutPosition: {
                        get: function () {
                            return _layout_cell_position;
                        }
                    },
                    Active: {
                        get: function () {
                            return _selected;
                        },
                        set: function (v) {
                            _selected = v;
                            _that.HandleSelectedCellChange();
                        }// Consider setting others to inactive
                    },
                    Device: {
                        get: function () {
                            return _device;
                        }
                    },
                    DeviceTitle: {
                        get: function () {
                            return HasValue(_device) ? _device.Title : null;
                        }
                    },
                    PanTiltUrl: {
                        get: function () {
                            return '/ptz/' + _device.Id + '/';
                        }
                    },
                });
                this.GetContextA = function (scope) {
                    if (scope !== _)
                        Err('access');
                    return _ctx_archive;
                }
                this.GetContext = function (scope) {
                    if (scope !== _)
                        Err('access');
                    return _ctx;
                }
                {
                    Freeze(this);
                }
            }
            ns_root.CellController.prototype = Freeze({
                get BufferManager() {
                    return this.GetContextA(_).BufferManager;
                },
                get VeryStart() {
                    return this.GetContextA(_).VeryStart;
                },
                get PlaybackUms() {
                    return this.GetContext(_).PlaybackTimeUms;
                },
            });
            Freeze(ns_root.CellController.prototype);
            Freeze(ns_root.CellController);
        })(_root_namespace);

        function CellControllerCollection() {
            var _cell_controllers = [];
            this.Contains = function Contains(fn_pre) {
                if (!IsFunc(fn_pre))
                    Err('Bad predicate');
                for (var i = 0; i < _cell_controllers.length; ++i) {
                    if (fn_pre(_cell_controllers[i]))
                        return true;
                }
                return false;
            };
            this.Add = function Add(cc) {
                if (!(cc instanceof CellController))
                    Err('Arg should be an instance of CellController');
                if (this.Contains(function (x) {
                        return x === cc;
                    }))
                    Err('Sequence already contains such object');
                _cell_controllers.push(cc);
            };
            this.Replace = function Replace(cc) {
                for (var i = 0; i < _cell_controllers.length; ++i) {
                    if (cc === _cell_controllers[i]) {
                        var elem_cell = cc.CellElem();
                        _cell_controllers[i] = new CellController(elem_cell);
                        elem_cell.data('cc', _cell_controllers[i]);
                        return _cell_controllers[i];
                    }
                }
                Err('Could not match controller');
            }
            this.Clear = function Clear() {
                for (var i = 0; i < _cell_controllers.length; ++i) {
                    _cell_controllers[i].ClearTimer();
                }
                _cell_controllers = [];
            }
            this.Select = function Select(cc) {
                for (var i = 0; i < _cell_controllers.length; ++i)
                    _cell_controllers[i].Active = (_cell_controllers[i] === cc);
            }
            this.Each = function Each(fn_each) {
                for (var i = 0; i < _cell_controllers.length; ++i)
                    fn_each(_cell_controllers[i]);
            }
            Object.defineProperties(this, {
                Items: {
                    get: function () {
                        return _cell_controllers.slice();
                    }
                },
                Selected: {
                    get: function () {
                        for (var i = 0; i < _cell_controllers.length; ++i)
                            if (_cell_controllers[i].Active)
                                return _cell_controllers[i];
                        return null;
                    }
                }
            });
            {
                Freeze(this);
            }
        }

        Freeze(CellControllerCollection);
        (function (ns_root) {
            var _ = new (function () {
                }
            )();
            ns_root.AppController = function AppController() {
                this.Devices = new Object();
                this.Servers = new Object();
                var _evss = [];
                var _that = this;
                var HANDLE_FIRST_EVENT_TIMEOUT = 300;//100
                var EVENT_STREAM_SUBSCRIBE_TIMEOUT = 300;//100
                var _active_cc = null;
                var _ctx = Seal({
                    Host: null,
                    Connected: false,
                });
                this.ClearEvss = function () {
                    _evss = [];
                }
                this.GetServerById = function GetServerById(id) {
                    var sv_keys = Object.keys(_that.Servers);
                    for (var i = 0; i < sv_keys.length; ++i) {
                        var smth = Number(sv_keys[i]);
                        if (smth === id)
                            return _that.Servers[smth];
                    }
                    return null;
                }

                function HandleDeviceClick(x) {
                    EnsureValue(x);
                    delete this._active_cc;
                    var elem_active_cell = $('#vid_' + x);
                    var active_cc = elem_active_cell.data('cc');
                    active_cc.SetDevice(x);
                    active_cc.Save();
                    _active_cc = active_cc;
                }

                this.HandleDeviceClick = HandleDeviceClick;
                function HandleLiveClick() {
                    _active_cc.ClearTimer();
                    _active_cc.PlayLiveMedia();
                }
                this.HandleLiveClick = HandleLiveClick;
                function HandleArchiveClick(fromUtcms,toUtcms) {
                    _active_cc.ClearTimer();
                    _active_cc.PlayArchiveMedia(fromUtcms,toUtcms);
                }
                this.HandleArchiveClick = HandleArchiveClick;

                function UpdateChannelList() {
                    var elem_devices_box = $('#devices_box');
                    if (elem_devices_box.length < 1)
                        return;
                    if (_setup_shown)
                        return;
                    elem_devices_box.empty();
                    var a = [];
                    var keys = Object.keys(_that.Devices);
                    for (var i = 0; i < keys.length; ++i) {
                        var smth = Number(keys[i]);
                        a.push(_that.Devices[smth]);
                    }
                    a.sort(function (a, b) {
                        return a.Title.localeCompare(b.Title);
                    });
                    var elem_devices_box_helper = Tag('div', {
                        id: 'devices_box_helper'
                    });
                    elem_devices_box.append(elem_devices_box_helper);
                    var fn = function (key, item) {
                        var wrapping_elem = Tag('div', {
                            height: '32px;'
                        });
                        var elem_channel_clickable = Tag('a', {
                            href: '#',
                            $div: {
                                'class': 'linkblock common_container',
                                style: {
                                    'white-space': 'nowrap',
                                    overflow: 'hidden'
                                },
                                $div: [{
                                    'class': 'ycenter icon emb_icon_cams_24',
                                    $: '\u00A0'
                                }, // &nbsp;
                                    {
                                        'class': 'ycenter inline',
                                        $: item.Title
                                    }]
                            }
                        });
                        wrapping_elem.append(elem_channel_clickable);
                        elem_devices_box_helper.append(wrapping_elem);
                        wrapping_elem.click(function () {
                            HandleDeviceClick(item.Id);
                        });
                        var outer_h = wrapping_elem.outerHeight(true);
                        return outer_h;
                    }
                    var total_height = 32;
                    for (var i = 0; i < a.length; ++i) {
                        fn(null, a[i]);
                        total_height += 32;
                    }
                    $('#devices_box_helper').css('height', total_height);
                }
                ;this.UpdateChannelList = UpdateChannelList;
                var _event_source = null;
                var _events_received = false;
                var _registered = {};

                function HandleFirstEvent() {
                    setTimeout(function () {
                        if (_ctx.Connected) {
                            window.DevicesData.map(function (item) {
                                _controller.HandleDeviceClick(item.cctv_id);
                            });
                            LoadLayoutCameras();
                            _events_received = true;
                        }
                    }, HANDLE_FIRST_EVENT_TIMEOUT);
                }

                this.HandleFirstEvent = HandleFirstEvent;
                ;

                function EventStreamSubscribeImpl() {
                    Log('EventStreamSubscribeImpl');
                    var event_url = HasValue(_ctx.Host) ? Fmt(HttpOrHttps() + '//{0}/channels', _ctx.Host) : Fmt(HttpOrHttps() + '//{0}/channels', _l_options.host);
                    Log(event_url);
                    _event_source = new window.EventSource2(event_url, {
                        Server: _that.Servers[101]
                    });
                    _event_source.onopen = function (e) {
                        _ctx.Connected = true;
                        _events_received = false;
                        Log('Event stream started');
                        SwitchToLive.call(ns_root);
                    };
                    RegisterMainEventSource(_event_source);
                }

                function RegisterMainEventSource(evs) {
                    evs.onerror = _that.HandleEventStreamError;
                    RegisterEventSource(evs);
                }

                function RegisterEventSource(evs) {
                    evs.onmessage = function (e) {
                        Log1('Event message');
                    };
                    evs.addEventListener('added', function (event) {
                        _that.HandleUpdatedChannels(JSON.parse(event.data));
                    });
                    evs.addEventListener('removed', function (event) {
                        _that.HandleRemovedChannels(JSON.parse(event.data));
                    });
                    evs.addEventListener('updated', function (event) {
                        _that.HandleUpdatedChannels(JSON.parse(event.data));
                    });
                }

                function EventStreamSubscribe() {
                    setTimeout(EventStreamSubscribeImpl, EVENT_STREAM_SUBSCRIBE_TIMEOUT)
                }
                ;this.EventStreamSubscribe = EventStreamSubscribe;
                this.HandleEventStreamError = function HandleEventStreamError(e) {
                    _ctx.Connected = false;
                    var failed_server = e.target.GetServer();
                    var sv_keys = Object.keys(_that.Servers);
                    for (var i = 0; i < sv_keys.length; ++i) {
                        var smth = Number(sv_keys[i]);
                        if (smth === failed_server.Id)
                            _that.Servers[smth].ResetDigestAuth();
                    }
                    _cell_controllers.Each(function (cc) {
                        if (cc.Device.ServerId !== failed_server.Id)
                            return;
                        cc.Respawn();
                        cc.CreateMessage("Disconnected");
                        cc.SetStalled();
                    });
                    if (failed_server.Id !== 101)
                        return;
                    var chan_keys = Object.keys(_that.Devices);
                    for (var i = 0; i < chan_keys.length; ++i) {
                        delete _that.Devices[Number(chan_keys[i])];
                    }
                    _that.UpdateChannelList();
                    Log();
                }
                ;
                this.HandleUpdatedChannels = function HandleUpdatedChannelsImpl(data) {
                    if (data.length < 1)
                        return;
                    Log1();
                    var that = this;
                    var channels = EnsureArrayOrDefault(data.channels);
                    for (var i = 0; i < channels.length; ++i) {
                        var device = new Device(channels[i]);
                        if (device.ServerId === 0) {
                            Log('Device with no server');
                            continue;
                        }
                        if (HasValue(that.Devices[device.Id])) {
                            var existing = that.Devices[device.Id];
                            existing.ServerId = device.ServerId;
                            existing.PtzCaps = device.PtzCaps;
                            existing.Presets = device.Presets;
                            for (var x = 0; x < device.ArchiveServerIds.length; ++x) {
                                var found = false;
                                var as_id = device.ArchiveServerIds[x];
                                for (var y = 0; y < existing.ArchiveServerIds.length; ++y) {
                                    var existing_as_id = existing.ArchiveServerIds[y];
                                    if (as_id === existing_as_id) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    existing.ArchiveServerIds.push(as_id);
                                }
                            }
                        } else {
                            that.Devices[device.Id] = device;
                        }
                        Log1("Device {0}: {1} archive servers", device.Id, device.ArchiveServerIds.length);
                    }
                    _that.UpdateChannelList();
                    if (!HasValue(data.servers) || data.servers.length < 1)
                        return;
                    var server_configs = EnsureArrayOrDefault(data.servers);
                    var pps = [];
                    for (var i = 0; i < server_configs.length; ++i) {
                        var sv_config = server_configs[i];
                        if (!HasValue(sv_config.ip) || sv_config.ip.length < 1) {
                            Log('Setting default ip');
                            sv_config.ip = _l_options.host;
                        }
                        var sv = new Server(sv_config, false);
                        if (!HasValue(that.Servers[sv.Id])) {
                            that.Servers[sv.Id] = sv;
                            var p = (function (sv) {
                                return new Promise(function (yes, no) {
                                        try {
                                            sv.Auth.Request(yes);
                                        } catch (err) {
                                            no();
                                        }
                                    }
                                );
                            })(sv);
                            pps.push(p);
                        } else {
                            if (sv.Id === 101)
                                that.Servers[sv.Id].Name = sv.Name;
                        }
                        if (sv.Id === 101) {
                            // TODO use /info
                            /*var title = Fmt('{0} ({1})', sv.Name, _user || '');
                                    document.title = title;
                                    $('.doc_title').html(title);*/
                        }
                    }
                    Promise.all(pps).then(function WaitAllServers(x) {
                        Log2();
                        var keys = Object.keys(_that.Servers);
                        for (var i = 0; i < keys.length; ++i) {
                            var smth = Number(keys[i]);
                            if (smth < 0)
                                continue;
                            if (smth === 101)
                                continue;
                            if (!HasValue(_registered[keys[i]])) {
                                _registered[keys[i]] = true;
                                var sv = _that.Servers[keys[i]];
                                var event_url = Fmt(HttpOrHttps() + '//{0}/channels', sv.Host);
                                Log4('Creating event source on {0}', sv.Host);
                                var evs = new window.EventSource2(event_url, {
                                    Server: sv
                                });
                                evs.onopen = function (x) {
                                    var sv = x.target.GetServer();
                                    _cell_controllers.Each(function (cc) {
                                        if (cc.Device.ServerId !== sv.Id)
                                            return;
                                        //cc.ChangeDevice(cc.Device.Id);
                                    });
                                }
                                RegisterMainEventSource(evs);
                                _evss.push(evs);
                            }
                        }
                        HandleFirstEvent();
                    });
                }
                ;
                this.HandleRemovedChannels = function HandleRemovedChannelsImpl(data) {
                    Log();
                    if (data.length > 0) {
                        Log(JSON.stringify(data));
                        var that = this;
                        $.each(data, function (key, item) {
                            delete that.Devices[item.id];
                        });
                        this.UpdateChannelList();
                    }
                    /*
if (existingChannels.length == 0) {
noChannelsAvailableLabel.show();
}*/
                }
                ;
                this.DropQues = function DropQues() {
                    var keys = Object.keys(_that.Servers);
                    for (var i = 0; i < keys.length; ++i) {
                        var sv_id = Number(keys[i]);
                        if (sv_id < 0)
                            continue;
                        var sv = _that.Servers[keys[i]];
                        sv.Dispatcher.Drop();
                    }
                }
                Object.defineProperties(this, {
                    EventSource: {
                        get: function () {
                            return _event_source;
                        }
                    }
                });
                this.GetContext = function (scope) {
                    if (scope !== _)
                        Err('access');
                    return _ctx;
                }
                {
                    Freeze(this);
                    Log();
                }
            };
            ns_root.AppController.prototype = Freeze({
                toString: function () {
                    return 'AppController { }';
                },
                get Host() {
                    return this.GetContext(_).Host;
                },
                set Host(v) {
                    this.GetContext(_).Host = v;
                },
                get Connected() {
                    return this.GetContext(_).Connected;
                },
            });
            Freeze(ns_root.AppController);
        })(_root_namespace);

        function Serialize(x) {
            return JSON.stringify(x);
        }

        function Deserialize(x) {
            return JSON.parse(x);
        }

        function GetStreamMode() {
            return _stream_mode;
        }

        function LayoutManager() {
            this.Layouts = [];
            var _changed = false;
            this.Add = function (value) {
                if (!(value instanceof LayoutConfig))
                    Err('bad arg');
                var item = null;
                for (var i = 0; i < this.Layouts.length; ++i) {
                    if (this.Layouts[i].Name === value.Name) {
                        item = this.Layouts[i];
                        break;
                    }
                }
                if (HasValue(item)) {
                    item.SizeX = value.SizeX;
                    item.SizeY = value.SizeY;
                } else {
                    this.Layouts.push({
                        Name: value.Name,
                        Value: value
                    });
                    // LayoutConfig?
                }
                _changed = true;
            };
            this.Contains = function (fn_pre) {
                for (var i = 0; i < this.Layouts.length; ++i) {
                    if (fn_pre(this.Layouts[i].Value))
                        return true;
                }
                return false;
            };
            this.GetByName = function (name) {
                var stock_layouts = [new LayoutConfig('1_1', 1, 1), new LayoutConfig('1_2', 1, 2), new LayoutConfig('2_1', 2, 1), new LayoutConfig('2_2', 2, 2), new LayoutConfig('3_2', 3, 2)];
                var item, i;
                for (i = 0; i < stock_layouts.length; ++i) {
                    item = stock_layouts[i];
                    if (item.Name === name)
                        return new LayoutConfig(item.Name, item.SizeX, item.SizeY);
                    // clone
                }
                for (i = 0; i < this.Layouts.length; ++i) {
                    item = this.Layouts[i];
                    if (item.Name === name)
                        return new LayoutConfig(item.Name, item.Value.SizeX, item.Value.SizeY);
                    // clone
                }
                return null;
            };
            this.RemoveByName = function (name) {
                for (var i = 0; i < this.Layouts.length; ++i) {
                    if (this.Layouts[i] === name)
                        delete this.Layouts[i];
                    //
                }
                _changed = true;
            };
            this.Save = function () {
                Log4();
                var i;
                var names = [];
                for (i = 0; i < this.Layouts.length; ++i) {
                    var item = this.Layouts[i];
                    names.push(item.Name);
                    Cookies.set('_layout_' + item.Name, Serialize(item.Value));
                }
                Cookies.set('known_layouts', names);
                _changed = false;
            };
            this.Load = function () {
                var i;
                var json = Cookies.get('known_layouts');
                if (!HasValue(json))
                    return;
                var names = JSON.parse(json);
                if (!HasValue(names))
                    return;
                for (i = 0; i < names.length; ++i) {
                    var name = names[i];
                    var json2 = Cookies.get('_layout_' + name);
                    if (!HasValue(json2))
                        continue;
                    var obj = JSON.parse(json2);
                    var lc = new LayoutConfig(name, obj.SizeX, obj.SizeY);
                    this.Layouts.push({
                        Name: name,
                        Value: lc
                    });
                }
            };
            Object.defineProperties(this, {
                Changed: {
                    get: function () {
                        return _changed;
                    },
                    set: function (v) {
                        _changed = v;
                    }
                }
            });
            Freeze(this);
        }

        Freeze(LayoutManager);

        function register_cf() {
            eval();
        }

        function LayoutConfig(name, x, y) {
            var _name;
            var _size_x;
            var _size_y;
            var _changed;
            this.Save = function Save() {
                Log4();
                return Serialize(this);
            }
            this.Load = function Load(data) {
                Deserialize(data);
                _changed = false;
            }
            Object.defineProperties(this, {
                Name: {
                    get: function () {
                        return _name;
                    },
                    set: function (v) {
                        _name = v;
                        _changed = true
                    },
                    enumerable: true
                },
                SizeX: {
                    get: function () {
                        return _size_x;
                    },
                    set: function (v) {
                        if (v < 1)
                            Err('SizeX');
                        _size_x = v;
                        _changed = true
                    },
                    enumerable: true
                },
                SizeY: {
                    get: function () {
                        return _size_y;
                    },
                    set: function (v) {
                        if (v < 1)
                            Err('SizeY');
                        _size_y = v;
                        _changed = true
                    },
                    enumerable: true
                },
                Changed: {
                    get: function () {
                        return _changed;
                    },
                    set: function (v) {
                        _changed = v;
                    }
                },
            });
            {
                this.SizeX = x;
                this.SizeY = y;
                this.Name = name;
                Freeze(this);
            }
        }

        _j_document.on('layout_changed', LoadLayoutCameras);
        var _menu_open = false;
        var _setup_shown = false;
        var _dtc;
        var _layout_x = 0;
        var _layout_y = 0;
        var _cell_width = 0;
        var _cell_height = 0;
        var _cell_controllers = new CellControllerCollection();

        function ForceLayoutUpdate() {
            Layout();
        }

        ns_root.ForceLayoutUpdate = ForceLayoutUpdate;

        function LoadLayoutCameras() {
            Log('LoadLayoutCameras');
            LogD1(Trace());
            if (!Object.keys(window.GetController.Devices).length) return;
            $(_l_options.cellSelector).each(function (k, v) {
                var cell = $(v).find('.cell');
                var cn = cell.attr('id');
                var maybe_smth = Cookies.get(cn);
                if (!HasValue(maybe_smth) || maybe_smth.length < 1)
                    return true;
                // continue
                $.each(window.DevicesData, function (e, device) {
                    if (device.cctv_id === cn.split('_')[1]) {
                        setTimeout(function () {
                            cell.data('cc').ChangeDevice(device.cctv_id);
                        }, e * 500)
                    }
                });
            });
        }

        function TerminateLayout() {
            _controller.DropQues();
            StopAllVideos();
            _cell_controllers.Clear();
        }

        function SwitchToArchive() {
            _archive_mode = true;
        }

        ns_root.SwitchToArchive = SwitchToArchive;

        function SwitchToLive() {
            _archive_mode = false;
            delete _dtc;
        }

        ns_root.SwitchToLive = SwitchToLive;

        function Layout(advertise) {
            Log('Layout');
            if (_archive_mode !== true) {
                Log('Layout config changed');
                TerminateLayout();
                $(_l_options.cellSelector).each(function () {
                    var cell = $(this).find('.cell');
                    var cc = new CellController(cell);
                    cell.data('cc', cc);
                    _cell_controllers.Add(cc);
                    Log2_('Add new cell:{0}', JSON.stringify(cell));
                })
                if (advertise !== true)
                    _j_document.triggerHandler('layout_changed', 1);
            }
            var cells = $('.cell');
            cells.each(function (k, v) {
                var elem_cell = $(v);
                var cc = elem_cell.data('cc');
                if (_archive_mode) {
                    if (HasValue(cc)) {
                        cc.HandleSelectedCellChange(); // this would hopefully remove stalled color on change to archive mode
                        _cell_controllers.Select(cc);
                    }
                }
            });
        }

        ns_root.UpdateLayout = Layout;
        var _debug = false;
        window.onerror = function (message, file, line, col, error) {
            console.log('%c[' + GetTime() + '] ' + message, 'color: red');
            return true;
            // error handled
        }
        ;
        var _mouse_X, _mouse_Y;
        $(document).on('mousemove', function (e) {
            _mouse_X = e.pageX;
            _mouse_Y = e.pageY;
        });
        var _stream_mode = 'auto';
        var _controller = new AppController();
        var _archive_mode = false;
        var _version;
        var _user;
        var _pass;
        var _l_options;

        function InitializeAppImpl() {
            Log('InitializeAppImpl');
            _j_window.on('beforeunload', function () {
                Log('InitializeAppImpl-close')
                _controller.EventSource.close();
                StopAll();
            });
            _controller.EventStreamSubscribe();
            Layout();
        }

        function InitializeApp(options) {
            _l_options = options;
            _user = options.user;
            _pass = options.pass;
            if (options.streamMode) _stream_mode = options.streamMode;
            _controller.Servers[101] = new Server({
                id: 101,
                ip: options.host,
                httpsIp: options.host,
                name: 'Location'
            }, false);
            var p = new Promise(function (yes, no) {
                    _controller.Servers[101].Auth.Request(yes);
                }
            );
            p.then(function (x) {
                if (x instanceof XMLHttpRequest) {
                    if (x.status === 500) {
                        var header = x.getResponseHeader('X-VMS-Error');
                        if (header === "0x81450003")
                            Log1('Error: Connection limit is exceeded!');
                        else
                            Log1('Error: login failed');
                    }
                    return;
                }
                if (x === true) {
                    InitializeAppImpl.call(window);
                } else if (x === false) {
                    Log2_('Error: login failed')
                }
            });
        }

        ns_root.InitializeApp = InitializeApp;
        ns_root.GetController = function () {
            return _controller;
        }
        /** @license
         * eventsource.js
         * Available under MIT License (MIT)
         * https://github.com/Yaffle/EventSource/
         */
        /*jslint indent: 2, vars: true, plusplus: true */
        /*global setTimeout, clearTimeout */
        (function (global) {
            "use strict";
            var setTimeout = global.setTimeout;
            var clearTimeout = global.clearTimeout;

            function Map() {
                this.data = {};
            }

            Map.prototype.get = function (key) {
                return this.data[key + "~"];
            };
            Map.prototype.set = function (key, value) {
                this.data[key + "~"] = value;
            };
            Map.prototype["delete"] = function (key) {
                delete this.data[key + "~"];
            };

            function EventTarget() {
                this.listeners = new Map();
            }

            function throwError(e) {
                setTimeout(function () {
                    throw e;
                }, 0);
            }

            EventTarget.prototype.dispatchEvent = function (event) {
                event.target = this;
                var type = event.type.toString();
                var listeners = this.listeners;
                var typeListeners = listeners.get(type);
                if (typeListeners == undefined)
                    return;
                var length = typeListeners.length;
                var i = -1;
                var listener = undefined;
                while (++i < length) {
                    listener = typeListeners[i];
                    try {
                        listener.call(this, event);
                    } catch (e) {
                        throwError(e);
                    }
                }
            };
            EventTarget.prototype.addEventListener = function (type, callback) {
                type = type.toString();
                var listeners = this.listeners;
                var typeListeners = listeners.get(type);
                if (typeListeners == undefined) {
                    typeListeners = [];
                    listeners.set(type, typeListeners);
                }
                var i = typeListeners.length;
                while (--i >= 0) {
                    if (typeListeners[i] === callback)
                        return;
                }
                typeListeners.push(callback);
            };
            EventTarget.prototype.removeEventListener = function (type, callback) {
                type = type.toString();
                var listeners = this.listeners;
                var typeListeners = listeners.get(type);
                if (typeListeners == undefined)
                    return;
                var length = typeListeners.length;
                var filtered = [];
                var i = -1;
                while (++i < length) {
                    if (typeListeners[i] !== callback)
                        filtered.push(typeListeners[i]);
                }
                if (filtered.length === 0)
                    listeners["delete"](type);
                else
                    listeners.set(type, filtered);
            };

            function Event(type) {
                this.type = type;
                this.target = undefined;
            }

            function MessageEvent(type, options) {
                Event.call(this, type);
                this.data = options.data;
                this.lastEventId = options.lastEventId;
            }

            MessageEvent.prototype = Event.prototype;
            var XHR = global.XMLHttpRequest;
            var XDR = global.XDomainRequest;
            var isCORSSupported = XHR != undefined && (new XHR()).withCredentials != undefined;
            var Transport = isCORSSupported || (XHR != undefined && XDR == undefined) ? XHR : XDR;
            var WAITING = -1;
            var CONNECTING = 0;
            var OPEN = 1;
            var CLOSED = 2;
            var AFTER_CR = 3;
            var FIELD_START = 4;
            var FIELD = 5;
            var VALUE_START = 6;
            var VALUE = 7;
            var contentTypeRegExp = /^text\/event\-stream;?(\s*charset\=utf\-8)?$/i;
            var MINIMUM_DURATION = 3000;
            var MAXIMUM_DURATION = 18000000;

            function getDuration(value, def) {
                var n = value;
                if (n !== n)
                    n = def;
                return (n < MINIMUM_DURATION ? MINIMUM_DURATION : (n > MAXIMUM_DURATION ? MAXIMUM_DURATION : n));
            }

            function fire(that, f, event) {
                try {
                    if (typeof f === "function")
                        f.call(that, event);
                } catch (e) {
                    throwError(e);
                }
            }

            function eventSource2(url, options) {
                url = url.toString();
                var withCredentials = isCORSSupported && options != undefined && Boolean(options.withCredentials);
                var initialRetry = getDuration(1000, 0);
                var heartbeatTimeout = getDuration(MAXIMUM_DURATION, 0);
                var lastEventId = "";
                var that = this;
                var retry = initialRetry;
                var wasActivity = false;
                var CurrentTransport = options != undefined && options.Transport != undefined ? options.Transport : Transport;
                var xhr = new CurrentTransport();
                var timeout = 0;
                var timeout0 = 0;
                var charOffset = 0;
                var currentState = WAITING;
                var dataBuffer = [];
                var lastEventIdBuffer = "";
                var eventTypeBuffer = "";
                var onTimeout = undefined;
                var _sv = (options != undefined && options.Server !== undefined) ? options.Server : null;

                function SetServer(sv) {
                    _sv = sv;
                }

                this.SetServer = SetServer;

                function GetServer() {
                    return _sv;
                }

                this.GetServer = GetServer;
                var _uuid = Guid();
                var state = FIELD_START;
                var field = "";
                var value = "";

                function close() {
                    currentState = CLOSED;
                    if (xhr != undefined) {
                        xhr.abort();
                        xhr = undefined;
                    }
                    if (timeout !== 0) {
                        clearTimeout(timeout);
                        timeout = 0;
                    }
                    if (timeout0 !== 0) {
                        clearTimeout(timeout0);
                        timeout0 = 0;
                    }
                    that.readyState = CLOSED;
                }

                function onEvent(type) {
                    var responseText = "";
                    if (currentState === OPEN || currentState === CONNECTING) {
                        try {
                            responseText = xhr.responseText;
                        } catch (error) {
                        }
                    }
                    var event = undefined;
                    var isWrongStatusCodeOrContentType = false;
                    if (currentState === CONNECTING) {
                        var status = 0;
                        var statusText = "";
                        var contentType = undefined;
                        if (!("contentType" in xhr)) {
                            try {
                                status = xhr.status;
                                statusText = xhr.statusText;
                                contentType = xhr.getResponseHeader("Content-Type");
                            } catch (error) {
                                status = 0;
                                statusText = "";
                                contentType = undefined;
                            }
                        } else if (type !== "" && type !== "error") {
                            status = 200;
                            statusText = "OK";
                            contentType = xhr.contentType;
                        }
                        if (contentType == undefined)
                            contentType = "";
                        if (status === 0 && statusText === "" && type === "load" && responseText !== "") {
                            status = 200;
                            statusText = "OK";
                            if (contentType === "") {
                                // Opera 12
                                var tmp = (/^data\:([^,]*?)(?:;base64)?,[\S]*$/).exec(url);
                                if (tmp != undefined)
                                    contentType = tmp[1];
                            }
                        }
                        if (status === 200 && contentTypeRegExp.test(contentType)) {
                            currentState = OPEN;
                            wasActivity = true;
                            retry = initialRetry;
                            that.readyState = OPEN;
                            event = new Event("open");
                            that.dispatchEvent(event);
                            fire(that, that.onopen, event);
                            if (currentState === CLOSED)
                                return;
                        } else {
                            if (status !== 0 && (status !== 200 || contentType !== "")) {
                                var message = "";
                                if (status !== 200) {
                                    message = "EventSource's response has a status " + status + " " + statusText.replace(/\s+/g, " ") + " that is not 200. Aborting the connection.";
                                } else {
                                    message = "EventSource's response has a Content-Type specifying an unsupported type: " + contentType.replace(/\s+/g, " ") + ". Aborting the connection.";
                                }
                                setTimeout(function () {
                                    throw new Error(message);
                                }, 0);
                                isWrongStatusCodeOrContentType = true;
                            }
                        }
                    }
                    if (currentState === OPEN) {
                        if (responseText.length > charOffset)
                            wasActivity = true;
                        var i = charOffset - 1;
                        var length = responseText.length;
                        var c = "\n";
                        while (++i < length) {
                            c = responseText.charAt(i);
                            if (state === AFTER_CR && c === "\n") {
                                state = FIELD_START;
                            } else {
                                if (state === AFTER_CR)
                                    state = FIELD_START;
                                if (c === "\r" || c === "\n") {
                                    if (field === "data") {
                                        dataBuffer.push(value);
                                    } else if (field === "id") {
                                        lastEventIdBuffer = value;
                                    } else if (field === "event") {
                                        eventTypeBuffer = value;
                                    } else if (field === "retry") {
                                        initialRetry = getDuration(Number(value), initialRetry);
                                        retry = initialRetry;
                                    } else if (field === "heartbeatTimeout") {
                                        heartbeatTimeout = getDuration(Number(value), heartbeatTimeout);
                                        if (timeout !== 0) {
                                            clearTimeout(timeout);
                                            timeout = setTimeout(onTimeout, heartbeatTimeout);
                                        }
                                    }
                                    value = "";
                                    field = "";
                                    if (state === FIELD_START) {
                                        if (dataBuffer.length !== 0) {
                                            lastEventId = lastEventIdBuffer;
                                            if (eventTypeBuffer === "")
                                                eventTypeBuffer = "message";
                                            event = new MessageEvent(eventTypeBuffer, {
                                                data: dataBuffer.join("\n"),
                                                lastEventId: lastEventIdBuffer
                                            });
                                            that.dispatchEvent(event);
                                            if (eventTypeBuffer === "message")
                                                fire(that, that.onmessage, event);
                                            if (currentState === CLOSED)
                                                return;
                                        }
                                        dataBuffer.length = 0;
                                        eventTypeBuffer = "";
                                    }
                                    state = c === "\r" ? AFTER_CR : FIELD_START;
                                } else {
                                    if (state === FIELD_START)
                                        state = FIELD;
                                    if (state === FIELD) {
                                        if (c === ":")
                                            state = VALUE_START;
                                        else
                                            field += c;
                                    } else if (state === VALUE_START) {
                                        if (c !== " ")
                                            value += c;
                                        state = VALUE;
                                    } else if (state === VALUE) {
                                        value += c;
                                    }
                                }
                            }
                        }
                        charOffset = length;
                    }
                    if ((currentState === OPEN || currentState === CONNECTING) && (type === "load" || type === "error" || isWrongStatusCodeOrContentType || (charOffset > 1024 * 1024) || (timeout === 0 && !wasActivity))) {
                        if (isWrongStatusCodeOrContentType) {
                            close();
                        } else {
                            if (type === "" && timeout === 0 && !wasActivity) {
                                setTimeout(function () {
                                    throw new Error("No activity within " + heartbeatTimeout + " milliseconds. Reconnecting.");
                                }, 0);
                            }
                            currentState = WAITING;
                            xhr.abort();
                            if (timeout !== 0) {
                                clearTimeout(timeout);
                                timeout = 0;
                            }
                            if (retry > initialRetry * 16)
                                retry = initialRetry * 16;
                            if (retry > MAXIMUM_DURATION)
                                retry = MAXIMUM_DURATION;
                            timeout = setTimeout(onTimeout, retry);
                            retry = retry * 2 + 1;
                            that.readyState = CONNECTING;
                        }
                        event = new Event("error");
                        that.dispatchEvent(event);
                        fire(that, that.onerror, event);
                    } else {
                        if (timeout === 0) {
                            wasActivity = false;
                            timeout = setTimeout(onTimeout, heartbeatTimeout);
                        }
                    }
                }

                function onProgress() {
                    onEvent("progress");
                }

                function onLoad() {
                    onEvent("load");
                }

                function onError() {
                    onEvent("error");
                }

                function onReadyStateChange() {
                    if (xhr.readyState === 4) {
                        onEvent((xhr.status === 0) ? "error" : "load");
                    } else {
                        onEvent("progress");
                    }
                }

                if (("readyState" in xhr) && global.opera != undefined) {
                    timeout0 = setTimeout(function f() {
                        if (xhr.readyState === 3)
                            onEvent("progress");
                        timeout0 = setTimeout(f, 500);
                    }, 0);
                }
                onTimeout = function () {
                    timeout = 0;
                    if (currentState !== CONNECTING && currentState !== WAITING) {
                        onEvent("");
                        return;
                    }
                    if ((!("ontimeout" in xhr) || ("sendAsBinary" in xhr) || ("mozAnon" in xhr)) && global.document != undefined && global.document.readyState != undefined && global.document.readyState !== "complete") {
                        timeout = setTimeout(onTimeout, 4);
                        return;
                    }
                    xhr.onload = onLoad;
                    xhr.onerror = onError;
                    if ("onabort" in xhr) {
                        xhr.onabort = onError;
                    }
                    if ("onprogress" in xhr)
                        xhr.onprogress = onProgress;
                    if ("onreadystatechange" in xhr)
                        xhr.onreadystatechange = onReadyStateChange;
                    wasActivity = false;
                    timeout = setTimeout(onTimeout, heartbeatTimeout);
                    charOffset = 0;
                    currentState = CONNECTING;
                    dataBuffer.length = 0;
                    eventTypeBuffer = "";
                    lastEventIdBuffer = lastEventId;
                    value = "";
                    field = "";
                    state = FIELD_START;
                    var s = url.slice(0, 5);
                    if (s !== "data:" && s !== "blob:") {
                        s = url + ((url.indexOf("?", 0) === -1 ? "?" : "&") + "lastEventId=" + encodeURIComponent(lastEventId) + "&r=" + (Math.random() + 1).toString().slice(2));
                    } else {
                        s = url;
                    }
                    xhr.open("GET", s, true);
                    if (_sv !== undefined) {
                        try {
                            xhr.setRequestHeader('Authorization', _sv.Auth.GetDigestHeader('GET', s));
                        } catch (e) {
                            Log('No auth set, reconnecting');
                            wasActivity = true;
                            timeout = setTimeout(onTimeout, 12000);
                            return;
                        }
                    }
                    if ("withCredentials" in xhr) {
                        xhr.withCredentials = withCredentials;
                    }
                    if ("responseType" in xhr)
                        xhr.responseType = "text";
                    if ("setRequestHeader" in xhr) {
                        xhr.setRequestHeader("Accept", "text/event-stream");
                    }
                    xhr.send(undefined);
                };
                EventTarget.call(this);
                this.close = close;
                this.url = url;
                this.readyState = CONNECTING;
                this.withCredentials = withCredentials;
                this.onopen = undefined;
                this.onmessage = undefined;
                this.onerror = undefined;
                onTimeout();
            }

            function F() {
                this.CONNECTING = CONNECTING;
                this.OPEN = OPEN;
                this.CLOSED = CLOSED;
            }

            F.prototype = EventTarget.prototype;
            eventSource2.prototype = new F();
            F.call(eventSource2);
            if (isCORSSupported) {
                eventSource2.prototype.withCredentials = undefined;
            }
            var isEventSourceSupported = function () {
                return global.EventSource2 != undefined && ("withCredentials" in global.EventSource2.prototype);
            };
            if (Transport != undefined && (global.EventSource2 == undefined || (isCORSSupported && !isEventSourceSupported()))) {
                global.NativeEventSource2 = global.EventSource2;
                global.EventSource2 = eventSource2;
            }
        }(typeof window !== 'undefined' ? window : this));
    })(window);
}
var luxriotInit = function (options) {
    window.InitializeApp.call(window, options);
}
