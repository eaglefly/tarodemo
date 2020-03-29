
function jsonPath(obj, expr, arg) {
    var P = {
        resultType: arg && arg.resultType || 'VALUE',
        result: [],
        normalize: function (expr) {
            var subX = [];
            return expr.replace(/[\['](\??\(.*?\))[\]']/g, function ($0, $1) {
                return '[#' + (subX.push($1) - 1) + ']';
            }).replace(/'?\.'?|\['?/g, ';').replace(/;;;|;;/g, ';..;').replace(/;$|'?]|'$/g, '').replace(/#([0-9]+)/g, function ($0, $1) {
                return subX[$1];
            });
        },
        asPath: function (path) {
            var x = path.split(';'), p = '$';
            for (var i = 1, n = x.length; i < n; i++)
                p += /^[0-9*]+$/.test(x[i]) ? '[' + x[i] + ']' : '[\'' + x[i] + '\']';
            return p;
        },
        store: function (p, v) {
            if (p)
                P.result[P.result.length] = P.resultType == 'PATH' ? P.asPath(p) : v;
            return !!p;
        },
        trace: function (expr, val, path) {
            if (expr) {
                var x = expr.split(';'), loc = x.shift();
                x = x.join(';');
                if (val && val.hasOwnProperty(loc))
                    P.trace(x, val[loc], path + ';' + loc);
                else if (loc === '*')
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        P.trace(m + ';' + x, v, p);
                    });
                else if (loc === '..') {
                    P.trace(x, val, path);
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        typeof v[m] === 'object' && P.trace('..;' + x, v[m], p + ';' + m);
                    });
                } else if (/,/.test(loc)) {
                    // [name1,name2,...]
                    for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
                        P.trace(s[i] + ';' + x, val, path);
                } else if (/^\(.*?\)$/.test(loc))
                // [(expr)]
                    P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(';') + 1)) + ';' + x, val, path);
                else if (/^\?\(.*?\)$/.test(loc))
                // [?(expr)]
                    P.walk(loc, x, val, path, function (m, l, x, v, p) {
                        if (P.eval(l.replace(/^\?\((.*?)\)$/, '$1'), v[m], m))
                            P.trace(m + ';' + x, v, p);
                    });
                else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc))
                // [start:end:step]  phyton slice syntax
                    P.slice(loc, x, val, path);
            } else
                P.store(path, val);
        },
        walk: function (loc, expr, val, path, f) {
            if (val instanceof Array) {
                for (var i = 0, n = val.length; i < n; i++)
                    if (i in val)
                        f(i, loc, expr, val, path);
            } else if (typeof val === 'object') {
                for (var m in val)
                    if (val.hasOwnProperty(m))
                        f(m, loc, expr, val, path);
            }
        },
        slice: function (loc, expr, val, path) {
            if (val instanceof Array) {
                var len = val.length, start = 0, end = len, step = 1;
                loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) {
                    start = parseInt($1 || start);
                    end = parseInt($2 || end);
                    step = parseInt($3 || step);
                });
                start = start < 0 ? Math.max(0, start + len) : Math.min(len, start);
                end = end < 0 ? Math.max(0, end + len) : Math.min(len, end);
                for (var i = start; i < end; i += step)
                    P.trace(i + ';' + expr, val, path);
            }
        },
        eval: function (x, _v) {
            try {
                return $ && _v && calcExpression(x.replace(/@/g, '_v'));
            } catch (e) {
                throw new SyntaxError('jsonPath: ' + e.message + ': ' + x.replace(/@/g, '_v').replace(/\^/g, '_a'));
            }
        }
    };
    var $ = obj;
    if (expr && obj && (P.resultType == 'VALUE' || P.resultType == 'PATH')) {
        P.trace(P.normalize(expr).replace(/^\$;/, ''), obj, '$');
        return P.result.length ? P.result : false;
    }
}

function calcExpressionWithoutQuote(expression) {

    if ((expression.indexOf('(') > -1) || (expression.indexOf(')') > -1)) {
      return calcQuote(expression);
    }
    var operators = [];
    var nums = [];
    var lastOperatorIndex = -1;
    for (var i = 0; i < expression.length; i++) {
      var charAtIndex = expression.charAt(i);
      if (isOperatorChar(charAtIndex)) {
        operators[operators.length] = charAtIndex;
        nums[nums.length] = expression.substring(lastOperatorIndex + 1, i);
        lastOperatorIndex = i;
      }
      if (i == (expression.length - 1) && lastOperatorIndex < i) {
        nums[nums.length] = expression.substring(lastOperatorIndex + 1, expression.length);
      }
    }
    if (operators.length <= 0 || nums.length <= 0) {
      return expression;
    }
    while (operators.indexOf('*') > -1 || operators.indexOf('/') > -1) {
      operators.forEach(function (value, index) {
        if (value == '*' || value == '/') {
          // 拿到操作符位置。
          var tempResult = calcExpressionWithSingleOperator(nums[index], nums[index + 1], value);
          operators.splice(index, 1);
          nums.splice(index, 2, [tempResult]);
        }
      });
    }
  
    var calcResult = nums[0] * 1;
    // 现在只剩下'+'、'-'了
    if (operators.indexOf('+') > -1 || operators.indexOf('-') > -1) {
      for (var index = 0; index < operators.length; index++) {
        var value = operators[index];
        if (value == '+' || value == '-') {
          calcResult = calcExpressionWithSingleOperator(calcResult, nums[index + 1], value);
        }
      }
      return calcResult;
    } else {
      return (nums[0] * 1);
    }
  
  }
  /**
   * 计算只有一个操作符的表达式的值(操作符限定为'+'、'-'、'*'、'/')
   */
  function calcExpressionWithSingleOperator(num1, num2, operator) {
    if (operator == '+') return num1 * 1 + num2 * 1;
    if (operator == '-') return num1 * 1 - num2 * 1;
    if (operator == '*') return num1 * num2;
    if (operator == '/') return num1 / num2;
    return NaN;
  }
  
  /** 计算算术表达式的值 */
  function calcExpression(expression) {
    expression = expression.replace(/\s/g, '').replace(/÷/g, '/').replace(/x/g, '*').replace(/×/g, '*').replace(/X/g, '*');
    if (getCharCountInString(expression, '(') != getCharCountInString(expression, ')'))
      return NaN;
    while (expression && (expression.indexOf('(') > -1) && (expression.indexOf(')') > -1)) {
      var firstRightQuoteIndex = expression.indexOf(')');
      var leftQuoteIndex = expression.indexOf('(');
      for (var i = leftQuoteIndex; i < firstRightQuoteIndex; i++) {
        if (expression.charAt(i) == '(') {
          leftQuoteIndex = i;
        }
      }
      var tempExpression = expression.substring(leftQuoteIndex + 1, firstRightQuoteIndex);
      var tempValue = calcExpressionWithoutQuote(tempExpression);
      expression = expression.substring(0, leftQuoteIndex) + tempValue + expression.substring(firstRightQuoteIndex + 1, expression.length);
    }
    return calcExpressionWithoutQuote(expression);
  }
  
  /**获取字符串中某子字符串出现次数 */
  function getCharCountInString(strings, chars) {
    return (strings.split(chars)).length - 1;
  }
  /**判断字符是否是运算符 */
  function isOperatorChar(aimChar) {
    return '+-*/'.indexOf(aimChar) > - 1;
  }