(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '.promise'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('.promise'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.promise);
    global.paginate = mod.exports;
  }
})(this, function (exports, _promise) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.paginate = exports.Paginate = undefined;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var PaginateClass = function PaginateClass(opts) {
    // current page index
    this.page = 0;
    // page per display item length
    this.pagePer = 10;
    // paginate per display page length
    this.paginatePer = 10;
    // totalItem count
    this.totalItems = 0;
    // extra payload
    this.parameters = {};
    // pages ouput style ( all | existOnly )
    this.pagesOutputStyle = 'existOnly';

    this.$pending = false;
    this.$fetchFn = opts.fetch;
    this.$renderFn = opts.render;

    this.update(opts);
    this.$fetchState = -1;

    if (typeof this.$fetchFn !== "function") {
      console.error("paginate::fetch 초기 옵션에 반드시 합수를 선언해 주세요");
    }

    if (typeof this.$renderFn !== "function") {
      console.error("paginate::render 초기 옵션에 반드시 함수를 선언해 주세요");
    }
  };

  PaginateClass.prototype = {
    isAllowPaginate: function isAllowPaginate(needTo) {
      return needTo > -1 && needTo < this.paginateLimit;
    },
    isAllowIndex: function isAllowIndex(needTo, pagelimit) {
      pagelimit = typeof pagelimit === "number" ? pagelimit : this.pageLimit;
      if (pagelimit < 0) return false;
      return needTo > -1 && needTo <= pagelimit;
    },
    fetch: function fetch(payload) {
      var _this = this;

      if (this.$fetchState != -1) {
        return _promise.promise.reject(new Error("paginate::다른 페이징 작업 중에 페이징 처리를 할 수 없습니다."));
      }

      if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) === "object") {
        payload = Object.assign(this.pageState, this.parameters, payload);
      }

      this.$fetchState = 0;
      this.$pending = true;

      return (0, _promise.promise)(function (resolve, reject) {
        _promise.promise.valueOf(_this.$fetchFn(payload)).then(function (e) {
          if (_this.$fetchState == 0) {
            console.warn("paginate::fetch중엔 반드시 update를 해 주십시오");
          }
          _this.$fetchState = -1;
          _this.$pending = true;
          resolve(e);
        }).catch(function (e) {
          _this.$fetchState = -1;
          _this.$pending = true;
          reject(e);
        });
      });
    },
    update: function update(updateOpts) {
      this.hasOwnProperty("$fetchState") && this.$fetchState++;

      if (updateOpts === null || updateOpts === "abort") {
        return;
      }

      this.page = updateOpts.page > -1 ? updateOpts.page : this.page;
      this.pagePer = updateOpts.pagePer || this.pagePer;
      this.paginatePer = updateOpts.paginatePer || this.paginatePer;
      this.totalItems = typeof updateOpts.totalItems === "number" ? updateOpts.totalItems : this.totalItems;

      if (_typeof(updateOpts.parameters) === "object") {
        this.parameters = Object.assign({}, this.parameters, updateOpts.parameters);
      }

      if (typeof this.$renderFn === "function") {
        this.$renderFn(this);
      } else {
        console.warn("paginate::render 함수를 찾을수 없습니다. 반드시 설정해주세요.");
      }
    },
    params: function params(parameters) {
      if (parameters === null) {
        this.parameters = {};
      } else if ((typeof parameters === 'undefined' ? 'undefined' : _typeof(parameters)) === "object") {
        this.parameters = parameters;
      } else {
        console.warn("paginate:parameters는 object 파라메터만 받을수 있습니다.");
      }
      return this;
    },
    refresh: function refresh() {
      return this.fetch({ page: this.page });
    },
    fetchIndex: function fetchIndex(pageIndex) {
      // 설정할수 있는 페이지보다 너무 높으면
      if (pageIndex < 0) {
        return _promise.promise.reject("paginate::-1 이하로 페이지네이션에 접근 할 수 없습니다.");
      }

      if (this.pageLimit < pageIndex) {
        pageIndex = this.pageLimit;
        if (pageIndex < 0) {
          pageIndex = 0;
        }
      }
      return this.fetch({ page: pageIndex });
    },
    fetchNext: function fetchNext() {
      return this.fetchIndex(this.page + 1);
    },
    fetchPrev: function fetchPrev() {
      return this.fetchIndex(this.page - 1);
    },
    fetchTo: function fetchTo(command) {
      var _this2 = this;

      var action = void 0;
      switch (command) {
        case "next":case "nextPage":
          action = function action(e) {
            return _this2.fetchNext();
          };
          break;
        case "prev":case "prevPage":
          action = function action(e) {
            return _this2.fetchPrev();
          };
          break;
        case "firstPage":
          action = function action(e) {
            return _this2.fetchIndex(0);
          };
          break;
        case "lastPage":
          action = function action(e) {
            return _this2.fetchIndex(_this2.pageLimit);
          };
          break;
        /* TODO : if needed
        case "nextPaginate":
          break;
        case "prevPaginate":
          break;
          */
        default:
          if (typeof command === "number") {
            action = function action(e) {
              return _this2.fetchIndex(command);
            };
          }
      }
      if (action) {
        return action();
      } else {
        return _promise.promise.reject("paginate::unknown command", command);
      }
    }
  };

  // pagenation에서 이동 가능한 index의 크기를 반환함
  Object.defineProperty(PaginateClass.prototype, "pageLimit", {
    get: function get() {
      var fixIndex = this.totalItems / this.pagePer;
      // polyfill Number.isInteger
      if (typeof fixIndex === "number" && isFinite(fixIndex) && Math.floor(fixIndex) === fixIndex) {
        return fixIndex - 1;
      } else {
        return Math.floor(fixIndex);
      }
    }
  });

  // pagenation에서 이동 가능한 paginate의 크기를 반환함
  Object.defineProperty(PaginateClass.prototype, "paginateLimit", {
    get: function get() {
      return Math.ceil(this.totalItems / (this.pagePer * this.paginatePer));
    }
  });

  // pagenation에서 이동 가능한 index의 크기를 반환함
  Object.defineProperty(PaginateClass.prototype, "paginate", {
    get: function get() {
      var paginate = Math.floor(this.page / this.paginatePer);
      if (paginate < 0) {
        paginate = 0;
      }
      return paginate;
    }
  });

  Object.defineProperty(PaginateClass.prototype, "pageState", {
    get: function get() {
      return {
        page: this.page,
        pagePer: this.pagePer,
        paginatePer: this.paginatePer,
        totalItems: this.totalItems
      };
    }
  });

  Object.defineProperty(PaginateClass.prototype, "pages", {
    get: function get() {
      // paginate 설정
      var startPageIndex = this.paginatePer * this.paginate;
      var endPageIndex = startPageIndex + this.paginatePer;

      // 렌더링에 필요한 numberItems 생성
      var numberItems = [];
      var pageLimit = this.pageLimit;

      for (; startPageIndex < endPageIndex; startPageIndex++) {
        numberItems.push({
          index: startPageIndex,
          number: startPageIndex + 1,
          $disabled: !this.isAllowIndex(startPageIndex, pageLimit),
          $active: this.page == startPageIndex
        });
      }

      // ui 페이지 번호 출력 보정
      switch (this.pagesOutputStyle) {
        case "existOnly":
          if (pageLimit < 1) {
            numberItems.splice(1, Number.POSITIVE_INFINITY);
          } else {
            var disabledStartIndex = 0;
            for (var d = numberItems, i = 0, l = d.length; i < l; i++) {
              if (d[i].$disabled == false) disabledStartIndex = i + 1;
            }
            if (disabledStartIndex) {
              numberItems.splice(disabledStartIndex, Number.POSITIVE_INFINITY);
            }
          }
          break;
        case "all":
        default:
          // is ok
          break;
      }

      return numberItems;
    }
  });

  Object.defineProperty(PaginateClass.prototype, "allowNext", {
    get: function get() {
      return this.isAllowIndex(this.page + 1, this.pageLimit);
    }
  });

  Object.defineProperty(PaginateClass.prototype, "allowPrev", {
    get: function get() {
      return this.isAllowIndex(this.page - 1, this.pageLimit);
    }
  });

  Object.defineProperty(PaginateClass.prototype, "allowNextPaginate", {
    get: function get() {
      return this.isAllowPaginate(this.paginate + 1);
    }
  });

  Object.defineProperty(PaginateClass.prototype, "allowPrevPaginate", {
    get: function get() {
      return this.isAllowPaginate(this.paginate - 1);
    }
  });

  Object.defineProperty(PaginateClass.prototype, "viewmodel", {
    enumerable: false,
    get: function get() {
      var _this3 = this;

      return {
        page: this.page,
        pagePer: this.pagePer,
        paginatePer: this.paginatePer,
        totalItems: this.totalItems,
        allowNext: this.allowNext,
        allowPrev: this.allowPrev,
        allowNextPaginate: this.allowNextPaginate,
        allowPrevPaginate: this.allowPrevPaginate,
        pages: this.pages,
        parameters: Object.keys(this.parameters).reduce(function (dest, name) {
          dest[name] = _this3.parameters[name];
          return dest;
        }, {})
      };
    }
  });

  var paginateFactory = function paginateFactory(e) {
    return new PaginateClass(e);
  };
  paginateFactory.constructor = PaginateClass;

  var Paginate = exports.Paginate = PaginateClass;
  var paginate = exports.paginate = paginateFactory;
});