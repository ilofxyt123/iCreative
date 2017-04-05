(function(){
    var _iCreative = new window.iCreative();
    console.log(_iCreative)
    var about = function(){
        this.wheel={
            now:1,
            next:2,
            pre:0,
            dir:"",
            limit:5,
        };
        this.isAnimate = false;
        this.video=this.g("k-video");
        this.ele={
            $p1:$(".page1"),
            $p2:$(".page2"),
            $p3:$(".page3"),
            $p4:$(".page4"),
            $p2_text:$(".page2").find(".text"),
            $p3_text:$(".page3").find(".text"),
        },
        this.init();
    };
    about.prototype={
        init:function(){
            this.addEvent();
            this.addWheelEvent();
            $(".page"+this.wheel.next).addClass("next");
        },
        addEvent:function(){
            console.log("绑定事件")
            var _self = this;
            _iCreative.addEvent(".tip","click",function(){
                _self.p2();
                _self.pleave1();
                _self.wheel.now = 2;
                _self.wheel.next = 3;
            });
            _iCreative.addEvent("#main",_iCreative.Event.animationStart,_self.PageAStart.bind(_self));//监听下一页动画结束，结束隐藏本页
            _iCreative.addEvent("#main",_iCreative.Event.animationEnd,_self.PageAEnd.bind(_self));//监听下一页动画结束，结束隐藏本页
        },

        ///////////////////////////
        addWheelEvent:function(){
            var _self = this;
            console.log("绑定滚轮事件")
            var mousewheelHandler = function(e){
                // _iCreative.removeEvent("#main","wheel");
                if(_self.isAnimate){//如果正在动画，禁止滚轮
                    console.log("等待动画结束才可继续滚动");
                    return;
                }
                var _deltaY = e.originalEvent.deltaY;//Y方向位移
                var dir = _self.wheel.dir = _deltaY>0?"down":"up";//滚动方向
                console.log(dir)
                switch(dir){
                    case 'up':
                        if(_self.wheel.now==1){//当前位置在1，禁止上滑
                            return;
                        }
                        if(_self.wheel.now>1){//当前位置大于1，可以下滑
                            _self.wheel.next = _self.wheel.now-1;
                            if(_self.wheel.now==5){
                                console.log("去4")
                            }
                        }
                        break;
                    case 'down':
                        if(_self.wheel.now==5){//当前位置在5，禁止下滑
                            return;
                        }
                        if(_self.wheel.now<5){//当前位置不在5，可以下滑
                            _self.wheel.next = _self.wheel.now+1;
                            if(_self.wheel.now!=4){//4跳5另外处理
                                break;//跳出case
                            }
                            _self.wheel.now = _self.wheel.next;//next是5，now是4，更新now到5
                            _self.p5();
                            return;
                        }

                }

                // _self.ScrollTo(_self.wheel.next);//进入下一页

                _self.ScrollLeft(_self.wheel.now);//离开本页
                // _iCreative.addEvent(".page2",_iCreative.Event.transitionEnd,_self.PageTEnd)//监听下一页动画结束，结束隐藏本页

                // _self.wheel.now = _self.wheel.next;
            };

            _iCreative.addEvent("#main","wheel",mousewheelHandler);
        },
        offWheelEvent:function(){
            _iCreative.removeEvent("#main","wheel");
        },
        ScrollTo:function(num){
            this["p"+num]();
        },
        ScrollLeft:function(num){
            this["pleave"+num]();
        },
        ///////////////////////////

        g:function(id){
            return document.getElementById(id);
        },
        p1:function(){
            this.ele.$p1.removeClass("none");
            $("#k-video")[0].play()
        },
        p2:function(){
            var video = $("#k-video")[0]
            this.ele.$p2.addClass("PagetoUp active").removeClass("none");//增加翻页动画
            this.ele.$p4.addClass("none").removeClass("opacity");//隐藏page4
        },
        p3:function(){

            if(this.wheel.dir=="up"){
                console.log("向上")
            }
            if(this.wheel.dir=="down"){
                this.ele.$p3.removeClass("none").addClass("active").find(".text").addClass("Page_from_down");
            }
        },
        p4:function(){
            $(".page4").removeClass("none");
        },
        p5:function(){
            $(".move").css({"transform":"translateY(-4.2rem)"})
            console.log("第5页")
        },
        pleave1:function(){
            $(".page1").removeClass("active");
            $(".page1-text").addClass("fadeOut");
        },
        pleave2:function(){
            // $(".page2").addClass("none");
            var _self = this;

            if(this.wheel.dir=="up"){
                this.ele.$p2.find(".scene-img img").addClass("leave_to_Left100");
                this.ele.$p2.find(".page-bar").addClass("leave_to_Right100");
                this.ele.$p2.find(".htitle,.stitle,p").addClass("leave_to_down");
            }
            if(this.wheel.dir=="down"){
                setTimeout(function(){
                    _self.ele.$p2.find(".scene-img img").addClass("leave_to_Left100");
                    _self.ele.$p2.find(".page-bar").addClass("leave_to_Right100");
                    _self.ele.$p2.find(".htitle,.stitle,p").addClass("fadeOut");
                },500);
                this.ele.$p2.find(".text").addClass("go_to_Up100").removeClass("active");
                this.p3();
            }

        },
        pleave3:function(){
            $(".page3").addClass("none");
        },
        pleave4:function(){
            $(".page4").addClass("none");
        },
        pleave5:function(){
            $(".move").css({"transform":"translateY(0)"})
            console.log("离开第5页")
        },
        retorep1:function(){
            this.ele.$p1.addClass("none");
            $(".page1-text").removeClass("fadeOut").css("opacity",0);
        },
        retorep2:function(){},
        retorep3:function(){},
        retorep4:function(){},
        retorep5:function(){},
        PageAStart:function(){
            console.log("AnimationStart");
            this.isAnimate = true;//表示正在动画
            // $(".page"+this.wheel.next).addClass("next")
            // _iCreative.removeEvent(window,_iCreative.Event.animationStart);
        },
        PageAEnd:function(e){
            // console.log("AnimationEnd");//动画结束
            var EndDom = e.target;
            // var _self = instance;
            var _self = this;//this被强行指向about类
            /////////////////////////////向上翻页//////////////////////////////
            if(_self.wheel.dir=="up"){
                switch(_self.wheel.now){
                    case 1:
                        //不存在这个情况
                        break;
                    case 2:
                        if(EndDom==_self.ele.$p2.find(".page-bar")[0]){//绿条最后一个消失，已经准备好翻页
                            _self.ele.$p1.removeClass("none").addClass("next");//第一页即将出现，调整z-index
                            _self.ele.$p2.addClass("PagetoDown");//第二页向下翻页消失
                            _self.video.play();
                            return;
                        }
                        if(EndDom==_self.ele.$p2[0]){//第二页翻页完成，已经准备好第一页动画
                            _self.ele.$p2.find(".htitle,.stitle,p,.scene-img img,.page-bar").addClass("opacity").removeClass("leave_to_down leave_to_Left100 leave_to_Right100");
                            _self.ele.$p2.removeClass("PagetoDown active").addClass("none");//移除最高层、向下翻页动画
                            _self.ele.$p1.addClass("active").removeClass("next");//提层
                            $(".page1-text").addClass("fadeIn");
                            return;
                        }
                        if(EndDom==$(".page1-text")[0]){//第一页进场动画全部结束
                            $(".page1-text").css("opacity",1).removeClass("fadeIn");
                            _self.isAnimate = false;//动画结束
                            _self.wheel.now = _self.wheel.next;//更新当前位置
                        }
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        break;
                }
            }
            /////////////////////////////向下翻页//////////////////////////////
            if(_self.wheel.dir=="down"){
                switch(_self.wheel.now){
                    case 1://page1去page2
                        if(EndDom==$(".page1-text")[0]){//第一页离场结束
                            _self.p2();
                            return;
                        }
                        if(EndDom==_self.ele.$p2[0]){//第二页进场结束
                            _self.video.pause();
                            _self.video.currentTime = 0;
                            _self.retorep1();//恢复第一页的类，以备反向动画
                            _self.ele.$p2.removeClass("next PagetoUp");
                            _self.ele.$p2.find(".htitle,.stitle,p").addClass("move_from_down");//文字从下往上出现
                            _self.ele.$p2.find(".scene-img img").addClass("move_from_Left100");
                            _self.ele.$p2.find(".page-bar").addClass("move_from_Right100");
                            return;
                        }
                        if(EndDom==_self.ele.$p2.find(".htitle")[0]) {//第二页全部结束
                            console.log("page1-page2的动画全部结束");
                            setTimeout(function(){
                                _self.ele.$p2.find(".htitle,.stitle,p,.scene-img img,.page-bar").removeClass("move_from_Left100 move_from_down move_from_Right100 opacity");
                                _self.isAnimate = false;//动画结束
                                _self.wheel.now = _self.wheel.next;//更新当前位置
                            },600)
                        }
                        break;
                    case 2://page2去page3
                        if(EndDom == _self.ele.$p2_text.find(".htitle")[0]){//page2文字消失
                            _self.ele.$p3.find(".scene-img img,.page-bar").addClass("move_from_Left100");//page3绿条和图片从左边出现
                            _self.ele.$p3.find(".htitle,.stitle,p").addClass("move_from_down");//page3文字出现
                            return;
                        }
                        if(EndDom == _self.ele.$p2_text[0]){//page2离开
                            _self.ele.$p2.removeClass("active bg-color-white").addClass("none");//page2
                            _self.ele.$p2_text.removeClass("go_to_Up100").find(".htitle").addClass("opacity").removeClass("fadeOut");
                            _self.ele.$p2_text.find(".stitle,.pragraph p").removeClass("fadeOut").addClass("opacity");
                            _self.ele.$p2.find(".scene-img img").removeClass("leave_to_Left100");
                            _self.ele.$p2.find(".page-bar").removeClass("leave_to_Right100");
                            return;
                        }
                        if(EndDom == _self.ele.$p3.find(".htitle")[0]){
                            _self.ele.$p3_text.removeClass("opacity Page_from_down");
                            _self.ele.$p3_text.find(".htitle,pragraph p").removeClass("opacity move_from_down");
                            _self.ele.$p3_text.find(".page-bar,.scene-img img").removeClass("opacity move_from_Left100");
                            _self.isAnimate = false;//动画结束
                            _self.wheel.now = _self.wheel.next;
                        }
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        //不存在这个情况
                        break;
                }
            }

            // _iCreative.removeEvent(window,_iCreative.Event.animationEnd);
        },
        PageTEnd:function(){
            console.log("transitionEnd")

            // _iCreative.removeEvent(window,_iCreative.Event.transitionEnd);
        }
    };
    var instance = new about();
    window.about = instance;
}())