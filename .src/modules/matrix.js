import { asArray } from '../functions/cast';
import { times } from '../functions/enumerable';
import { turnTime } from '../functions/nice';

export const MatrixArray = (function(){
  const MatrixArray = function(data, column, row){
    asArray(data).forEach(datum=>{ this.push(datum); });
    
    Object.defineProperties(this,{
      column:{
        enumerable:false,
        value:column
      },
      row:{
        enumerable:false,
        value:row
      },
      length:{
        enumerable:false
      }
    });
    
  };

  MatrixArray.prototype = Object.assign([],{
    toMatrix (eachResultHook){
      const result = [];
      eachResultHook = typeof eachResultHook === "function" ? eachResultHook : undefined;

      times(this.column * this.row,(index)=>{
        const [ colIndex, rowIndex ] = turnTime(index, this.column);
        const data       = this[index];
        const dataResult = eachResultHook ? eachResultHook(data,index,colIndex,rowIndex) : data;
        if(!result[rowIndex]) result[rowIndex] = [];
        result[rowIndex].push(dataResult);
      });
      
      return result;
    },
    eachColumn (eachFn){
      const rows = this.toMatrix();
      const columns = times(this.column, colIndex=>{
        const colData = [];
        rows.forEach(row=>colData.push(row[colIndex]));
        return colData;
      });
      
      return typeof eachFn === "function" ? columns.map(eachFn) : columns;
    },
    eachRow (eachFn){
      const rows = this.toMatrix();
      return typeof eachFn === "function" ? rows.map(eachFn) : rows;
    },
    multiply (){
      //TODO
    }
  });
  
  return MatrixArray;
})();

export const makeMatrixArray = function(column,row,eachHook){
  const matrixProto = times(column * row,(index)=>{
    const [ colIndex, rowIndex ] = turnTime(index, column);
    return eachHook(index, colIndex, rowIndex) || [colIndex, rowIndex];
  });
  
  const matrixArray = new MatrixArray(matrixProto,column,row);
  return matrixArray;
};