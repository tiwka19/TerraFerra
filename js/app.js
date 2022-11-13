(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    /*! @license is-dom-node v1.0.4

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    function isDomNode(x) {
        return "object" === typeof window.Node ? x instanceof window.Node : null !== x && "object" === typeof x && "number" === typeof x.nodeType && "string" === typeof x.nodeName;
    }
    const is_dom_node_es = isDomNode;
    /*! @license is-dom-node-list v1.2.1

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    function isDomNodeList(x) {
        var prototypeToString = Object.prototype.toString.call(x);
        var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;
        return "object" === typeof window.NodeList ? x instanceof window.NodeList : null !== x && "object" === typeof x && "number" === typeof x.length && regex.test(prototypeToString) && (0 === x.length || is_dom_node_es(x[0]));
    }
    const is_dom_node_list_es = isDomNodeList;
    /*! @license Tealight v0.3.6

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    function tealight(target, context) {
        if (void 0 === context) context = document;
        if (target instanceof Array) return target.filter(is_dom_node_es);
        if (is_dom_node_es(target)) return [ target ];
        if (is_dom_node_list_es(target)) return Array.prototype.slice.call(target);
        if ("string" === typeof target) try {
            var query = context.querySelectorAll(target);
            return Array.prototype.slice.call(query);
        } catch (err) {
            return [];
        }
        return [];
    }
    const tealight_es = tealight;
    /*! @license Rematrix v0.3.0

	Copyright 2018 Julian Lloyd.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/
    function format(source) {
        if (source.constructor !== Array) throw new TypeError("Expected array.");
        if (16 === source.length) return source;
        if (6 === source.length) {
            var matrix = identity();
            matrix[0] = source[0];
            matrix[1] = source[1];
            matrix[4] = source[2];
            matrix[5] = source[3];
            matrix[12] = source[4];
            matrix[13] = source[5];
            return matrix;
        }
        throw new RangeError("Expected array with either 6 or 16 values.");
    }
    function identity() {
        var matrix = [];
        for (var i = 0; i < 16; i++) i % 5 == 0 ? matrix.push(1) : matrix.push(0);
        return matrix;
    }
    function multiply(m, x) {
        var fm = format(m);
        var fx = format(x);
        var product = [];
        for (var i = 0; i < 4; i++) {
            var row = [ fm[i], fm[i + 4], fm[i + 8], fm[i + 12] ];
            for (var j = 0; j < 4; j++) {
                var k = 4 * j;
                var col = [ fx[k], fx[k + 1], fx[k + 2], fx[k + 3] ];
                var result = row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];
                product[i + k] = result;
            }
        }
        return product;
    }
    function parse(source) {
        if ("string" === typeof source) {
            var match = source.match(/matrix(3d)?\(([^)]+)\)/);
            if (match) {
                var raw = match[2].split(", ").map(parseFloat);
                return format(raw);
            }
        }
        return identity();
    }
    function rotateX(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();
        matrix[5] = matrix[10] = Math.cos(theta);
        matrix[6] = matrix[9] = Math.sin(theta);
        matrix[9] *= -1;
        return matrix;
    }
    function rotateY(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();
        matrix[0] = matrix[10] = Math.cos(theta);
        matrix[2] = matrix[8] = Math.sin(theta);
        matrix[2] *= -1;
        return matrix;
    }
    function rotateZ(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();
        matrix[0] = matrix[5] = Math.cos(theta);
        matrix[1] = matrix[4] = Math.sin(theta);
        matrix[4] *= -1;
        return matrix;
    }
    function scale(scalar, scalarY) {
        var matrix = identity();
        matrix[0] = scalar;
        matrix[5] = "number" === typeof scalarY ? scalarY : scalar;
        return matrix;
    }
    function translateX(distance) {
        var matrix = identity();
        matrix[12] = distance;
        return matrix;
    }
    function translateY(distance) {
        var matrix = identity();
        matrix[13] = distance;
        return matrix;
    }
    /*! @license miniraf v1.0.0

	Copyright 2018 Fisssion LLC.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

*/
    var polyfill = function() {
        var clock = Date.now();
        return function(callback) {
            var currentTime = Date.now();
            if (currentTime - clock > 16) {
                clock = currentTime;
                callback(currentTime);
            } else setTimeout((function() {
                return polyfill(callback);
            }), 0);
        };
    }();
    var index = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || polyfill;
    const miniraf_es = index;
    /*! @license ScrollReveal v4.0.9

	Copyright 2021 Fisssion LLC.

	Licensed under the GNU General Public License 3.0 for
	compatible open source projects and non-commercial use.

	For commercial sites, themes, projects, and applications,
	keep your source code private/proprietary by purchasing
	a commercial license from https://scrollrevealjs.org/
*/
    var defaults = {
        delay: 0,
        distance: "0",
        duration: 600,
        easing: "cubic-bezier(0.5, 0, 0, 1)",
        interval: 0,
        opacity: 0,
        origin: "bottom",
        rotate: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 1,
        cleanup: false,
        container: document.documentElement,
        desktop: true,
        mobile: true,
        reset: false,
        useDelay: "always",
        viewFactor: 0,
        viewOffset: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        afterReset: function afterReset() {},
        afterReveal: function afterReveal() {},
        beforeReset: function beforeReset() {},
        beforeReveal: function beforeReveal() {}
    };
    function failure() {
        document.documentElement.classList.remove("sr");
        return {
            clean: function clean() {},
            destroy: function destroy() {},
            reveal: function reveal() {},
            sync: function sync() {},
            get noop() {
                return true;
            }
        };
    }
    function success() {
        document.documentElement.classList.add("sr");
        if (document.body) document.body.style.height = "100%"; else document.addEventListener("DOMContentLoaded", (function() {
            document.body.style.height = "100%";
        }));
    }
    var mount = {
        success,
        failure
    };
    function isObject(x) {
        return null !== x && x instanceof Object && (x.constructor === Object || "[object Object]" === Object.prototype.toString.call(x));
    }
    function each(collection, callback) {
        if (isObject(collection)) {
            var keys = Object.keys(collection);
            return keys.forEach((function(key) {
                return callback(collection[key], key, collection);
            }));
        }
        if (collection instanceof Array) return collection.forEach((function(item, i) {
            return callback(item, i, collection);
        }));
        throw new TypeError("Expected either an array or object literal.");
    }
    function logger(message) {
        var details = [], len = arguments.length - 1;
        while (len-- > 0) details[len] = arguments[len + 1];
        if (this.constructor.debug && console) {
            var report = "%cScrollReveal: " + message;
            details.forEach((function(detail) {
                return report += "\n — " + detail;
            }));
            console.log(report, "color: #ea654b;");
        }
    }
    function rinse() {
        var this$1 = this;
        var struct = function() {
            return {
                active: [],
                stale: []
            };
        };
        var elementIds = struct();
        var sequenceIds = struct();
        var containerIds = struct();
        try {
            each(tealight_es("[data-sr-id]"), (function(node) {
                var id = parseInt(node.getAttribute("data-sr-id"));
                elementIds.active.push(id);
            }));
        } catch (e) {
            throw e;
        }
        each(this.store.elements, (function(element) {
            if (-1 === elementIds.active.indexOf(element.id)) elementIds.stale.push(element.id);
        }));
        each(elementIds.stale, (function(staleId) {
            return delete this$1.store.elements[staleId];
        }));
        each(this.store.elements, (function(element) {
            if (-1 === containerIds.active.indexOf(element.containerId)) containerIds.active.push(element.containerId);
            if (element.hasOwnProperty("sequence")) if (-1 === sequenceIds.active.indexOf(element.sequence.id)) sequenceIds.active.push(element.sequence.id);
        }));
        each(this.store.containers, (function(container) {
            if (-1 === containerIds.active.indexOf(container.id)) containerIds.stale.push(container.id);
        }));
        each(containerIds.stale, (function(staleId) {
            var stale = this$1.store.containers[staleId].node;
            stale.removeEventListener("scroll", this$1.delegate);
            stale.removeEventListener("resize", this$1.delegate);
            delete this$1.store.containers[staleId];
        }));
        each(this.store.sequences, (function(sequence) {
            if (-1 === sequenceIds.active.indexOf(sequence.id)) sequenceIds.stale.push(sequence.id);
        }));
        each(sequenceIds.stale, (function(staleId) {
            return delete this$1.store.sequences[staleId];
        }));
    }
    var getPrefixedCssProp = function() {
        var properties = {};
        var style = document.documentElement.style;
        function getPrefixedCssProperty(name, source) {
            if (void 0 === source) source = style;
            if (name && "string" === typeof name) {
                if (properties[name]) return properties[name];
                if ("string" === typeof source[name]) return properties[name] = name;
                if ("string" === typeof source["-webkit-" + name]) return properties[name] = "-webkit-" + name;
                throw new RangeError('Unable to find "' + name + '" style property.');
            }
            throw new TypeError("Expected a string.");
        }
        getPrefixedCssProperty.clearCache = function() {
            return properties = {};
        };
        return getPrefixedCssProperty;
    }();
    function style(element) {
        var computed = window.getComputedStyle(element.node);
        var position = computed.position;
        var config = element.config;
        var inline = {};
        var inlineStyle = element.node.getAttribute("style") || "";
        var inlineMatch = inlineStyle.match(/[\w-]+\s*:\s*[^;]+\s*/gi) || [];
        inline.computed = inlineMatch ? inlineMatch.map((function(m) {
            return m.trim();
        })).join("; ") + ";" : "";
        inline.generated = inlineMatch.some((function(m) {
            return m.match(/visibility\s?:\s?visible/i);
        })) ? inline.computed : inlineMatch.concat([ "visibility: visible" ]).map((function(m) {
            return m.trim();
        })).join("; ") + ";";
        var computedOpacity = parseFloat(computed.opacity);
        var configOpacity = !isNaN(parseFloat(config.opacity)) ? parseFloat(config.opacity) : parseFloat(computed.opacity);
        var opacity = {
            computed: computedOpacity !== configOpacity ? "opacity: " + computedOpacity + ";" : "",
            generated: computedOpacity !== configOpacity ? "opacity: " + configOpacity + ";" : ""
        };
        var transformations = [];
        if (parseFloat(config.distance)) {
            var axis = "top" === config.origin || "bottom" === config.origin ? "Y" : "X";
            var distance = config.distance;
            if ("top" === config.origin || "left" === config.origin) distance = /^-/.test(distance) ? distance.substr(1) : "-" + distance;
            var ref = distance.match(/(^-?\d+\.?\d?)|(em$|px$|%$)/g);
            var value = ref[0];
            var unit = ref[1];
            switch (unit) {
              case "em":
                distance = parseInt(computed.fontSize) * value;
                break;

              case "px":
                distance = value;
                break;

              case "%":
                distance = "Y" === axis ? element.node.getBoundingClientRect().height * value / 100 : element.node.getBoundingClientRect().width * value / 100;
                break;

              default:
                throw new RangeError("Unrecognized or missing distance unit.");
            }
            if ("Y" === axis) transformations.push(translateY(distance)); else transformations.push(translateX(distance));
        }
        if (config.rotate.x) transformations.push(rotateX(config.rotate.x));
        if (config.rotate.y) transformations.push(rotateY(config.rotate.y));
        if (config.rotate.z) transformations.push(rotateZ(config.rotate.z));
        if (1 !== config.scale) if (0 === config.scale) transformations.push(scale(2e-4)); else transformations.push(scale(config.scale));
        var transform = {};
        if (transformations.length) {
            transform.property = getPrefixedCssProp("transform");
            transform.computed = {
                raw: computed[transform.property],
                matrix: parse(computed[transform.property])
            };
            transformations.unshift(transform.computed.matrix);
            var product = transformations.reduce(multiply);
            transform.generated = {
                initial: transform.property + ": matrix3d(" + product.join(", ") + ");",
                final: transform.property + ": matrix3d(" + transform.computed.matrix.join(", ") + ");"
            };
        } else transform.generated = {
            initial: "",
            final: ""
        };
        var transition = {};
        if (opacity.generated || transform.generated.initial) {
            transition.property = getPrefixedCssProp("transition");
            transition.computed = computed[transition.property];
            transition.fragments = [];
            var delay = config.delay;
            var duration = config.duration;
            var easing = config.easing;
            if (opacity.generated) transition.fragments.push({
                delayed: "opacity " + duration / 1e3 + "s " + easing + " " + delay / 1e3 + "s",
                instant: "opacity " + duration / 1e3 + "s " + easing + " 0s"
            });
            if (transform.generated.initial) transition.fragments.push({
                delayed: transform.property + " " + duration / 1e3 + "s " + easing + " " + delay / 1e3 + "s",
                instant: transform.property + " " + duration / 1e3 + "s " + easing + " 0s"
            });
            var hasCustomTransition = transition.computed && !transition.computed.match(/all 0s|none 0s/);
            if (hasCustomTransition) transition.fragments.unshift({
                delayed: transition.computed,
                instant: transition.computed
            });
            var composed = transition.fragments.reduce((function(composition, fragment, i) {
                composition.delayed += 0 === i ? fragment.delayed : ", " + fragment.delayed;
                composition.instant += 0 === i ? fragment.instant : ", " + fragment.instant;
                return composition;
            }), {
                delayed: "",
                instant: ""
            });
            transition.generated = {
                delayed: transition.property + ": " + composed.delayed + ";",
                instant: transition.property + ": " + composed.instant + ";"
            };
        } else transition.generated = {
            delayed: "",
            instant: ""
        };
        return {
            inline,
            opacity,
            position,
            transform,
            transition
        };
    }
    function applyStyle(el, declaration) {
        declaration.split(";").forEach((function(pair) {
            var ref = pair.split(":");
            var property = ref[0];
            var value = ref.slice(1);
            if (property && value) el.style[property.trim()] = value.join(":");
        }));
    }
    function clean(target) {
        var this$1 = this;
        var dirty;
        try {
            each(tealight_es(target), (function(node) {
                var id = node.getAttribute("data-sr-id");
                if (null !== id) {
                    dirty = true;
                    var element = this$1.store.elements[id];
                    if (element.callbackTimer) window.clearTimeout(element.callbackTimer.clock);
                    applyStyle(element.node, element.styles.inline.generated);
                    node.removeAttribute("data-sr-id");
                    delete this$1.store.elements[id];
                }
            }));
        } catch (e) {
            return logger.call(this, "Clean failed.", e.message);
        }
        if (dirty) try {
            rinse.call(this);
        } catch (e) {
            return logger.call(this, "Clean failed.", e.message);
        }
    }
    function destroy() {
        var this$1 = this;
        each(this.store.elements, (function(element) {
            applyStyle(element.node, element.styles.inline.generated);
            element.node.removeAttribute("data-sr-id");
        }));
        each(this.store.containers, (function(container) {
            var target = container.node === document.documentElement ? window : container.node;
            target.removeEventListener("scroll", this$1.delegate);
            target.removeEventListener("resize", this$1.delegate);
        }));
        this.store = {
            containers: {},
            elements: {},
            history: [],
            sequences: {}
        };
    }
    function deepAssign(target) {
        var sources = [], len = arguments.length - 1;
        while (len-- > 0) sources[len] = arguments[len + 1];
        if (isObject(target)) {
            each(sources, (function(source) {
                each(source, (function(data, key) {
                    if (isObject(data)) {
                        if (!target[key] || !isObject(target[key])) target[key] = {};
                        deepAssign(target[key], data);
                    } else target[key] = data;
                }));
            }));
            return target;
        } else throw new TypeError("Target must be an object literal.");
    }
    function scrollreveal_es_isMobile(agent) {
        if (void 0 === agent) agent = navigator.userAgent;
        return /Android|iPhone|iPad|iPod/i.test(agent);
    }
    var nextUniqueId = function() {
        var uid = 0;
        return function() {
            return uid++;
        };
    }();
    function initialize() {
        var this$1 = this;
        rinse.call(this);
        each(this.store.elements, (function(element) {
            var styles = [ element.styles.inline.generated ];
            if (element.visible) {
                styles.push(element.styles.opacity.computed);
                styles.push(element.styles.transform.generated.final);
                element.revealed = true;
            } else {
                styles.push(element.styles.opacity.generated);
                styles.push(element.styles.transform.generated.initial);
                element.revealed = false;
            }
            applyStyle(element.node, styles.filter((function(s) {
                return "" !== s;
            })).join(" "));
        }));
        each(this.store.containers, (function(container) {
            var target = container.node === document.documentElement ? window : container.node;
            target.addEventListener("scroll", this$1.delegate);
            target.addEventListener("resize", this$1.delegate);
        }));
        this.delegate();
        this.initTimeout = null;
    }
    function animate(element, force) {
        if (void 0 === force) force = {};
        var pristine = force.pristine || this.pristine;
        var delayed = "always" === element.config.useDelay || "onload" === element.config.useDelay && pristine || "once" === element.config.useDelay && !element.seen;
        var shouldReveal = element.visible && !element.revealed;
        var shouldReset = !element.visible && element.revealed && element.config.reset;
        if (force.reveal || shouldReveal) return triggerReveal.call(this, element, delayed);
        if (force.reset || shouldReset) return triggerReset.call(this, element);
    }
    function triggerReveal(element, delayed) {
        var styles = [ element.styles.inline.generated, element.styles.opacity.computed, element.styles.transform.generated.final ];
        if (delayed) styles.push(element.styles.transition.generated.delayed); else styles.push(element.styles.transition.generated.instant);
        element.revealed = element.seen = true;
        applyStyle(element.node, styles.filter((function(s) {
            return "" !== s;
        })).join(" "));
        registerCallbacks.call(this, element, delayed);
    }
    function triggerReset(element) {
        var styles = [ element.styles.inline.generated, element.styles.opacity.generated, element.styles.transform.generated.initial, element.styles.transition.generated.instant ];
        element.revealed = false;
        applyStyle(element.node, styles.filter((function(s) {
            return "" !== s;
        })).join(" "));
        registerCallbacks.call(this, element);
    }
    function registerCallbacks(element, isDelayed) {
        var this$1 = this;
        var duration = isDelayed ? element.config.duration + element.config.delay : element.config.duration;
        var beforeCallback = element.revealed ? element.config.beforeReveal : element.config.beforeReset;
        var afterCallback = element.revealed ? element.config.afterReveal : element.config.afterReset;
        var elapsed = 0;
        if (element.callbackTimer) {
            elapsed = Date.now() - element.callbackTimer.start;
            window.clearTimeout(element.callbackTimer.clock);
        }
        beforeCallback(element.node);
        element.callbackTimer = {
            start: Date.now(),
            clock: window.setTimeout((function() {
                afterCallback(element.node);
                element.callbackTimer = null;
                if (element.revealed && !element.config.reset && element.config.cleanup) clean.call(this$1, element.node);
            }), duration - elapsed)
        };
    }
    function sequence(element, pristine) {
        if (void 0 === pristine) pristine = this.pristine;
        if (!element.visible && element.revealed && element.config.reset) return animate.call(this, element, {
            reset: true
        });
        var seq = this.store.sequences[element.sequence.id];
        var i = element.sequence.index;
        if (seq) {
            var visible = new SequenceModel(seq, "visible", this.store);
            var revealed = new SequenceModel(seq, "revealed", this.store);
            seq.models = {
                visible,
                revealed
            };
            if (!revealed.body.length) {
                var nextId = seq.members[visible.body[0]];
                var nextElement = this.store.elements[nextId];
                if (nextElement) {
                    cue.call(this, seq, visible.body[0], -1, pristine);
                    cue.call(this, seq, visible.body[0], +1, pristine);
                    return animate.call(this, nextElement, {
                        reveal: true,
                        pristine
                    });
                }
            }
            if (!seq.blocked.head && i === [].concat(revealed.head).pop() && i >= [].concat(visible.body).shift()) {
                cue.call(this, seq, i, -1, pristine);
                return animate.call(this, element, {
                    reveal: true,
                    pristine
                });
            }
            if (!seq.blocked.foot && i === [].concat(revealed.foot).shift() && i <= [].concat(visible.body).pop()) {
                cue.call(this, seq, i, +1, pristine);
                return animate.call(this, element, {
                    reveal: true,
                    pristine
                });
            }
        }
    }
    function Sequence(interval) {
        var i = Math.abs(interval);
        if (!isNaN(i)) {
            this.id = nextUniqueId();
            this.interval = Math.max(i, 16);
            this.members = [];
            this.models = {};
            this.blocked = {
                head: false,
                foot: false
            };
        } else throw new RangeError("Invalid sequence interval.");
    }
    function SequenceModel(seq, prop, store) {
        var this$1 = this;
        this.head = [];
        this.body = [];
        this.foot = [];
        each(seq.members, (function(id, index) {
            var element = store.elements[id];
            if (element && element[prop]) this$1.body.push(index);
        }));
        if (this.body.length) each(seq.members, (function(id, index) {
            var element = store.elements[id];
            if (element && !element[prop]) if (index < this$1.body[0]) this$1.head.push(index); else this$1.foot.push(index);
        }));
    }
    function cue(seq, i, direction, pristine) {
        var this$1 = this;
        var blocked = [ "head", null, "foot" ][1 + direction];
        var nextId = seq.members[i + direction];
        var nextElement = this.store.elements[nextId];
        seq.blocked[blocked] = true;
        setTimeout((function() {
            seq.blocked[blocked] = false;
            if (nextElement) sequence.call(this$1, nextElement, pristine);
        }), seq.interval);
    }
    function reveal(target, options, syncing) {
        var this$1 = this;
        if (void 0 === options) options = {};
        if (void 0 === syncing) syncing = false;
        var containerBuffer = [];
        var sequence$$1;
        var interval = options.interval || defaults.interval;
        try {
            if (interval) sequence$$1 = new Sequence(interval);
            var nodes = tealight_es(target);
            if (!nodes.length) throw new Error("Invalid reveal target.");
            var elements = nodes.reduce((function(elementBuffer, elementNode) {
                var element = {};
                var existingId = elementNode.getAttribute("data-sr-id");
                if (existingId) {
                    deepAssign(element, this$1.store.elements[existingId]);
                    applyStyle(element.node, element.styles.inline.computed);
                } else {
                    element.id = nextUniqueId();
                    element.node = elementNode;
                    element.seen = false;
                    element.revealed = false;
                    element.visible = false;
                }
                var config = deepAssign({}, element.config || this$1.defaults, options);
                if (!config.mobile && scrollreveal_es_isMobile() || !config.desktop && !scrollreveal_es_isMobile()) {
                    if (existingId) clean.call(this$1, element);
                    return elementBuffer;
                }
                var containerNode = tealight_es(config.container)[0];
                if (!containerNode) throw new Error("Invalid container.");
                if (!containerNode.contains(elementNode)) return elementBuffer;
                var containerId;
                containerId = getContainerId(containerNode, containerBuffer, this$1.store.containers);
                if (null === containerId) {
                    containerId = nextUniqueId();
                    containerBuffer.push({
                        id: containerId,
                        node: containerNode
                    });
                }
                element.config = config;
                element.containerId = containerId;
                element.styles = style(element);
                if (sequence$$1) {
                    element.sequence = {
                        id: sequence$$1.id,
                        index: sequence$$1.members.length
                    };
                    sequence$$1.members.push(element.id);
                }
                elementBuffer.push(element);
                return elementBuffer;
            }), []);
            each(elements, (function(element) {
                this$1.store.elements[element.id] = element;
                element.node.setAttribute("data-sr-id", element.id);
            }));
        } catch (e) {
            return logger.call(this, "Reveal failed.", e.message);
        }
        each(containerBuffer, (function(container) {
            this$1.store.containers[container.id] = {
                id: container.id,
                node: container.node
            };
        }));
        if (sequence$$1) this.store.sequences[sequence$$1.id] = sequence$$1;
        if (true !== syncing) {
            this.store.history.push({
                target,
                options
            });
            if (this.initTimeout) window.clearTimeout(this.initTimeout);
            this.initTimeout = window.setTimeout(initialize.bind(this), 0);
        }
    }
    function getContainerId(node) {
        var collections = [], len = arguments.length - 1;
        while (len-- > 0) collections[len] = arguments[len + 1];
        var id = null;
        each(collections, (function(collection) {
            each(collection, (function(container) {
                if (null === id && container.node === node) id = container.id;
            }));
        }));
        return id;
    }
    function sync() {
        var this$1 = this;
        each(this.store.history, (function(record) {
            reveal.call(this$1, record.target, record.options, true);
        }));
        initialize.call(this);
    }
    var scrollreveal_es_polyfill = function(x) {
        return (x > 0) - (x < 0) || +x;
    };
    var mathSign = Math.sign || scrollreveal_es_polyfill;
    function getGeometry(target, isContainer) {
        var height = isContainer ? target.node.clientHeight : target.node.offsetHeight;
        var width = isContainer ? target.node.clientWidth : target.node.offsetWidth;
        var offsetTop = 0;
        var offsetLeft = 0;
        var node = target.node;
        do {
            if (!isNaN(node.offsetTop)) offsetTop += node.offsetTop;
            if (!isNaN(node.offsetLeft)) offsetLeft += node.offsetLeft;
            node = node.offsetParent;
        } while (node);
        return {
            bounds: {
                top: offsetTop,
                right: offsetLeft + width,
                bottom: offsetTop + height,
                left: offsetLeft
            },
            height,
            width
        };
    }
    function getScrolled(container) {
        var top, left;
        if (container.node === document.documentElement) {
            top = window.pageYOffset;
            left = window.pageXOffset;
        } else {
            top = container.node.scrollTop;
            left = container.node.scrollLeft;
        }
        return {
            top,
            left
        };
    }
    function isElementVisible(element) {
        if (void 0 === element) element = {};
        var container = this.store.containers[element.containerId];
        if (!container) return;
        var viewFactor = Math.max(0, Math.min(1, element.config.viewFactor));
        var viewOffset = element.config.viewOffset;
        var elementBounds = {
            top: element.geometry.bounds.top + element.geometry.height * viewFactor,
            right: element.geometry.bounds.right - element.geometry.width * viewFactor,
            bottom: element.geometry.bounds.bottom - element.geometry.height * viewFactor,
            left: element.geometry.bounds.left + element.geometry.width * viewFactor
        };
        var containerBounds = {
            top: container.geometry.bounds.top + container.scroll.top + viewOffset.top,
            right: container.geometry.bounds.right + container.scroll.left - viewOffset.right,
            bottom: container.geometry.bounds.bottom + container.scroll.top - viewOffset.bottom,
            left: container.geometry.bounds.left + container.scroll.left + viewOffset.left
        };
        return elementBounds.top < containerBounds.bottom && elementBounds.right > containerBounds.left && elementBounds.bottom > containerBounds.top && elementBounds.left < containerBounds.right || "fixed" === element.styles.position;
    }
    function delegate(event, elements) {
        var this$1 = this;
        if (void 0 === event) event = {
            type: "init"
        };
        if (void 0 === elements) elements = this.store.elements;
        miniraf_es((function() {
            var stale = "init" === event.type || "resize" === event.type;
            each(this$1.store.containers, (function(container) {
                if (stale) container.geometry = getGeometry.call(this$1, container, true);
                var scroll = getScrolled.call(this$1, container);
                if (container.scroll) container.direction = {
                    x: mathSign(scroll.left - container.scroll.left),
                    y: mathSign(scroll.top - container.scroll.top)
                };
                container.scroll = scroll;
            }));
            each(elements, (function(element) {
                if (stale || void 0 === element.geometry) element.geometry = getGeometry.call(this$1, element);
                element.visible = isElementVisible.call(this$1, element);
            }));
            each(elements, (function(element) {
                if (element.sequence) sequence.call(this$1, element); else animate.call(this$1, element);
            }));
            this$1.pristine = false;
        }));
    }
    function isTransformSupported() {
        var style = document.documentElement.style;
        return "transform" in style || "WebkitTransform" in style;
    }
    function isTransitionSupported() {
        var style = document.documentElement.style;
        return "transition" in style || "WebkitTransition" in style;
    }
    var version = "4.0.9";
    var boundDelegate;
    var boundDestroy;
    var boundReveal;
    var boundClean;
    var boundSync;
    var config;
    var debug;
    var instance;
    function ScrollReveal(options) {
        if (void 0 === options) options = {};
        var invokedWithoutNew = "undefined" === typeof this || Object.getPrototypeOf(this) !== ScrollReveal.prototype;
        if (invokedWithoutNew) return new ScrollReveal(options);
        if (!ScrollReveal.isSupported()) {
            logger.call(this, "Instantiation failed.", "This browser is not supported.");
            return mount.failure();
        }
        var buffer;
        try {
            buffer = config ? deepAssign({}, config, options) : deepAssign({}, defaults, options);
        } catch (e) {
            logger.call(this, "Invalid configuration.", e.message);
            return mount.failure();
        }
        try {
            var container = tealight_es(buffer.container)[0];
            if (!container) throw new Error("Invalid container.");
        } catch (e) {
            logger.call(this, e.message);
            return mount.failure();
        }
        config = buffer;
        if (!config.mobile && scrollreveal_es_isMobile() || !config.desktop && !scrollreveal_es_isMobile()) {
            logger.call(this, "This device is disabled.", "desktop: " + config.desktop, "mobile: " + config.mobile);
            return mount.failure();
        }
        mount.success();
        this.store = {
            containers: {},
            elements: {},
            history: [],
            sequences: {}
        };
        this.pristine = true;
        boundDelegate = boundDelegate || delegate.bind(this);
        boundDestroy = boundDestroy || destroy.bind(this);
        boundReveal = boundReveal || reveal.bind(this);
        boundClean = boundClean || clean.bind(this);
        boundSync = boundSync || sync.bind(this);
        Object.defineProperty(this, "delegate", {
            get: function() {
                return boundDelegate;
            }
        });
        Object.defineProperty(this, "destroy", {
            get: function() {
                return boundDestroy;
            }
        });
        Object.defineProperty(this, "reveal", {
            get: function() {
                return boundReveal;
            }
        });
        Object.defineProperty(this, "clean", {
            get: function() {
                return boundClean;
            }
        });
        Object.defineProperty(this, "sync", {
            get: function() {
                return boundSync;
            }
        });
        Object.defineProperty(this, "defaults", {
            get: function() {
                return config;
            }
        });
        Object.defineProperty(this, "version", {
            get: function() {
                return version;
            }
        });
        Object.defineProperty(this, "noop", {
            get: function() {
                return false;
            }
        });
        return instance ? instance : instance = this;
    }
    ScrollReveal.isSupported = function() {
        return isTransformSupported() && isTransitionSupported();
    };
    Object.defineProperty(ScrollReveal, "debug", {
        get: function() {
            return debug || false;
        },
        set: function(value) {
            return debug = "boolean" === typeof value ? value : debug;
        }
    });
    ScrollReveal();
    const scrollreveal_es = ScrollReveal;
    const sr = scrollreveal_es({
        origin: "bottom",
        distance: "60px",
        duration: "1200",
        delay: "300"
    });
    sr.reveal(".hero__title");
    sr.reveal(".hero__image", {
        interval: "100"
    });
    sr.reveal(".hero__decor", {
        origin: "top"
    });
    sr.reveal(".hero__info-item", {
        origin: "left",
        interval: "200"
    });
    sr.reveal(".attraction");
    sr.reveal(".attraction__image-decor", {
        origin: "right"
    });
    sr.reveal(".use__top-data", {
        origin: "left"
    });
    sr.reveal(".use__bottom-data", {
        origin: "right"
    });
    sr.reveal("._image-top", {
        delay: "1000"
    });
    sr.reveal("._image-bottom", {
        delay: "1000"
    });
    window["FLS"] = true;
    isWebp();
    spollers();
    headerScroll();
})();