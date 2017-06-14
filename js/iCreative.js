/**
 * Created by Z on 2017/3/16.
 */
(function(doc,win){
////////////////////////////////////////////////////
    var setSize = function(){
        var _width = window.innerWidth;
        var size = (_width/1920)*100;
        if(size<50){size=50;}
        if(size>100){size=100;}
        doc.documentElement.style.fontSize = size + 'px';
    };
    setSize();
    window.onresize = function(){
        setSize();
        f.setPhotoPos();
    };
/////////////////////////////////////////////////////
    var iCreative = function(){
        //待初始化静态变量
        this.browser;//浏览器
        this.Event;//各个浏览器下的不同事件的名称

        this.transitionEnd = {
            Opera:"oTransitionEnd",
            FF:"transitionend",//window.ontransitionend
            Chrome:"webkitTransitionEnd",//window.onwebkittransitionend
            Safari:"webkitTransitionEnd",
            other:"transitionend"
        };//各浏览器对应transitionEnd事件
        this.animationEnd = {
            Opera:"oanimationend",
            FF:"mozAnimationEnd",//window.ontransitionend
            Chrome:"webkitAnimationEnd",//window.onwebkittransitionend
            Safari:"webkitAnimationEnd",
            IE:"MSAnimationEnd"
        };//各浏览器对应animationEnd事件
        this.animationStart = {
            Opera:"oanimationstart",
            FF:"mozAnimationStart",//window.ontransitionend
            Chrome:"webkitAnimationStart",//window.onwebkittransitionend
            Safari:"webkitAnimationStart",
            IE:"MSAnimationStart"
        };//各浏览器对应animationEnd事件
        this.addEvent = function(selector,type,handle){
            $(selector).on(type,handle);
            // console.log($(selector),type)
        };
        this.removeEvent = function(selector,type){
            $(selector).off(type);
        };
        this.init();
    };
    iCreative.prototype = {
        init : function(){
            this.browser = this.Browser();//初始化浏览器
            this.Event = {
                transitionEnd:this.transitionEnd[this.browser],
                animationEnd:this.animationEnd[this.browser],
                animationStart:this.animationStart[this.browser],
            }
        },
        Browser : function(){
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            }; //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1){
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }; //判断是否IE浏览器
        },//返回浏览器
        Utils:{

        }
    };

//以下是调用上面的函数
    win.iCreative = iCreative;
})(document,window)