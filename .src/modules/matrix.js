import { asArray } from '../functions/cast';
import { times } from '../functions/enumerable';
import { turnTime } from '../functions/nice';

export const PlainMatrix = (function(){
  const PlainMatrix = function(data, column, row){
    asArray(data).forEach(datum=>{ this.push(datum); });
    Object.defineProperties(this,{
      column:{
        enumerable:false,
        value:column
      },
      row:{
        enumerable:false,
        value:row
      }
    })
  };

  PlainMatrix.prototype = {
    eachColumn (){
    
    },
    eachRow (){
    
    },
    toMatrix (eachResultHook){
      const result = [];
      eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined;
      
      times(this.column * this.row,(index)=>{
        const [ colIndex, rowIndex ] = turnTime(index, this.column);
        if(!result[rowIndex]) result.push([]);
        const dataResult = eachResultHook ? eachResultHook(data,index,colIndex,rowIndex) : data;
        result[rowIndex].push(dataResult);
      });
      return result;
    },
    multiply (){
    
    }
  };
  
  return PlainMatrix;
})();

export const makeMatrixArray = function(column,row,eachHook){
  const matrixProto = times(column*row,(index)=>{
    const [ colIndex, rowIndex ] = turnTime(index, column);
    return eachHook(index, colIndex, rowIndex);
  });
  return new PlainMatrix(matrixProto,column,row);
};