"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.newState = void 0;
var newState = function () {
    var state = {
        data: {},
        watch: {},
        once: {},
        until: {},
        when: {},
        and: {},
        or: { thisisor: 1 },
        isValuesToCheckAgainst: [],
        is: function (is) {
            this.conditionToSet += '_cvid_' + this.isValuesToCheckAgainst.length;
            this.isValuesToCheckAgainst = __spreadArray(__spreadArray([], this.isValuesToCheckAgainst, true), [is], false);
            return this;
        },
        conditionToSet: '',
        lastAccessedValue: null
    };
    Object.defineProperty(state.or, 'more', {
        get: function () {
            console.log(state.conditionToSet);
            if (state.conditionToSet.indexOf('_cvid_') > -1) {
                state.conditionToSet += '_omore_';
                return state;
            }
            else {
                throw new Error('You must use the is() method before using the "more"');
            }
        }
    });
    Object.defineProperty(state.or, 'less', {
        get: function () {
            if (state.conditionToSet.indexOf('_cvid_') > -1) {
                state.conditionToSet += '_oless_';
                return state;
            }
            else {
                throw new Error('You must use the is() method before using the "less"');
            }
        }
    });
    function setStateMembers(payl) {
        var _this = this;
        Object.keys(payl).forEach(function (key) {
            var altkey = "_".concat(key);
            if (_this[key])
                return;
            _this.data[altkey] = { value: payl[key] };
            _this.watch[key] = {};
            Object.defineProperty(state, key, {
                set: function (v) {
                    var was = _this.data[altkey].value;
                    _this.data[altkey].value = v;
                    // always run
                    var watchers = _this.watch["get_".concat(key)];
                    var oncers = _this.once[key];
                    var cond_watchers = _this.until[key];
                    if (watchers && watchers.length) {
                        watchers.forEach(function (entry) {
                            var conditionResult = entry.condition ? entry.condition.split('_ncd_').reduce(function (result, cd) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
                                var _r = cd.split('_cvid_'), condition = _r[0], checkValueId = _r[1];
                                var orMore = false;
                                var orLess = false;
                                if (checkValueId) {
                                    if (checkValueId.indexOf('_omore_') > -1) {
                                        orMore = true;
                                        checkValueId = checkValueId.replace('_omore_', '');
                                    }
                                    if (checkValueId.indexOf('_oless_') > -1) {
                                        orLess = true;
                                        checkValueId = checkValueId.replace('_oless_', '');
                                    }
                                }
                                var checkValue = entry.isValues[checkValueId];
                                var operator = condition[0] === '&' ? 'and' : condition[0] === '|' ? 'or' : 'none';
                                if (checkValueId) {
                                    /*
                                    If is() method provided with a function we run the function and return early before value checking
                                    */
                                    if (checkValue.call) {
                                        return checkValue((_a = _this.data["_".concat(condition)]) === null || _a === void 0 ? void 0 : _a.value);
                                    }
                                    if (orMore) {
                                        switch (operator) {
                                            case 'none':
                                                return result && !!(((_b = _this.data["_".concat(condition)]) === null || _b === void 0 ? void 0 : _b.value) >= checkValue);
                                            case 'and':
                                                return result && !!(((_c = _this.data["_".concat(condition.slice(1))]) === null || _c === void 0 ? void 0 : _c.value) >= checkValue);
                                            case 'or':
                                                return result || !!(((_d = _this.data["_".concat(condition.slice(1))]) === null || _d === void 0 ? void 0 : _d.value) >= checkValue);
                                        }
                                    }
                                    else if (orLess) {
                                        switch (operator) {
                                            case 'none':
                                                return result && !!(((_e = _this.data["_".concat(condition)]) === null || _e === void 0 ? void 0 : _e.value) <= checkValue);
                                            case 'and':
                                                return result && !!(((_f = _this.data["_".concat(condition.slice(1))]) === null || _f === void 0 ? void 0 : _f.value) <= checkValue);
                                            case 'or':
                                                return result || !!(((_g = _this.data["_".concat(condition.slice(1))]) === null || _g === void 0 ? void 0 : _g.value) <= checkValue);
                                        }
                                    }
                                    else {
                                        switch (operator) {
                                            case 'none':
                                                return result && !!(((_h = _this.data["_".concat(condition)]) === null || _h === void 0 ? void 0 : _h.value) === checkValue);
                                            case 'and':
                                                checkValue;
                                                console.log((_j = _this.data["_".concat(condition.slice(1))]) === null || _j === void 0 ? void 0 : _j.value);
                                                console.log(!!(((_k = _this.data["_".concat(condition.slice(1))]) === null || _k === void 0 ? void 0 : _k.value) === checkValue));
                                                result;
                                                return result && !!(((_l = _this.data["_".concat(condition.slice(1))]) === null || _l === void 0 ? void 0 : _l.value) === checkValue);
                                            case 'or':
                                                return result || !!(((_m = _this.data["_".concat(condition.slice(1))]) === null || _m === void 0 ? void 0 : _m.value) === checkValue);
                                        }
                                    }
                                }
                                else {
                                    switch (operator) {
                                        case 'none':
                                            return result && !!((_o = _this.data["_".concat(condition)]) === null || _o === void 0 ? void 0 : _o.value);
                                        case 'and':
                                            return result && !!((_p = _this.data["_".concat(condition.slice(1))]) === null || _p === void 0 ? void 0 : _p.value);
                                        case 'or':
                                            return result || !!((_q = _this.data["_".concat(condition.slice(1))]) === null || _q === void 0 ? void 0 : _q.value);
                                    }
                                }
                            }, true) : true;
                            if (conditionResult) {
                                entry.fn(v, was, _this.data);
                            }
                        });
                    }
                    if (oncers && oncers.length) {
                        oncers.forEach(function (cb) { return cb(v, was, _this.data); });
                        _this.data[altkey].once = [];
                    }
                    if (cond_watchers && cond_watchers.length) {
                        var remaining_watchers = cond_watchers.filter(function (cb) { return cb(v, was, _this.data); });
                        _this.data[altkey].once = remaining_watchers;
                    }
                },
                get: function () {
                    if (_this.conditionToSet) {
                        throw new Error('You should you one of the following after declaring a "when statement": and, or, watch');
                    }
                    _this.lastAccessedValue = altkey;
                    return _this.data[altkey].value;
                }
            });
            /*********
             * WATCH *
             *********/
            Object.defineProperty(_this.watch, key, {
                set: function (_fn) {
                    var setWatcher = function (fn) {
                        var condition = _this.conditionToSet;
                        var isValues = _this.isValuesToCheckAgainst.slice();
                        _this.conditionToSet = '';
                        _this.isValuesToCheckAgainst = [];
                        _this.data[altkey].watch = __spreadArray(__spreadArray([], (_this.data[altkey].watch || []), true), [{ condition: condition, fn: fn, isValues: isValues }], false);
                    };
                    if (_fn) {
                        setWatcher(_fn);
                    }
                },
                get: function () {
                    var setWatcher = function (fn) {
                        var condition = _this.conditionToSet;
                        var isValues = _this.isValuesToCheckAgainst.slice();
                        _this.conditionToSet = '';
                        _this.isValuesToCheckAgainst = [];
                        _this.data[altkey].watch = __spreadArray(__spreadArray([], (_this.data[altkey].watch || []), true), [{ condition: condition, fn: fn, isValues: isValues }], false);
                    };
                    return function (_fn) { if (_fn.call) {
                        setWatcher(_fn);
                    } };
                }
            });
            Object.defineProperty(_this.watch, "get_".concat(key), {
                get: function () {
                    return _this.data[altkey].watch;
                }
            });
            /********
             * ONCE *
             ********/
            Object.defineProperty(_this.once, key, {
                set: function (fn) {
                    _this.data[altkey].once = __spreadArray(__spreadArray([], (_this.data[altkey].once || []), true), [fn], false);
                },
                get: function () {
                    _this.lastAccessedValue = altkey;
                    return _this.data[altkey].once;
                }
            });
            /*********
             * UNTIL *
             *********/
            Object.defineProperty(_this.until, key, {
                set: function (fn) {
                    _this.data[altkey].until = __spreadArray(__spreadArray([], (_this.data[altkey].onchange || []), true), [fn], false);
                },
                get: function () {
                    _this.lastAccessedValue = altkey;
                    return _this.data[altkey].until;
                }
            });
            /********
             * WHEN *
             ********/
            Object.defineProperty(_this.when, key, {
                get: function () {
                    _this.lastAccessedValue = altkey;
                    _this.conditionToSet = key;
                    return _this;
                }
            });
            /********
             * AND *
             ********/
            Object.defineProperty(_this.and, key, {
                get: function () {
                    _this.lastAccessedValue = altkey;
                    _this.conditionToSet += '_ncd_&' + key;
                    return _this;
                }
            });
            /********
             * OR *
             ********/
            Object.defineProperty(_this.or, key, {
                get: function () {
                    _this.lastAccessedValue = altkey;
                    _this.conditionToSet += '_ncd_|' + key;
                    return _this;
                }
            });
        });
    }
    Object.defineProperty(state, "set", {
        set: function (payl) { return setStateMembers.call(state, payl); },
        get: function () { return function (payl) {
            return setStateMembers.call(state, payl);
        }; }
    });
    /********************
     * when.watch ERROR *
     ********************/
    Object.defineProperty(state.when, 'watch', {
        get: function () {
            throw new Error('You should specify a state member to check after "when" before calling watch');
        }
    });
    /********************
     * when.and ERROR *
     ********************/
    Object.defineProperty(state.when, 'and', {
        get: function () {
            throw new Error('You should specify a state member to check after "when" before calling "and"');
        }
    });
    /********************
     * when.or ERROR *
     ********************/
    Object.defineProperty(state.when, 'or', {
        get: function () {
            var trace = console.trace();
            throw new Error('You should specify a state member to check after "when" before calling "or"');
        }
    });
    return state;
};
exports.newState = newState;
var globalState = (0, exports.newState)();
exports["default"] = globalState;
