var dust = /** @class */ (function () {
    function dust() {
        this.x = 50;
        this.y = 50;
        this.vx = Math.random() * 2 + 2;
        this.vy = Math.random() * 2;
        this.color = '#fff';
        this.shadowBlur = Math.random() * 3;
        this.shadowX = (Math.random() * 2) - 1;
        this.shadowY = (Math.random() * 2) - 1;
        this.radiusX = Math.random() * 3;
        this.radiusY = Math.random() * 3;
        this.rotation = Math.PI * Math.floor(Math.random() * 2);
    }
    return dust;
}());
var canvasDust = /** @class */ (function () {
    function canvasDust(canvasID) {
        var _this = this;
        this.width = 300;
        this.height = 300;
        this.dustQuantity = 50;
        this.dustArr = [];
        var canvas = document.getElementById(canvasID);
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.build();
            window.addEventListener('resize', function () { return _this.resize(); });
        }
        else {
            throw new Error('canvasID 无效');
        }
    }
    canvasDust.prototype.build = function () {
        var _this = this;
        this.resize();
        if (this.ctx) {
            var point = canvasDust.getPoint(this.dustQuantity);
            for (var _i = 0, point_1 = point; _i < point_1.length; _i++) {
                var i = point_1[_i];
                var dustObj = new dust();
                this.buildDust(i[0], i[1], dustObj);
                this.dustArr.push(dustObj);
            }
            setInterval(function () {
                _this.play();
            }, 40);
        }
    };
    canvasDust.prototype.play = function () {
        var _a;
        var dustArr = this.dustArr;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);
        for (var _i = 0, dustArr_1 = dustArr; _i < dustArr_1.length; _i++) {
            var i = dustArr_1[_i];
            if (i.x < 0 || i.y < 0) {
                var x = this.width;
                var y = Math.floor(Math.random() * window.innerHeight);
                i.x = x;
                i.y = y;
                this.buildDust(x, y, i);
            }
            else {
                var x = i.x - i.vx;
                var y = i.y - i.vy;
                this.buildDust(x, y, i);
            }
        }
    };
    canvasDust.prototype.buildDust = function (x, y, dust) {
        var ctx = this.ctx;
        if (x)
            dust.x = x;
        if (y)
            dust.y = y;
        if (ctx) {
            ctx.beginPath();
            ctx.shadowBlur = dust.shadowBlur;
            ctx.shadowColor = dust.color;
            ctx.shadowOffsetX = dust.shadowX;
            ctx.shadowOffsetY = dust.shadowY;
            ctx.ellipse(dust.x, dust.y, dust.radiusX, dust.radiusY, dust.rotation, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = dust.color;
            ctx.fill();
        }
    };
    canvasDust.prototype.resize = function () {
        var canvas = this.canvas;
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.width = width;
        this.height = height;
        this.dustQuantity = Math.floor((width + height) / 38);
        if (canvas !== undefined) {
            canvas.width = width;
            canvas.height = height;
        }
    };
    canvasDust.getPoint = function (number) {
        if (number === void 0) { number = 1; }
        var point = [];
        for (var i = 0; i < number; i++) {
            var x = Math.floor(Math.random() * window.innerWidth);
            var y = Math.floor(Math.random() * window.innerHeight);
            point.push([x, y]);
        }
        return point;
    };
    return canvasDust;
}());
var indexs = /** @class */ (function () {
    function indexs() {
        var _this = this;
        this.index = [];
        this.totop = document.getElementById('to-top');
        this.scrollID = null;
        this.scrolling = 0;
        this.headerLink = document.getElementsByClassName('headerlink');
        this.tocLink = document.getElementsByClassName('toc-link');
        this.postContent = document.getElementById('post-content');
        var totop = document.getElementById('to-top');
        if (totop != null)
            totop.style.opacity = '0';
        if (this.tocLink.length > 0) {
            this.setItem(this.tocLink.item(0));
            document.addEventListener('scroll', function () {
                ++_this.scrolling;
                if (_this.scrollID == null) {
                    _this.scrollID = setInterval(_this.modifyIndex.bind(_this), 50);
                }
                setTimeout(function () {
                    if (--_this.scrolling == 0) {
                        clearInterval(_this.scrollID);
                        _this.scrollID = null;
                        var totop_1 = document.getElementById('to-top');
                        if (_this.totop !== null
                            && document.getElementById('post-title').getBoundingClientRect().top < -200) {
                            totop_1.style.opacity = '1';
                        }
                        else {
                            totop_1.style.opacity = '0';
                        }
                    }
                }, 200);
            }, { passive: true });
        }
    }
    indexs.prototype.setItem = function (item) {
        item.classList.add('active');
        var $parent = item.parentElement, brother = $parent.children;
        for (var i = 0; i < brother.length; i++) {
            var item_1 = brother.item(i);
            if (item_1.classList.contains('toc-child')) {
                item_1.classList.add('has-active');
                break;
            }
        }
        for (var $parent_1 = item.parentElement; $parent_1.classList[0] != 'toc'; $parent_1 = $parent_1.parentElement) {
            if ($parent_1.classList[0] == 'toc-child') {
                $parent_1.classList.add('has-active');
            }
        }
    };
    indexs.prototype.reset = function () {
        var tocs = document.getElementsByClassName('active');
        var tocTree = document.getElementsByClassName('has-active');
        for (; tocs.length;) {
            var item = tocs.item(0);
            item.classList.remove('active');
        }
        for (; tocTree.length;) {
            var item = tocTree.item(0);
            item.classList.remove('has-active');
        }
    };
    indexs.prototype.modifyIndex = function () {
        for (var i = 0; i < this.headerLink.length; i++) {
            var link = this.headerLink.item(i);
            if (link) {
                this.index.push(link.getBoundingClientRect().top);
            }
        }
        this.reset();
        for (var i = 0; i < this.tocLink.length; ++i) {
            var item = this.tocLink.item(i);
            if (i + 1 == this.index.length || (this.index[i + 1] > 150 && (this.index[i] <= 150 || i == 0))) {
                this.setItem(item);
                break;
            }
        }
        this.index = [];
    };
    indexs.prototype.scrolltop = function () {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        document.getElementById('to-top').style.opacity = '0';
    };
    return indexs;
}());
var codes = /** @class */ (function () {
    function codes() {
        this.findCode();
    }
    codes.prototype.reverse = function (item, s0, s1) {
        var block = item.parentElement;
        if (block.classList.contains(s0)) {
            block.classList.remove(s0);
            block.classList.add(s1);
        }
        else {
            block.classList.remove(s1);
            block.classList.add(s0);
        }
    };
    codes.prototype.doAsMermaid = function (item) {
        var Amermaid = item.getElementsByClassName('mermaid').item(0);
        item.outerHTML = '<div class="highlight mermaid">' + Amermaid.innerText + '</div>';
    };
    codes.prototype.doAsCode = function (item) {
        var _this = this;
        var codeType = item.classList[1], lineCount = item.getElementsByClassName('gutter').item(0).children[0].childElementCount >> 1;
        item.classList.add(lineCount < 16 ? 'open' : 'fold');
        item.innerHTML =
            '<span class="code-header"><span class="code-title">\
        <div class="code-icon"></div>' +
                (codeType !== 'plaintext' ? codeType.toUpperCase() : 'TEXT') + ' 共 ' + lineCount + ' 行</span>\
        <span class="code-header-tail">\
          <button class="code-copy"></button>\
          <span class="code-space">展开</span>\
        </span>\
    </span></span>\
    <div class="code-box">' + item.innerHTML + '</div>';
        item.getElementsByClassName('code-copy').item(0).addEventListener('click', function (click) {
            var button = click.target;
            navigator.clipboard.writeText(item.getElementsByTagName('code').item(0).innerText);
            button.classList.add('copied');
            setTimeout(function () { return button.classList.remove('copied'); }, 1200);
        });
        item.getElementsByClassName('code-header').item(0).addEventListener('click', function (click) {
            if (!click.target.classList.contains('code-copy')) {
                _this.reverse(click.currentTarget, 'open', 'fold');
            }
        });
    };
    codes.prototype.findCode = function () {
        var codeBlocks = document.getElementsByClassName('highlight');
        for (var i = 0; i < codeBlocks.length; i++) {
            var item = codeBlocks.item(i);
            if (item.getElementsByClassName('mermaid').length > 0) {
                this.doAsMermaid(item);
            }
            else {
                this.doAsCode(item);
            }
        }
    };
    return codes;
}());
var cursors = /** @class */ (function () {
    function cursors() {
        var _this = this;
        this.first = true;
        this.outer = document.getElementById('cursor-outer').style;
        this.effecter = document.getElementById('cursor-effect').style;
        this.opacity = 0;
        this.ishead = true;
        this.moveEventID = null;
        this.fadeEventID = null;
        document.querySelector('header').addEventListener('mouseenter', function () { return _this.ishead = true; }, { passive: true });
        document.querySelector('header').addEventListener('mouseout', function () { return _this.ishead = false; }, { passive: true });
        window.addEventListener('mousemove', function (mouse) { return _this.reset(mouse); }, { passive: true });
        window.addEventListener('click', function (mouse) { return _this.Aeffect(mouse); }, { passive: true });
        this.pushHolders();
        var observer = new MutationObserver(this.pushHolders.bind(this));
        observer.observe(document, { childList: true, subtree: true });
    }
    cursors.prototype.move = function () {
        if (this.now !== undefined) {
            var SX = this.outer.left, SY = this.outer.top;
            var preX = Number(SX.substring(0, SX.length - 2)), preY = Number(SY.substring(0, SY.length - 2));
            var nxtX = this.now.x, nxtY = this.now.y;
            var delX = (nxtX - preX) / 13, delY = (nxtY - preY) / 13;
            var equal = true;
            if (Math.abs(delX) >= 0.1) {
                this.outer.left = String(preX + delX) + 'px';
                equal = false;
            }
            else {
                this.outer.left = String(nxtX) + 'px';
            }
            if (Math.abs(delY) >= 0.1) {
                this.outer.top = String(preY + delY) + 'px';
                equal = false;
            }
            else {
                this.outer.top = String(nxtY) + 'px';
            }
            if (equal) {
                clearInterval(this.moveEventID);
                this.moveEventID = null;
            }
        }
    };
    cursors.prototype.reset = function (mouse) {
        if (this.moveEventID === null) {
            this.moveEventID = window.setInterval(this.move.bind(this), 1);
        }
        this.now = mouse;
        if (this.first) {
            this.first = false;
            this.outer.left = String(this.now.x) + 'px';
            this.outer.top = String(this.now.y) + 'px';
        }
    };
    cursors.prototype.fadeOut = function () {
        if (this.opacity > 0) {
            var delta = this.opacity * 0.11;
            if (delta < 0.001) {
                delta = this.opacity;
            }
            this.effecter.transform = 'translate(-50%, -50%) scale(' + String(this.scale += delta) + ')';
            this.effecter.opacity = String((this.opacity -= delta));
        }
        else {
            clearInterval(this.fadeEventID);
            this.fadeEventID = null;
        }
    };
    cursors.prototype.Aeffect = function (mouse) {
        if (this.fadeEventID === null) {
            this.fadeEventID = window.setInterval(this.fadeOut.bind(this), 10);
            this.effecter.left = String(mouse.x) + 'px';
            this.effecter.top = String(mouse.y) + 'px';
            this.effecter.transform = 'translate(-50%, -50%) scale(0)';
            this.effecter.opacity = '1';
            this.scale = 0;
            this.opacity = 1;
        }
    };
    cursors.prototype.hold = function () {
        this.outer.height = '24px';
        this.outer.width = '24px';
        this.outer.background = "rgba(255, 255, 255, 0.5)";
    };
    cursors.prototype.relax = function () {
        this.outer.height = '36px';
        this.outer.width = '36px';
        this.outer.background = "unset";
    };
    cursors.prototype.pushHolder = function (items) {
        var _this = this;
        for (var i = 0; i < items.length; i++) {
            var item = items.item(i);
            item.addEventListener('mouseover', function () { return _this.hold(); }, { passive: true });
            item.addEventListener('mouseout', function () { return _this.relax(); }, { passive: true });
        }
    };
    cursors.prototype.pushHolders = function () {
        this.pushHolder(document.getElementsByTagName('a'));
        this.pushHolder(document.getElementsByTagName('input'));
        this.pushHolder(document.getElementsByTagName('button'));
        this.pushHolder(document.getElementsByClassName('code-header'));
        this.pushHolder(document.getElementsByClassName('gt-user-inner'));
        this.pushHolder(document.getElementsByClassName('gt-header-textarea'));
    };
    return cursors;
}());
var index = new indexs();
var code = new codes();
var cursor = new cursors();
new canvasDust('canvas-dust');
