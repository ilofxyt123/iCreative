!function(a){
    var CanvasAnimation = new function () {
        this.win_w = window.innerWidth;
        this.win_h = window.innerHeight;
        this.hd = Math.PI / 180;
        this.focusLength = 300;
        this.buffer = false;
        this.camera = {
            position: {x: 0, y: 0, z: 0},
            rotation: {x: 0, y: 0, z: 0},
            buffer: {distance: {x: 0, y: 0, z: 0}, temp: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, result: !1}
        };
        this.canvasID = "canvas";
        this.canvasDom = false;
        this.$canvasDom = false;
        this.ctx = false;
        this.pointImageID = "point";
        // this.pointImageID = "red_point";
        this.pointsObject = false;
        this.pointHeight = this.pointWidth = 10;
        this.task = [];
        this.points = [];//保存端点信息，对象格式
        this.lines = [];//保存线条信息，对象格式
        this.trails = [];//保存轨迹信息，对象格式
        this.offsetTime = this.nowTime = this.lastTime = !1;
        this.speed = 1,
        this.AnimationID = false
    };//开辟一些变量
    CanvasAnimation.init = function (config) {
        this.ctx = this.g(this.canvasID).getContext("2d");
        this.$canvasDom = $(this.g(this.canvasID));
        this.$canvasDom.attr("width", this.win_w).attr("height", this.win_h).css("position", "absolute").css("left", 0).css("top", 0);
        this.pointsObject = this.g(this.pointImageID);
        // this.c_obj.translate(this.width / 2, this.height / 2);
        this.ctx.translate(this.win_w / 2, this.win_h / 2);
        this.pointsObject || (console.warn("\u7c92\u5b50\u56fe\u7247\u4e0d\u5b58\u5728,\u4f7f\u7528\u9ed8\u8ba4\u7eb9\u7406"), this.pointsObject = this.canvasTexture());
        var cfg = config ? config : {};
        cfg.n = cfg.n ? cfg.n : 0;
        cfg.opacity = cfg.opacity ? cfg.opacity : "normal";
        cfg.width = cfg.width ? cfg.width : "normal";
        cfg.height = cfg.height ? cfg.height : "normal";
        cfg.sizeSame = "boolean" == typeof cfg.sizeSame ? cfg.sizeSame : !0;
        for (var e = 0; e < cfg.n; e++){
            this.addPoint({//增加2000个粒子
                x: 0,
                y: 0,
                z: 0,
                width: "normal" == cfg.width ? this.pointWidth : this.rand(1, this.pointWidth),
                height: "normal" == cfg.height ? this.pointHeight : this.rand(1, this.pointHeight),
                flag: false,
                opacity: "normal" == cfg.opacity ? 1 : this.rand(0, 10) / 10,
            });
            cfg.sizeSame && (this.points[this.points.length - 1].height = this.points[this.points.length - 1].width)
        }
    };//增加粒子，赋值一些变量
    CanvasAnimation.setPX = function () {
        this.lastTime ? (this.nowTime = this.now(), this.offsetTime = this.nowTime - this.lastTime, this.speed = Math.ceil(this.offsetTime / 17), this.lastTime = this.nowTime) : this.lastTime = this.now()
    };
    CanvasAnimation.getImageData = function (config) {
        var cfg = config ? config : {};
        cfg.id = cfg.id ? cfg.id : !1;
        cfg.scaleX = "number" == typeof cfg.scaleX ? cfg.scaleX : 1;
        cfg.scaleY = "number" == typeof cfg.scaleY ? cfg.scaleY : 1;
        cfg.xn = cfg.xn ? cfg.xn : 4;
        cfg.yn = cfg.yn ? cfg.yn : 4;
        cfg.opacity = cfg.opacity ? cfg.opacity : 128;
        cfg.xOffset = cfg.xOffset ? cfg.xOffset : 4;
        cfg.yOffset = cfg.yOffset ? cfg.yOffset : 4;
        var picDom = this.g(cfg.id),
            $picDom = $(picDom),
            left = parseInt($picDom.css("left")),
            top = parseInt($picDom.css("top")),
            right = parseInt($picDom.css("right")),
            bottom = parseInt($picDom.css("bottom")),
            realWidth = picDom.width * cfg.scaleX,
            realHeight = picDom.height * cfg.scaleY;
        isNaN(left) && (left = isNaN(right) ? 0 : this.win_w - right - realWidth);
        isNaN(top) && (top = isNaN(bottom) ? 0 : this.win_h - bottom - realHeight);
        this.ctx.clearRect(-this.win_w / 2, -this.win_h / 2, this.win_w, this.win_h);
        this.ctx.drawImage(picDom, 0, 0, picDom.width, picDom.height, left - this.win_w / 2, top - this.win_h / 2, realWidth, realHeight);
        var data = this.ctx.getImageData(0, 0, this.win_w, this.win_h);//canvas中只有一张较小的文字图片，其余都为透明像素，需要排除透明像素
        var DataArr = this.getData(data, cfg.xn, cfg.yn, cfg.opacity, cfg.xOffset, cfg.yOffset);
        this.ctx.clearRect(-this.win_w / 2, -this.win_h / 2, this.win_w, this.win_h);
        return DataArr
    };//调用app.getData,最后返回一个数组b
    CanvasAnimation.getData = function (ImageData, xn, yn, opacity, offsetX, offsetY) {//传入的参数:ImageData,横向隔开,纵向隔开,透明度,横向偏移幅度,纵向偏移幅度,最终返回一个数组
        var width = ImageData.width,
            height = ImageData.height;
        for (var position = [], P = 0; P < width; P += xn) {
            for (var i = 0; i < height; i += yn){
                ImageData.data[4 * (i * width + P)+3] >= opacity && position.push(P - 3 + this.rand(0, offsetX) - this.win_w / 2, -(i - 3 + this.rand(0, offsetY) - this.win_h / 2));//排除透明像素后，将点推入p数组
                // b.data[4 * (i * b.width + P)+3] >= l && p.push(P - 3 + this.rand(0, n) - this.width / 2, -(i - 3 + this.rand(0, q) - this.height / 2));//排除透明像素后，将点推入p数组
            }
        }
        return position
    };//返回需要被做动画的粒子数组，保存点的x,y坐标
    CanvasAnimation.addPoint = function (config) {
        var cfg = config ? config : {};
        cfg.index = this.points.length;
        cfg.x = "number" == typeof cfg.x ? cfg.x : 0;
        cfg.y = "number" == typeof cfg.y ? cfg.y : 0;
        cfg.z = "number" == typeof cfg.z ? cfg.z : 0;
        cfg.width = cfg.width ? cfg.width : 2;
        cfg.height = cfg.height ? cfg.height : 2;
        cfg.flag = "boolean" == typeof cfg.flag ? cfg.flag : !1;
        cfg.opacity = "number" == typeof cfg.opacity ? cfg.opacity : 1;
        cfg.material = cfg.material ? cfg.material : this.pointsObject;
        cfg.rotate = "number" == typeof cfg.rotate ? cfg.rotate : !1;
        cfg.free = cfg.free ? cfg.free : {};
        cfg.free.flag = "boolean" == typeof cfg.free.flag ? cfg.free.flag : false;
        cfg.free.zFlag = "boolean" == typeof cfg.free.zFlag ? cfg.free.zFlag : false;
        cfg.free.now = cfg.free.now ? cfg.free.now : 0;
        cfg.free.limit = cfg.free.limit ? cfg.free.limit : 60;
        cfg.free.limitSpace = cfg.free.limit;
        cfg.free.speed = {x: cfg.speed, y: cfg.speed, z: cfg.speed};
        cfg.free.speedSpace = cfg.free.speed;
        cfg.valid = !0;
        cfg.inTask = !1;
        cfg.noTask = !1;
        cfg.buffer2D = {x: 0, y: 0};
        cfg.trail = cfg.trail ? cfg.trail : !1;
        cfg.offset = {x: 0, y: 0, z: 0};
        this.points.push(cfg);
        return cfg
    };//被循环了2000次，填充points数组
    CanvasAnimation.setPointFree = function (config) {
        var cfg = config ? config : {};
        cfg.index = cfg.index ? cfg.index : 0;
        cfg.limit = cfg.limit ? cfg.limit : 60;
        cfg.speed = "number" == typeof cfg.speed ? cfg.speed : 3;
        cfg.zFlag = "boolean" == typeof cfg.zFlag ? cfg.zFlag : true;
        this.points[cfg.index].free.flag = true;
        this.points[cfg.index].free.now = 0;
        this.points[cfg.index].free.zFlag = cfg.zFlag;
        this.points[cfg.index].free.limitSpace = cfg.limit;
        this.points[cfg.index].free.limit = this.rand(cfg.limit / 2, cfg.limit);
        this.points[cfg.index].free.speedSpace = cfg.speed;
        this.points[cfg.index].free.speed = {
            x: this.rand(-cfg.speed - 1, cfg.speed) + this.rand(-10, 10) / 100,
            y: this.rand(-cfg.speed - 1, cfg.speed) + this.rand(-10, 10) / 100,
            z: this.rand(-cfg.speed - 1, cfg.speed) + this.rand(-10, 10) / 100
        };
        for (var prop in this.points[cfg.index].free.speed){
            .5 > Math.abs(this.points[cfg.index].free.speed[prop]) && (this.points[cfg.index].free.speed[prop] *= 2)
        }
    };
    CanvasAnimation.addPointTask = function (config) {
        var cfg = config ? config : {};
        cfg.index = cfg.index ? cfg.index : 0;
        cfg.obj = cfg.obj ? cfg.obj : !1;//{x: 0, y: 0, z: 0},或者{0,19,0}
        cfg.obj || (cfg.obj = this.points[cfg.index]);
        cfg.overTask = !1;
        cfg.now = cfg.now ? cfg.now : 0;
        cfg.limit = cfg.limit ? cfg.limit : 60;
        cfg.type = cfg.type ? cfg.type : "easeOut";
        cfg.callBack = cfg.callBack ? cfg.callBack : !1;
        cfg.everyCallBack = cfg.everyCallBack ? cfg.everyCallBack : !1;
        cfg.delay = cfg.delay ? cfg.delay : 0;
        cfg.delayNow = cfg.delayNow ? cfg.delayNow : 0;
        cfg.repeat = cfg.repeat ? cfg.repeat : 0;
        cfg.repeatNow = cfg.repeatNow ? cfg.repeatNow : 0;
        cfg.repeatDir = "boolean" == typeof cfg.repeatDir ? cfg.repeatDir : !0;
        cfg.repeatCallBack = cfg.repeatCallBack ? cfg.repeatCallBack : !1;
        cfg.bezierData = cfg.bezierData ? cfg.bezierData : !1;
        cfg.bezierFlag = !1;
        "bezier" == cfg.type.substr(0, 6) && (cfg.bezierFlag = !0, cfg.attr = ["x", "y", "z"]);
        cfg.attr = cfg.attr ? cfg.attr : ["x", "y", "z"];
        cfg.start = cfg.start ? cfg.start : {};
        cfg.end = cfg.end ? cfg.end : {};
        for (var e = 0; e < cfg.attr.length; e++){
            void 0 == cfg.start[cfg.attr[e]] && (cfg.start[cfg.attr[e]] = cfg.obj[cfg.attr[e]]);
            void 0 == cfg.end[cfg.attr[e]] && (cfg.end[cfg.attr[e]] = cfg.obj[cfg.attr[e]]);
        }
        if (!cfg.bezierFlag){
            for (var g in cfg.end){
                cfg.end[g] -= cfg.start[g]
            }
        };
        cfg.obj.flag = !0;
        cfg.obj.inTask = 1 == cfg.attr.length && "opacity" == cfg.attr[0] ? !1 : !0;
        cfg.obj.noTask = !1;
        this.task.push(cfg)
    };//将配置好的信息添加到task数组中

    CanvasAnimation.clearPointsFlag = function (b) {
        b = b ? b : {min: 0, max: this.points.length};
        for (var e = b.min; e < b.max; e++)this.points[e].flag = !1
    };
    CanvasAnimation.clearPointsFree = function (b) {
        b = b ? b : {min: 0, max: this.points.length};
        for (var e = b.min; e < b.max; e++)this.points[e].free.flag = !1
    };

    CanvasAnimation.pointVessel = function (config) {//粒子容器
        var cfg = config ? config : {};
        cfg.indexs = cfg.indexs ? cfg.indexs : [];
        this.points = [];
        this.indexs = cfg.indexs;
        this.position = {x: 0, y: 0, z: 0};
        for (var i = 0; i < cfg.indexs.length; i++){
            this.points[i] = CanvasAnimation.points[cfg.indexs[i]];
        }
        this.set = function (x, y, z) {
            x = "number" == typeof x ? x : this.position.x;
            y = "number" == typeof y ? y : this.position.y;
            z = "number" == typeof z ? z : this.position.z;
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;
            this.update()
        };
        this.update = function () {
            for (var i = 0; i < this.points.length; i++){
                this.points[i].offset = this.position
            }
        };
        this.rotate = function (config) {
            cfg = config ? config : {};
            cfg.speed = "number" == typeof cfg.speed ? cfg.speed : 1;
            cfg.type = cfg.type ? cfg.type : "rotateY";
            CanvasAnimation.rotatePoints({indexs: this.indexs, type: cfg.type, speed: cfg.speed})
        }
    };
    CanvasAnimation.addPointsDataTask = function (config) {
        var cfg = config ? config : {};
        cfg.data = config.data ? config.data : [];
        cfg.indexRange = config.indexRange ? config.indexRange : {min: 0, max: config.data.length / 2};
        cfg.limitRange = config.limitRange ? config.limitRange : {min: 60, max: 100};
        cfg.limitLinear = "boolean" == typeof config.limitLinear ? config.limitLinear : !1;
        cfg.limitLinearDir = "boolean" == typeof config.limitLinearDir ? config.limitLinearDir : !0;
        cfg.tarZRange = config.tarZRange ? config.tarZRange : {min: 0, max: 0};
        cfg.type = config.type ? config.type : "easeOut";
        cfg.startData = config.startData ? config.startData : !1;
        cfg.bezierData = config.bezierData ? config.bezierData : !1;
        cfg.callBack = config.callBack ? config.callBack : !1;
        cfg.bezierData && !this.bezierCheck(config.type, config.bezierData) && (config.type = "easeOut");
        for (var e, g, l, n, i = config.indexRange.min; i < config.indexRange.max; i++)
            e = config.startData ? config.startData[this.rand(0, config.startData.length - 1)] : {
                    x: this.points[i].x,
                    y: this.points[i].y,
                    z: this.points[i].z
                },
                g = config.limitLinearDir ? {
                        x: config.data[2 * (i - config.indexRange.min)],
                        y: config.data[2 * (i - config.indexRange.min) + 1],
                        z: this.rand(config.tarZRange.min, config.tarZRange.max)
                    } : {
                        x: config.data[2 * (config.indexRange.max - config.indexRange.min - (i - config.indexRange.min))],
                        y: config.data[2 * (config.indexRange.max - config.indexRange.min - (i - config.indexRange.min)) + 1],
                        z: this.rand(config.tarZRange.min, config.tarZRange.max)
                    },
                l = config.limitLinear ? Math.floor(i / config.indexRange.max * config.limitRange.max) :
                    this.rand(config.limitRange.min, config.limitRange.max),
            config.bezierData && (n = config.bezierData[this.rand(0, config.bezierData.length - 1)]),
                CanvasAnimation.addPointTask({
                    index: i,
                    start: e,
                    end: g,
                    now: 0,
                    limit: l,
                    type: config.type,
                    bezierData: n,
                    callBack: config.callBack
                })
    };
    CanvasAnimation.addPointsDataToDataTask = function (b) {
        b = b ? b : {};
        b.data1 = b.data1 ? b.data1 : [];
        b.data2 = b.data2 ? b.data2 : [];
        b.indexRange = b.indexRange ? b.indexRange : {min: 0, max: b.data2.length / 2};
        b.limitRange = b.limitRange ? b.limitRange : {min: 60, max: 100};
        b.limitLinear = "boolean" == typeof b.limitLinear ? b.limitLinear : !1;
        b.data1_Z = b.data1_Z ? b.data1_Z : {min: 0, max: 0};
        b.data2_Z = b.data2_Z ? b.data2_Z : {min: 0, max: 0};
        b.type = b.type ? b.type : "easeOut";
        b.bezierData = b.bezierData ? b.bezierData : !1;
        b.callBack = b.callBack ? b.callBack : !1;
        for (var e, g, l, n, q = b.indexRange.min; q < b.indexRange.max; q++)this.bezierCheck(b.type, b.bezierData) || (b.type = "easeOut"), "undefined" == typeof b.data1[2 * (q - b.indexRange.min)] && (b.data1[2 * (q - b.indexRange.min)] = this.rand(-this.win_w / 2, 1.5 * this.win_w), b.data1[2 * (q - b.indexRange.min) + 1] = this.rand(-this.win_w / 2, 1.5 * this.win_w)), l = b.limitLinear ? Math.floor(q / b.indexRange.max * b.limitRange.max) : this.rand(b.limitRange.min, b.limitRange.max), b.bezierData && (n = b.bezierData[this.rand(0, b.bezierData.length - 1)]), e = {
            x: b.data1[2 * (q - b.indexRange.min)],
            y: b.data1[2 * (q - b.indexRange.min) + 1],
            z: this.rand(b.data1_Z.min, b.data1_Z.max)
        }, g = {
            x: b.data2[2 * (q - b.indexRange.min)],
            y: b.data2[2 * (q - b.indexRange.min) + 1],
            z: this.rand(b.data2_Z.min, b.data2_Z.max)
        }, app.addPointTask({
            index: q,
            start: e,
            end: g,
            now: 0,
            limit: l,
            type: b.type,
            bezierData: n,
            callBack: b.callBack
        })
    };
    CanvasAnimation.rotatePoints = function (config) {
        var cfg = config ? config : {};
        cfg.indexs = cfg.indexs ? cfg.indexs : [];
        cfg.indexRange = cfg.indexRange ? cfg.indexRange : {min: 0, max: 0};
        cfg.type = cfg.type ? cfg.type : "rotateY";
        cfg.speed = "number" == typeof cfg.speed ? cfg.speed : 1;
        cfg.buffer = !1;
        "rotate3D" == cfg.type && (cfg.rotateN = cfg.rotateN ? cfg.rotateN : [0, 1, 0]);
        if (cfg.indexs.length){
            for (var i = 0; i < cfg.indexs.length; i++){
                cfg.buffer = this[cfg.type](this.points[cfg.indexs[i]].x,
                    this.points[cfg.indexs[i]].y,
                    this.points[cfg.indexs[i]].z,
                    cfg.speed * this.speed, cfg.rotateN);
                this.points[cfg.indexs[i]].x = cfg.buffer.x;
                this.points[cfg.indexs[i]].y = cfg.buffer.y;
                this.points[cfg.indexs[i]].z = cfg.buffer.z;
            }
        }
        else{
            for (var i = cfg.indexRange.min; i < cfg.indexRange.max; i++){
                cfg.buffer = this[cfg.type](this.points[i].x,
                    this.points[i].y,
                    this.points[i].z,
                    cfg.speed * this.speed, cfg.rotateN);
                this.points[i].x = cfg.buffer.x;
                this.points[i].y = cfg.buffer.y;
                this.points[i].z = cfg.buffer.z;
            }
        }
    };
    CanvasAnimation.addPointsLines = function (config) {
        var cfg = config ? config : {};
        cfg.indexs = cfg.indexs ? cfg.indexs : [];
        // b.color = b.color ? b.color : "rgb(0,255,255)"
        cfg.color = cfg.color ? cfg.color : "rgb(255,255,0)";
        cfg.lineWidth = cfg.lineWidth ? config.lineWidth : 1;
        cfg.opacity = "number" == typeof cfg.opacity ? cfg.opacity : 1;
        cfg.clear = !1;
        this.lines.push(cfg);
        return cfg
    };
    CanvasAnimation.renderLines = function () {
        for (var i = 0; i < this.lines.length; i++){
            if (this.lines[i].clear) {
                this.lines.splice(i, 1);
            }
            else {
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.lines[i].color;
                this.ctx.globalAlpha = this.lines[i].opacity;
                for (var e = 0; e < this.lines[i].indexs.length; e++) {
                    switch (e) {
                        case 0:
                            this.ctx.moveTo(this.points[this.lines[i].indexs[e]].buffer2D.x, this.points[this.lines[i].indexs[e]].buffer2D.y);
                            break;
                        case this.lines[i].indexs.length - 1:
                            this.points[this.lines[i].indexs[e]].valid && this.ctx.lineTo(this.points[this.lines[i].indexs[0]].buffer2D.x, this.points[this.lines[i].indexs[0]].buffer2D.y);
                            break;
                        default:
                            this.points[this.lines[i].indexs[e]].valid && this.ctx.lineTo(this.points[this.lines[i].indexs[e]].buffer2D.x, this.points[this.lines[i].indexs[e]].buffer2D.y)
                    }
                    this.ctx.stroke()
                }
            }
        }
    };
    CanvasAnimation.addPointsTrail = function (b) {
        b = b ? b : {};
        b.index = "number" == typeof b.index ? b.index : 0;
        this.points[b.index] && (b.data = b.data ? b.data : [], b.color = b.color ? b.color : "rgb(0,255,255)", b.decay = "number" == typeof b.decay ? b.decay : .85, b.value = 0, b.clear = !1, this.trails.push(b), this.points[b.index].trail = b)
    };
    CanvasAnimation.renderTrails = function () {
        for (var i = 0; i < this.trails.length; i++)
            if (this.trails[i].clear)this.trails.splice(i, 1); else {
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.trails[i].color;
                this.ctx.globalAlpha = this.points[this.trails[i].index].opacity;
                this.trails[i].value += this.trails[i].decay;
                1 <= this.trails[i].value && (--this.trails[i].value, this.trails[i].data.shift());
                for (var e = 0; e < this.trails[i].data.length; e++)
                    switch (e) {
                        case 0:
                            this.ctx.moveTo(this.trails[i].data[e].x, this.trails[i].data[e].y);
                            break;
                        default:
                            this.ctx.lineTo(this.trails[i].data[e].x, this.trails[i].data[e].y)
                    }
                this.ctx.stroke()
            }
    };
    CanvasAnimation.taskWork = function () {
        for (var i = 0; i < this.task.length; i++){
            if (this.task[i].delayNow += this.speed, !(this.task[i].delayNow < this.task[i].delay)) {
                this.buffer = this.task[i].obj;
                this.task[i].repeatDir ? (this.task[i].now += this.speed, this.task[i].now >= this.task[i].limit && (this.task[i].now = this.task[i].limit, this.task[i].overTask = !0)) : (this.task[i].now -= this.speed, 0 >= this.task[i].now && (this.task[i].now = 0, this.task[i].overTask = !0));
                this.task[i].everyCallBack && this.task[i].everyCallBack();
                if (this.task[i].bezierFlag){
                    switch (this.task[i].type) {
                        case "bezier2":
                            var e = this.bezier2(this.task[i].start.x, this.task[i].start.y, this.task[i].start.z, this.task[i].bezierData.bezier2X, this.task[i].bezierData.bezier2Y, this.task[i].bezierData.bezier2Z, this.task[i].end.x, this.task[i].end.y, this.task[i].end.z, this.task[i].now / this.task[i].limit);
                            this.buffer.x = e.x;
                            this.buffer.y = e.y;
                            this.buffer.z = e.z;
                            break;
                        case "bezier3":
                            e = this.bezier3(this.task[i].start.x, this.task[i].start.y, this.task[i].start.z, this.task[i].bezierData.bezier2X, this.task[i].bezierData.bezier2Y, this.task[i].bezierData.bezier2Z, this.task[i].bezierData.bezier3X, this.task[i].bezierData.bezier3Y, this.task[i].bezierData.bezier3Z, this.task[i].end.x, this.task[i].end.y, this.task[i].end.z, this.task[i].now / this.task[i].limit);
                            this.buffer.x = e.x;
                            this.buffer.y = e.y;
                            this.buffer.z = e.z;
                            break;
                        case "bezier4":
                            e = this.bezier4(this.task[i].start.x, this.task[i].start.y, this.task[i].start.z, this.task[i].bezierData.bezier2X, this.task[i].bezierData.bezier2Y, this.task[i].bezierData.bezier2Z, this.task[i].bezierData.bezier3X, this.task[i].bezierData.bezier3Y, this.task[i].bezierData.bezier3Z, this.task[i].bezierData.bezier4X, this.task[i].bezierData.bezier4Y, this.task[i].bezierData.bezier4Z, this.task[i].end.x, this.task[i].end.y, this.task[i].end.z, this.task[i].now / this.task[i].limit), this.buffer.x = e.x, this.buffer.y = e.y, this.buffer.z = e.z
                    }
                }
                else{
                    for (e = 0; e < this.task[i].attr.length; e++){//遍历每一个需要被设置的属性，进行处理
                        this.buffer[this.task[i].attr[e]] = this[this.task[i].type](0, this.task[i].now, this.task[i].start[this.task[i].attr[e]], this.task[i].end[this.task[i].attr[e]], this.task[i].limit);
                    }
                }
                this.buffer.trail && (this.camera.result = this.camera_rotate(this.buffer.x, this.buffer.y, this.buffer.z), this.buffer.trail.data.push(this.change2D(this.camera.result.x, this.camera.result.y, this.camera.result.z, this.focusLength)));
                this.task[i].overTask && (++this.task[i].repeatNow <= this.task[i].repeat ? (this.task[i].overTask = !1, this.task[i].repeatDir = !this.task[i].repeatDir, this.task[i].repeatCallBack && this.task[i].repeatCallBack()) : (this.task[i].callBack && this.task[i].callBack(), this.task.splice(i, 1), this.buffer.inTask = !1));
                this.buffer.noTask && (this.task.splice(i, 1), this.buffer.inTask = !1)
            }
        }
    };
    CanvasAnimation.render = function () {
        this.setPX();//在循环的时候快速执行，不断地获取时间
        this.taskWork();//在循环的时候快速执行
        this.ctx.clearRect(-this.win_w / 2, -this.win_h / 2, this.win_w, this.win_h);
        for (var i = 0; i < this.points.length; i++){
            this.freePoint(i),
                this.buffer = this.checkPoint(i),
                this.points[i].buffer2D.x = this.buffer.x,
                this.points[i].buffer2D.y = this.buffer.y,
                this.buffer ?
                    (this.points[i].valid = !0,
                        this.ctx.globalAlpha = this.buffer.opacity,
                    0 != this.points[i].rotate &&
                    (this.ctx.save(),
                        this.ctx.translate(this.points[i].buffer2D.x, this.points[i].buffer2D.y),
                        this.ctx.rotate(this.points[i].rotate * this.hd),
                        this.ctx.translate(-this.points[i].buffer2D.x, -this.points[i].buffer2D.y)),
                        this.ctx.drawImage(this.points[i].material, 0, 0, this.points[i].material.width, this.points[i].material.height, this.points[i].buffer2D.x - this.buffer.width / 2, this.points[i].buffer2D.y - this.buffer.height / 2, this.buffer.width, this.buffer.height),
                    0 != this.points[i].rotate && this.ctx.restore())
                    : this.points[i].valid = !1;
        }

        this.renderLines();
        // this.renderTrails()
    };
    CanvasAnimation.checkPoint = function (index) {
        if (!this.points[index].flag){
            return false;
        }
        this.buffer = this.camera_rotate(this.points[index].x, this.points[index].y, this.points[index].z);
        this.buffer = this.change2D(this.buffer.x + this.points[index].offset.x,
                                     this.buffer.y + this.points[index].offset.y,
                                     this.buffer.z + this.points[index].offset.z,
                                     this.focusLength);
        return this.buffer.x + this.points[index].width * this.buffer.scale < -this.win_w / 2 ||
        this.buffer.x > this.win_w / 2 ||
        this.buffer.y + this.points[index].height * this.buffer.scale < -this.win_h / 2 ||
        this.buffer.y > this.win_h / 2 ? !1 : {
                x: this.buffer.x,
                y: this.buffer.y,
                opacity: this.points[index].opacity,
                width: this.points[index].width * this.buffer.scale,
                height: this.points[index].height * this.buffer.scale
            }
    };
    CanvasAnimation.freePoint = function (index) {
        this.points[index].free.flag &&
        !this.points[index].inTask &&
        (this.points[index].x += this.points[index].free.speed.x * this.speed,
                this.points[index].y += this.points[index].free.speed.y * this.speed,
            this.points[index].free.zFlag && (this.points[index].z += this.points[index].free.speed.z * this.speed),
                this.points[index].free.now += this.speed,
            this.points[index].free.now >= this.points[index].free.limit &&
            (this.points[index].free.now = 0,
                    this.points[index].free.limit = this.rand(this.points[index].free.limitSpace / 2, this.points[index].free.limitSpace),
                    this.points[index].free.speed.x *= this.getOne(),
                    this.points[index].free.speed.y *= this.getOne(),
                    this.points[index].free.speed.z *= this.getOne()
            )
        )
    };
    CanvasAnimation.bezierCheck = function (b, e) {
        if (!e)return !1;
        if ("bezier" == b.substr(0, 6))for (var g = 0; g < e.length; g++)switch (b) {
            case "bezier2":
                if ("undefined" == typeof e[g].bezier2X)return console.warn("bezier2\u53c2\u6570\u6709\u8bef"), !1;
                break;
            case "bezier3":
                if ("undefined" == typeof e[g].bezier2X || "undefined" == typeof e[g].bezier3X)return console.warn("bezier3\u53c2\u6570\u6709\u8bef!"), !1;
                break;
            case "bezier4":
                if ("undefined" == typeof e[g].bezier2X || "undefined" == typeof e[g].bezier3X || "undefined" == typeof e[g].bezier4X)return console.warn("bezier4\u53c2\u6570\u6709\u8bef!"), !1
        }
        return !0
    };
    CanvasAnimation.g = function (b) {
        return document.getElementById(b)
    };
    CanvasAnimation.requestAnimationFrame = function () {
        return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (b) {
                setTimeout(b, 1E3 / 60)
            }
    };
    CanvasAnimation.now = Date.now || function () {
            return (new Date).getTime()
        };
    CanvasAnimation.canvasTexture = function () {
        var b = document.createElement("canvas");
        b.width = 16;
        b.height = 16;
        var e = b.getContext("2d"), g = e.createRadialGradient(b.width / 2, b.height / 2, 0, b.width / 2, b.height / 2, b.width / 2);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(.2, "rgba(0,255,255,1)");
        g.addColorStop(.4, "rgba(0,0,64,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        e.fillStyle = g;
        e.fillRect(0, 0, b.width, b.height);
        e = document.createElement("img");
        e.src = b.toDataURL("image/png");
        return e
    };
    CanvasAnimation.change2D = function (x, y, z, distance) {
        var scale = distance / (distance + z);
        return 0 < scale ? {x: x * scale, y: y * scale, scale: scale} : {x: 10 * -this.win_w, y: 10 * -this.win_h}
    };
    CanvasAnimation.rand = function (b, e) {
        return ~~(Math.random() * (e - b + 1) + b)
    };
    CanvasAnimation.getOne = function () {
        return .5 < Math.random() ? 1 : -1
    };
    CanvasAnimation.rotate3D = function (b, e, g, l, n) {
        l *= this.hd;
        return {
            x: b * (Math.pow(n[0], 2) * (1 - Math.cos(l)) + Math.cos(l)) + e * (n[0] * n[1] * (1 - Math.cos(l)) - n[2] * Math.sin(l)) + g * (n[0] * n[2] * (1 - Math.cos(l)) + n[1] * Math.sin(l)),
            y: b * (n[0] * n[1] * (1 - Math.cos(l)) + n[2] * Math.sin(l)) + e * (Math.pow(n[1], 2) * (1 - Math.cos(l)) + Math.cos(l)) + g * (n[1] * n[2] * (1 - Math.cos(l)) - n[0] * Math.sin(l)),
            z: b * (n[0] * n[2] * (1 - Math.cos(l)) - n[1] * Math.sin(l)) + e * (n[1] * n[2] * (1 - Math.cos(l)) + n[0] * Math.sin(l)) + g * (Math.pow(n[2], 2) * (1 - Math.cos(l)) + Math.cos(l))
        }
    };
    CanvasAnimation.rotateX = function (b, e, g, l) {
        l *= this.hd;
        return {x: b, y: e * Math.cos(l) - g * Math.sin(l), z: e * Math.sin(l) + g * Math.cos(l)}
    };
    CanvasAnimation.rotateY = function (b, e, g, l, n) {
        l *= this.hd;
        return {x: b * Math.cos(l) - g * Math.sin(l),
            y: e,
            z: b * Math.sin(l) + g * Math.cos(l)}
    };
    CanvasAnimation.rotateZ = function (b, e, g, l) {
        l *= this.hd;
        return {x: b * Math.cos(l) - e * Math.sin(l), y: e * Math.cos(l) + b * Math.sin(l), z: g}
    };
    CanvasAnimation.camera_rotate = function (x, y, z) {
        this.camera.buffer.distance.x = x - this.camera.position.x;
        this.camera.buffer.distance.y = this.camera.position.y - y;
        this.camera.buffer.distance.z = this.camera.position.z - z;
        this.camera.buffer.temp = {x: 0, y: 0, z: 0};
        this.camera.buffer.rotation.x = this.camera.rotation.x * this.hd;
        this.camera.buffer.rotation.y = this.camera.rotation.y * this.hd;
        this.camera.buffer.rotation.z = this.camera.rotation.z * this.hd;
        this.camera.buffer.temp.x = Math.cos(this.camera.buffer.rotation.y) * this.camera.buffer.distance.x - Math.sin(this.camera.buffer.rotation.y) * this.camera.buffer.distance.z;
        this.camera.buffer.temp.z = Math.sin(this.camera.buffer.rotation.y) * this.camera.buffer.distance.x + Math.cos(this.camera.buffer.rotation.y) * this.camera.buffer.distance.z;
        this.camera.buffer.distance.x = this.camera.buffer.temp.x;
        this.camera.buffer.distance.z = this.camera.buffer.temp.z;
        this.camera.buffer.temp.y = Math.cos(this.camera.buffer.rotation.x) * this.camera.buffer.distance.y - Math.sin(this.camera.buffer.rotation.x) * this.camera.buffer.distance.z;
        this.camera.buffer.temp.z = Math.sin(this.camera.buffer.rotation.x) * this.camera.buffer.distance.y + Math.cos(this.camera.buffer.rotation.x) * this.camera.buffer.distance.z;
        this.camera.buffer.distance.y = this.camera.buffer.temp.y;
        this.camera.buffer.distance.z = this.camera.buffer.temp.z;
        this.camera.buffer.temp.x = Math.cos(this.camera.buffer.rotation.z) * this.camera.buffer.distance.x - Math.sin(this.camera.buffer.rotation.z) * this.camera.buffer.distance.y;
        this.camera.buffer.temp.y = Math.sin(this.camera.buffer.rotation.z) * this.camera.buffer.distance.x + Math.cos(this.camera.buffer.rotation.z) * this.camera.buffer.distance.y;
        this.camera.buffer.distance.x = this.camera.buffer.temp.x;
        this.camera.buffer.distance.y = this.camera.buffer.temp.y;
        return {x: this.camera.buffer.distance.x, y: this.camera.buffer.distance.y, z: this.camera.buffer.distance.z}
    };
    CanvasAnimation.linear = function (b, e, g, l, n) {
        return l * e / n + g
    };
    CanvasAnimation.easeOut = function (b, e, g, l, n) {
        return -l * (e /= n) * (e - 2) + g
    };
    CanvasAnimation.easeIn = function (b, e, g, l, n) {
        return l * (e /= n) * e + g
    };
    CanvasAnimation.easeInOut = function (b, e, g, l, n) {
        return 1 > (e /= n / 2) ? l / 2 * e * e + g : -l / 2 * (--e * (e - 2) - 1) + g
    };
    CanvasAnimation.easeInCubic = function (b, e, g, l, n) {
        return l * (e /= n) * e * e + g
    };
    CanvasAnimation.easeOutCubic = function (b, e, g, l, n) {
        return l * ((e = e / n - 1) * e * e + 1) + g
    };
    CanvasAnimation.easeInOutCubic = function (b, e, g, l, n) {
        return 1 > (e /= n / 2) ? l / 2 * e * e * e + g : l / 2 * ((e -= 2) * e * e + 2) + g
    };
    CanvasAnimation.easeInQuart = function (b, e, g, l, n) {
        return l * (e /= n) * e * e * e + g
    };
    CanvasAnimation.easeOutQuart = function (b, e, g, l, n) {
        return -l * ((e = e / n - 1) * e * e * e - 1) + g
    };
    CanvasAnimation.easeInOutQuart = function (b, e, g, l, n) {
        return 1 > (e /= n / 2) ? l / 2 * e * e * e * e + g : -l / 2 * ((e -= 2) * e * e * e - 2) + g
    };
    CanvasAnimation.easeInQuint = function (b, e, g, l, n) {
        return l * (e /= n) * e * e * e * e + g
    };
    CanvasAnimation.easeOutQuint = function (b, e, g, l, n) {
        return l * ((e = e / n - 1) * e * e * e * e + 1) + g
    };
    CanvasAnimation.easeInOutQuint = function (b, e, g, l, n) {
        return 1 > (e /= n / 2) ? l / 2 * e * e * e * e * e + g : l / 2 * ((e -= 2) * e * e * e * e + 2) + g
    };
    CanvasAnimation.easeInSine = function (b, e, g, l, n) {
        return -l * Math.cos(e / n * (Math.PI / 2)) + l + g
    };
    CanvasAnimation.easeOutSine = function (b, e, g, l, n) {
        return l * Math.sin(e / n * (Math.PI / 2)) + g
    };
    CanvasAnimation.easeInOutSine = function (b, e, g, l, n) {
        return -l / 2 * (Math.cos(Math.PI * e / n) - 1) + g
    };
    CanvasAnimation.easeInExpo = function (b, e, g, l, n) {
        return 0 == e ? g : l * Math.pow(2, 10 * (e / n - 1)) + g
    };
    CanvasAnimation.easeOutExpo = function (b, e, g, l, n) {
        return e == n ? g + l : l * (-Math.pow(2, -10 * e / n) + 1) + g
    };
    CanvasAnimation.easeInOutExpo = function (b, e, g, l, n) {
        return 0 == e ? g : e == n ? g + l : 1 > (e /= n / 2) ? l / 2 * Math.pow(2, 10 * (e - 1)) + g : l / 2 * (-Math.pow(2, -10 * --e) + 2) + g
    };
    CanvasAnimation.easeInCirc = function (b, e, g, l, n) {
        return -l * (Math.sqrt(1 - (e /= n) * e) - 1) + g
    };
    CanvasAnimation.easeOutCirc = function (b, e, g, l, n) {
        return l * Math.sqrt(1 - (e = e / n - 1) * e) + g
    };
    CanvasAnimation.easeInOutCirc = function (b, e, g, l, n) {
        return 1 > (e /= n / 2) ? -l / 2 * (Math.sqrt(1 - e * e) - 1) + g : l / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + g
    };
    CanvasAnimation.easeInElastic = function (b, e, g, l, n) {
        b = 0;
        var q = l;
        if (0 == e)return g;
        if (1 == (e /= n))return g + l;
        b || (b = .3 * n);
        q < Math.abs(l) ? (q = l, l = b / 4) : l = b / (2 * Math.PI) * Math.asin(l / q);
        return -(q * Math.pow(2, 10 * --e) * Math.sin(2 * (e * n - l) * Math.PI / b)) + g
    };
    CanvasAnimation.easeOutElastic = function (b, e, g, l, n) {
        var q = 0, p = l;
        if (0 == e)return g;
        if (1 == (e /= n))return g + l;
        q || (q = .3 * n);
        p < Math.abs(l) ? (p = l, b = q / 4) : b = q / (2 * Math.PI) * Math.asin(l / p);
        return p * Math.pow(2, -10 * e) * Math.sin(2 * (e * n - b) * Math.PI / q) + l + g
    };
    CanvasAnimation.easeInOutElastic = function (b, e, g, l, n) {
        var q = 0, p = l;
        if (0 == e)return g;
        if (2 == (e /= n / 2))return g + l;
        q || (q = .3 * n * 1.5);
        p < Math.abs(l) ? (p = l, b = q / 4) : b = q / (2 * Math.PI) * Math.asin(l / p);
        return 1 > e ? -.5 * p * Math.pow(2, 10 * --e) * Math.sin(2 * (e * n - b) * Math.PI / q) + g : p * Math.pow(2, -10 * --e) * Math.sin(2 * (e * n - b) * Math.PI / q) * .5 + l + g
    };
    CanvasAnimation.easeInBounce = function (b, e, g, l, n) {
        return l - this.easeOutBounce(b, n - e, 0, l, n) + g
    };
    CanvasAnimation.easeOutBounce = function (b, e, g, l, n) {
        return (e /= n) < 1 / 2.75 ? 7.5625 * l * e * e + g : e < 2 / 2.75 ? l * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + g : e < 2.5 / 2.75 ? l * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + g : l * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + g
    };
    CanvasAnimation.easeInOutBounce = function (b, e, g, l, n) {
        return e < n / 2 ? .5 * this.easeInBounce(b, 2 * e, 0, l, n) + g : .5 * this.easeOutBounce(b, 2 * e - n, 0, l, n) + .5 * l + g
    };
    CanvasAnimation.bezier2 = function (b, e, g, l, n, q, p, P, O, J) {
        return {
            x: Math.pow(1 - J, 2) * b + 2 * J * (1 - J) * l + Math.pow(J, 2) * p,
            y: Math.pow(1 - J, 2) * e + 2 * J * (1 - J) * n + Math.pow(J, 2) * P,
            z: Math.pow(1 - J, 2) * g + 2 * J * (1 - J) * q + Math.pow(J, 2) * O
        }
    };
    CanvasAnimation.bezier3 = function (b, e, g, l, n, q, p, P, O, J, T, ea, k) {
        return {
            x: b * Math.pow(1 - k, 3) + 3 * l * k * Math.pow(1 - k, 2) + 3 * p * Math.pow(k, 2) * (1 - k) + J * Math.pow(k, 3),
            y: e * Math.pow(1 - k, 3) + 3 * n * k * Math.pow(1 - k, 2) + 3 * P * Math.pow(k, 2) * (1 - k) + T * Math.pow(k, 3),
            z: g * Math.pow(1 - k, 3) + 3 * q * k * Math.pow(1 - k, 2) + 3 * O * Math.pow(k, 2) * (1 - k) + ea * Math.pow(k, 3)
        }
    };
    CanvasAnimation.bezier4 = function (b, e, g, l, n, q, p, P, O, J, T, ea, k, u, z, w) {
        return {
            x: b * Math.pow(1 - w, 4) + 4 * l * w * Math.pow(1 - w, 3) + 4 * p * Math.pow(w, 2) * Math.pow(1 - w, 2) + 4 * J * Math.pow(w, 3) * (1 - w) + k * Math.pow(w, 4),
            y: e * Math.pow(1 - w, 4) + 4 * n * w * Math.pow(1 - w, 3) + 4 * P * Math.pow(w, 2) * Math.pow(1 - w, 2) + 4 * T * Math.pow(w, 3) * (1 - w) + u * Math.pow(w, 4),
            z: g * Math.pow(1 - w, 4) + 4 * q * w * Math.pow(1 - w, 3) + 4 * O * Math.pow(w, 2) * Math.pow(1 - w, 2) + 4 * ea * Math.pow(w, 3) * (1 - w) + z * Math.pow(w, 4)
        }
    };
    CanvasAnimation.getCube = function (b) {
        b = b ? b : {};
        b.x = "number" == typeof b.x ? b.x : 100;
        b.y = "number" == typeof b.y ? b.y : 100;
        b.z = "number" == typeof b.z ? b.z : 100;
        return [{x: -b.x / 2, y: -b.y / 2, z: -b.z / 2}, {x: b.x / 2, y: -b.y / 2, z: -b.z / 2}, {
            x: b.x / 2,
            y: b.y / 2,
            z: -b.z / 2
        }, {x: -b.x / 2, y: b.y / 2, z: -b.z / 2}, {x: -b.x / 2, y: -b.y / 2, z: b.z / 2}, {
            x: b.x / 2,
            y: -b.y / 2,
            z: b.z / 2
        }, {x: b.x / 2, y: b.y / 2, z: b.z / 2}, {x: -b.x / 2, y: b.y / 2, z: b.z / 2}]
    };
    var Custom = new function(){
        this.pointsNum = 100;
        this.pointsSize = 10;
    };
    Custom.init = function(){
        CanvasAnimation.init({n:this.pointsNum})
        for (var i = 0; i < CanvasAnimation.points.length; i++){
            CanvasAnimation.points[i].width = this.pointsSize;
            CanvasAnimation.points[i].height = this.pointsSize;
        }
    }
    var Main = new function(){//项目主流程
        this.a={
            ImageList:[
                "images/loaidng.gif",
            ],//图片列表
            wheel:{
                now:1,
                next:2,
                pre:6,
                dir:"",
                line:$(".line"),
            }
        };//主参数
        this.f = {
            start : function(){
                Utils.preloadImage(Main.a.ImageList,function(){
                    //开始流程中的其他函数
                    Main.f.page();
                    Main.f.loadingOver();
                },false)
            },
            Particle:function(){
                Custom.init();
                for(var i =0;i<Custom.pointsNum;i++){
                    CanvasAnimation.points[i].x = CanvasAnimation.rand(-600, 600);
                    CanvasAnimation.points[i].y = CanvasAnimation.rand(-600, 600);
                    CanvasAnimation.points[i].z = CanvasAnimation.rand(-300, 100);
                    CanvasAnimation.setPointFree({
                        index: i,
                        speed:0.5,
                        limit: CanvasAnimation.rand(window.innerWidth/2, window.innerHeight/2),
                        zFlag:false
                    });
                    CanvasAnimation.addPointTask({index: i, attr: ["opacity"], end: {opacity: 1}, limit: 200});
                }
                this.startRender();
            },
            startRender:function(){
                var loop = function(){
                    CanvasAnimation.render()
                    CanvasAnimation.AnimationID = b(loop);
                }
                var b = CanvasAnimation.requestAnimationFrame();
                b(loop);
            },
            pauseRender:function(){
                window.cancelAnimationFrame(CanvasAnimation.AnimationID)
            },
            loadingOver:function(){
                $(".loading img").fadeOut(300)
                $(".loading").addClass("loadHide")
            },
            RightNav:function(type,num){
                var t = type||"to";
                console.log(t)
                switch(t){
                    case "to":
                        if(Main.a.wheel.next==1){Main.a.wheel.line.css("left","20px");break;}
                        Main.a.wheel.line.animate({left:"-14px"},600);//移出来
                        break;
                    case "leave":
                        Main.a.wheel.line.animate({
                            left:"20px",//向右隐藏
                        },600,function(){
                            $(".line").css({top:(Main.a.wheel.next-2)*25+5+"px"})//改变top
                        });
                        break;
                }
            },
            page:function(){
                $(".page").removeClass("none");//页面容器
                $(".index-page").removeClass("none");//文字出现
                $(".bgBox").removeClass("none");//蓝色背景出现
                $(".blockArea1").removeClass("none");//5个色块,第一页暂时没用,为全透明
                $(".Top-nav").removeClass("none");//导航栏出现
            },
            p1:function(){
                console.log("显示第1个页面");
                this.startRender();
                $(".Right-nav").addClass("none");//右侧导航栏消失
                $(".index-page").removeClass("none");//文字出现
                $(".bgBox").removeClass("none");//蓝色背景出现
                $(".blockArea1").removeClass("none");//5个色块,第一页暂时没用,为全透明
            },
            pleave1:function(){
                console.log("离开第1个页面");
                $(".bgBox").addClass("none");//背景消失
                $(".index-page").addClass("none");//文字消失
                $(".blockArea1").addClass("none");//色块消失
            },
            p2:function(){
                console.log("来到第二个页面");
                this.pauseRender();
                $(".Right-nav").removeClass("none");//右侧导航栏出现
                $(".home-video").removeClass("none");//视频容器
                $(".blockArea2").removeClass("none");//5个色块出现
                $(".home-page").removeClass("none");//文字出现
                this.g("h-video").play();//第一个视频播放
            },
            pleave2:function(){
                console.log("离开第2个页面");
                $(".home-video").addClass("none");//视频容器
                $(".blockArea2").addClass("none");//色块消失
                $(".home-page").addClass("none");//文字消失
            },
            p3:function(){
                console.log("显示第3个页面");
                $(".about-video").removeClass("none");//视频容器
                $(".blockArea3").removeClass("none");//5个色块出现
                $(".about-page").removeClass("none");//文字出现
                this.g("a-video").play();//第一个视频播放
            },
            pleave3:function(){
                console.log("离开第3个页面");
                $(".about-video").addClass("none");//视频容器
                $(".blockArea3").addClass("none");//5个色块出现
                $(".about-page").addClass("none");//文字出现
            },
            p4:function(){
                console.log("显示第4个页面");
                $(".project-video").removeClass("none");//视频容器
                $(".blockArea4").removeClass("none");//5个色块出现
                $(".project-page").removeClass("none");//文字出现
                this.g("p-video").play();//第一个视频播放
            },
            pleave4:function(){
                console.log("离开第4个页面");
                $(".project-video").addClass("none");//视频容器
                $(".blockArea4").addClass("none");//5个色块出现
                $(".project-page").addClass("none");//文字出现
            },
            p5:function(){
                console.log("显示第5个页面");
                $(".service-video").removeClass("none");//视频容器
                $(".blockArea5").removeClass("none");//5个色块出现
                $(".service-page").removeClass("none");//文字出现
                this.g("s-video").play();//第一个视频播放
            },
            pleave5:function(){
                console.log("离开第5个页面");
                $(".service-video").addClass("none");//视频容器
                $(".blockArea5").addClass("none");//5个色块出现
                $(".service-page").addClass("none");//文字出现
            },
            p6:function(){
                console.log("显示第6个页面");
                $(".contact-video").removeClass("none");//视频容器
                $(".blockArea6").removeClass("none");//5个色块出现
                $(".contact-page").removeClass("none");//文字出现
                this.g("c-video").play();//第一个视频播放
            },
            pleave6:function(){
                console.log("离开第6个页面");
                $(".contact-video").addClass("none");//视频容器
                $(".blockArea6").addClass("none");//5个色块出现
                $(".contact-page").addClass("none");//文字出现
            },
            ScrollTo:function(num){
                this["p"+num]();
                this.RightNav("to",num)
            },
            ScrollLeft:function(num){
                this["pleave"+num]();
                this.RightNav("leave",num)
            },
            addEvent:function(){
                var mousewheelHandler = function(e){
                    var _deltaY = e.originalEvent.deltaY;
                    var dir = Main.a.wheel.dir = _deltaY>0?"down":"up";

                    switch(dir){
                        case 'up':
                            if(Main.a.wheel.now>1){
                                Main.a.wheel.next = Main.a.wheel.now-1;
                            }
                            if(Main.a.wheel.now==1){
                                Main.a.wheel.next = 6;
                            }
                            break;
                        case 'down':
                            if(Main.a.wheel.now<6){
                                Main.a.wheel.next = Main.a.wheel.now+1;
                            }
                            if(Main.a.wheel.now==6){
                                Main.a.wheel.next = 1;
                            }
                            break;
                    }
                    Main.f.ScrollLeft(Main.a.wheel.now);
                    Main.f.ScrollTo(Main.a.wheel.next)
                    Main.a.wheel.now = Main.a.wheel.next;
                };
                Utils.E(Utils.g("main"),"wheel",mousewheelHandler,false)
                $(".tip").click(function(){
                    Main.f.p2();
                    Main.f.pleave1();
                    Main.a.wheel.now = 2;
                    Main.a.wheel.next = 3;
                })
            },
            g:function(id){
                return document.getElementById(id)
            }
        };//主函数
    };
    var Media = new function(){
        this.mutedEnd = false;
        this.WxMediaInit=function(){
            var _self = this;
            if(!Utils.browser("weixin")){
                this.mutedEnd = true;
                return;
            }
            if(!Utils.browser("iPhone")){
                _self.mutedEnd = true;
                return;
            }
            document.addEventListener("WeixinJSBridgeReady",function(){
                var $media = $(".iosPreload");
                $.each($media,function(index,value){
                    _self.MutedPlay(value["id"]);
                    if(index+1==$media.length){
                        _self.mutedEnd = true;
                    }
                });
            },false)
        },
        this.MutedPlay=function(string){
            var str = string.split(",");//id数组
            var f = function(id){
                var media = Utils.g(id);
                media.volume = 0;
                media.play();
                // setTimeout(function(){
                media.pause();
                media.volume = 1;
                media.currentTime = 0;
                // },100)
            };
            if(!(str.length-1)){
                f(str[0]);
                return 0;
            }
            str.forEach(function(value,index){
                f(value);
            })
        },
        this.playMedia=function(id){
            var _self = this;
            var clock = setInterval(function(){
                if(_self.mutedEnd){
                    Utils.g(id).play()
                    clearInterval(clock);
                }
            },20)
        }
    };
    var Utils = new function(){
        this.preloadImage = function(ImageURL,callback,realLoading){
            var rd = realLoading||false;
            var i,j,haveLoaded = 0;
            for(i = 0,j = ImageURL.length;i<j;i++){
                (function(img, src) {
                    img.onload = function() {
                        haveLoaded+=1;
                        var num = Math.ceil(haveLoaded / ImageURL.length* 100);
                        if(rd){
                            $(".num").html("- "+num + "% -");
                        }
                        if (haveLoaded == ImageURL.length && callback) {
                            setTimeout(callback, 500);
                        }
                    };
                    img.onerror = function() {};
                    img.onabort = function() {};

                    img.src = src;
                }(new Image(), ImageURL[i]));
            }
        },//图片列表,图片加载完后回调函数，是否需要显示百分比
        this.lazyLoad = function(){
            var a = $(".lazy");
            var len = a.length;
            var imgObj;
            var Load = function(){
                for(var i=0;i<len;i++){
                    imgObj = a.eq(i);
                    imgObj.attr("src",imgObj.attr("data-src"));
                }
            };
            Load();
        },//将页面中带有.lazy类的图片进行加载
        this.browser = function(t){
            var u = navigator.userAgent;
            var u2 = navigator.userAgent.toLowerCase();
            var p = navigator.platform;
            var browserInfo = {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
                weixin: u2.match(/MicroMessenger/i) == "micromessenger",
                taobao: u.indexOf('AliApp(TB') > -1,
                win: p.indexOf("Win") == 0,
                mac: p.indexOf("Mac") == 0,
                xll: (p == "X11") || (p.indexOf("Linux") == 0),
                ipad: (navigator.userAgent.match(/iPad/i) != null) ? true : false
            };
            return browserInfo[t];
        },//获取浏览器信息
        this.g=function(id){
            return document.getElementById(id);
        },
        this.E=function(selector,type,handle){
            $(selector).on(type,handle);
        }
    };
    a.output = {main:Main,media:Media,utils:Utils};
    /*-----------------------------事件绑定--------------------------------*/
}(window)
$(function(){
    var main = window.output.main,
        media = output.media,
        utils = output.utils;
    $('#scene').parallax();//视差滚动初始化
    media.WxMediaInit();
    utils.E(window,"touchstart",function(){media.MutedPlay("video");console.log(1)})
    main.f.start();
    main.f.Particle();
    main.f.addEvent()


})




