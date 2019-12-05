import Tween from './tween'
var animationId = -1
var killAnimationId = animationId - 1

var _customAnimation = {};

_customAnimation.to = function (obj, duration, options) {
    duration *= 1000;
    var delay = options.delay || 0;
    for (var name in options) {
        if (name === 'delay') {
            delay = options[name];
        } else if (name === 'onComplete') { } else if (name === 'ease') { } else {
            setTimeout(function (name) {
                return function () {
                    TweenAnimation(obj[name], options[name], duration, options.ease || 'Linear', function (value, complete) {
                        obj[name] = value;
                        if (complete) {
                            options.onComplete && options.onComplete();
                        }
                    });
                };
            }(name), delay * 1000);
        }
    }
}


// 对运动方法进行封装
var _TweenAnimation = function TweenAnimation(from, to, duration, easing, callback) {
    var selfAnimationId = ++animationId;
    var isUndefined = function isUndefined(obj) {
        return typeof obj == 'undefined';
    };
    var isFunction = function isFunction(obj) {
        return typeof obj == 'function';
    };
    var isNumber = function isNumber(obj) {
        return typeof obj == 'number';
    };
    var isString = function isString(obj) {
        return typeof obj == 'string';
    };

    // 转换成毫秒
    var toMillisecond = function toMillisecond(obj) {
        if (isNumber(obj)) {
            return obj;
        } else if (isString(obj)) {
            if (/\d+m?s$/.test(obj)) {
                if (/ms/.test(obj)) {
                    return 1 * obj.replace('ms', '');
                }
                return 1000 * obj.replace('s', '');
            } else if (/^\d+$/.test(obj)) {
                return +obj;
            }
        }
        return -1;
    };

    if (!isNumber(from) || !isNumber(to)) {
        if (window.console) {
            console.error('from和to两个参数必须且为数值');
        }
        return 0;
    }

    // 缓动算法
    var tween = Tween

    if (!tween) {
        if (window.console) {
            console.error('缓动算法函数缺失');
        }
        return 0;
    }

    // duration, easing, callback均为可选参数
    // 而且顺序可以任意
    var options = {
        duration: 300,
        easing: 'Linear',
        callback: function callback() { }
    };

    var setOptions = function setOptions(obj) {
        if (isFunction(obj)) {
            options.callback = obj;
        } else if (toMillisecond(obj) != -1) {
            options.duration = toMillisecond(obj);
        } else if (isString(obj)) {
            options.easing = obj;
        }
    };
    setOptions(duration);
    setOptions(easing);
    setOptions(callback);

    // requestAnimationFrame的兼容处理
    if (!window.requestAnimationFrame) {
        requestAnimationFrame = function requestAnimationFrame(fn) {
            setTimeout(fn, 16.7);
        };
    }

    // 算法需要的几个变量
    var start = -1;
    // during根据设置的总时间计算
    var during = Math.ceil(options.duration / 16.7);

    // 当前动画算法
    // 确保首字母大写
    options.easing = options.easing.slice(0, 1).toUpperCase() + options.easing.slice(1);
    var arrKeyTween = options.easing.split('.');
    var fnGetValue;

    if (arrKeyTween.length == 1) {
        fnGetValue = tween[arrKeyTween[0]];
    } else if (arrKeyTween.length == 2) {
        fnGetValue = tween[arrKeyTween[0]] && tween[arrKeyTween[0]][arrKeyTween[1]];
    }
    if (isFunction(fnGetValue) == false) {
        console.error('没有找到名为"' + options.easing + '"的动画算法');
        return;
    }

    var startTime = Date.now();
    var lastTime = Date.now();
    // 运动
    var step = function step() {

        var currentTime = Date.now();
        var interval = currentTime - lastTime;

        if (interval) {
            var fps = Math.ceil(1000 / interval);
        } else {
            requestAnimationFrame(step);
            return;
        }

        lastTime = currentTime;
        if (interval > 100) {
            requestAnimationFrame(step);
            return;
        }

        if (fps >= 30) {
            start++;
        } else {
            var _start = Math.floor((currentTime - startTime) / 16.7);
            start = _start > start ? _start : start + 1;
        }

        // 当前的运动位置

        var value = fnGetValue(start, from, to - from, during);

        // 如果还没有运动到位，继续
        if (start <= during && selfAnimationId > killAnimationId) {
            options.callback(value);
            requestAnimationFrame(step);
        } else if (start > during && selfAnimationId > killAnimationId) {
            // 动画结束，这里可以插入回调...
            options.callback(to, true);
        } else { }
    };
    // 开始执行动画
    step();
};

var _stopAllAnimation = () => {
    killAnimationId = animationId;
}

export const customAnimation = _customAnimation;
export const TweenAnimation = _TweenAnimation;
export const stopAllAnimation = _stopAllAnimation;
