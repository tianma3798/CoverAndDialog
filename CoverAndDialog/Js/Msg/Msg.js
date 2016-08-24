/// <reference path="../jquery-1.11.1.min.js" />


/*
* 操作消息显示  1.0 样式控制
* 1.可指定进度条的位置 top center
* 2.可指定是否是模式 进度条
* 3.可指定进度条的宽度高度
*/

(function () {
    var Msg = function (opts) {
        var defaults = {
            width: 150,
            height: 30,
            top: 'top',  //指定显示区 距离顶部的高度 top,ceneter
            model: false,
            content: '数据加载中...',
            hideType: 'fade', //消失的方式 fade 渐变消失 ，upfade 向上渐变消失
            loadImg: '/js/msg/loading.gif',//指定加载的进度条图片的大小 small---loading.gif | middle-loading2.gif

            onShow: function () { },//开始显示 事件
            onDestory: function () { }, //销毁显示事件
            onHide: function () { }  //隐藏 事件
        }
        this.opts = $.extend({}, defaults, opts);

        this.init();
    }

    //用于显示结果的定时消失
    var timer = null;
    Msg.prototype = {
        //初始化显示
        init: function () {
            var _this = this;
            var _opts=this.opts;

            //创建 任务消息显示 
            var msgPanel = _this.getPanel();
            //遮罩层
            if (_opts.model == true) {
                var msgBack = getDiv('msgBack');
                msgBack.appendTo(msgPanel);
            }

            //显示区
            var msgInner = getDiv('msgInner');
            msgInner.appendTo(msgPanel);
            msgInner.css({
                width: _opts.width,
                height: _opts.height
            });
            _this.setInnerSite();
            if (_opts.top == 'center') {
                $(window).resize(function () {
                    _this.setInnerSite();
                });
            }


            //创建内部  进度显示区
            var loadDiv = getDiv('loadDiv');
            loadDiv.appendTo(msgInner)
            //内容控制
            var text = $('<span />');
            text.addClass('msgText');
            text.html(_opts.content);
            loadDiv.html(text);

            var loading = $('<img />')
            loading.addClass('loading').attr('src', _opts.loadImg);
            loadDiv.append(loading);
            loading.css({
                left: 13,
                top: (_opts.height - 16) / 2
            });

            // 创建内部 结果显示区
            var msgResult = getDiv('msgResult');
            msgResult.appendTo(msgInner).hide();
          


        },
        //设置inner 的位置
        setInnerSite: function () {
            var _this = this;
            var _opts = this.opts;
            var inner = _this.getInner();

            //计算内容的y轴位置
            var top = 0;
            if (_opts.top == 'center') {
                top = ($(window).height() - _opts.height) / 2;
                
            } else if (_opts.top == 'top') {
                top = 0;
            } else {
                top = _opts.top;
            }
            inner.css('top', top);

        },
        ////显示 success信息
        //showSuccess: function () {

        //},
        ////显示 error信息
        //showError: function () {

        //},


        //获取panel
        getPanel: function () {
            var _opts = this.opts;
            var msgPanel = $(document.body).find('.msgPanel');
            if (msgPanel.length <= 0) {
                //创建容器
                msgPanel = getDiv('msgPanel');
                $(document.body).prepend(msgPanel);

                //判断是否 显示背景
                if (_opts.model == true) {
                    msgPanel.append(getDiv('msgBack'));
                }
            }
            return msgPanel;
        },
        //获取内部显示
        getInner: function () {
            return this.getPanel().find('.msgInner');
        },
        //获取显示结果部分
        getResult: function () {
            return this.getInner().find('.msgResult');
        },
        //获取显示 进度部分
        getLoadDiv: function () {
            return this.getInner().find('.loadDiv');
        },

        //显示结果
        showResult: function (content) {
            var _this = this;

            //显示控件
            _this.showPanel();

            var result = _this.getResult();
            result.html(content);

            //显示控制
            result.show().siblings().hide();

            //定时消失
            timer = setTimeout(function () {
                _this.hide();
            }, 2000);

        },
        //显示 过程中
        show: function (content) {
            var _this = this;
            _this.showPanel();
            var loadDiv = _this.getLoadDiv();
            if (content != undefined && content.length > 0) {
                var text = loadDiv.find('.msgText');
                if (/\.{3}$/.test(content) == false) {
                    content += '...';
                }
                text.html(content);
            }
            //显示控制
            loadDiv.show().siblings().hide();
            //清楚自动消失
            if (timer != null) {
                clearTimeout(timer);
            }
        },
        //显示 panel 和inner
        showPanel: function () {
            var _this = this;
            _this.getPanel().show();
            _this.getInner().fadeIn(200);
        },
        //隐藏
        hide: function () {
            var _this = this;
            var _opts = this.opts;

            var inner = _this.getInner();

            if (_opts.hideType == 'fade') {
                inner.fadeOut('slow', function () {
                    _this.getPanel().hide();
                });
            }
            else if (_opts.hideType == 'upfade') {
                var currentTop = inner.offset().top;
                var currentWidth = inner.width();
                inner.animate({
                    opacity: 0,
                    top: 0
                }, 400, function () {
                    _this.getPanel().hide();

                    inner.css({
                        opacity: 1,
                        top: currentTop
                    });
                });
            }

            //清楚自动消失
            if (timer != null) {
                clearTimeout(timer);
            }


        },
        //销毁
        destory: function () {
            this.getPanel().remove();
        }
    }

   

    window.Msg = Msg;


    function getDiv(cla) {
        var div = $('<div />');
        div.addClass(cla);
        return div;
    }
})();