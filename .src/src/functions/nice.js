import { isNumber, isArray, isAbsoluteNaN } from './isLike';

export const limitOf = (function() {
  const limitNumber = function(number, max, min) {
    if(typeof number == "number") {
      if(isAbsoluteNaN(number) || number === Infinity) {
        return min;
      }
      if(isNumber(min) && (number < min)) {
        return min;
      }
      if(isNumber(max) && (number > max)) {
        return max;
      }
    }
    return number;
  };
  const limitOf = function(numbers, max, min) {
    if(typeof max !== "number") { max = Number.POSITIVE_INFINITY; }
    if(typeof min !== "number") {
      if(min === null || isAbsoluteNaN(min)) {
        min = Number.NEGATIVE_INFINITY;
      } else {
        min = 0;
      }
    }
    if(isArray(numbers)) {
      for(var d = numbers, i = 0, l = d.length; i < l; i++) {
        d[i] = limitNumber(d[i], max, min);
      }
      return numbers;
    } else {
      return limitNumber(numbers, max, min);
    }
  };
  return limitOf;
}());