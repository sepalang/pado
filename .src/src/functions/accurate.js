import { 
  isNumber
} from './isLike';

export const accurateTimeout = (function(originalTimeout){
  return function(trigger,time=0,resolutionRatio=0.75,coverage=25){
    let destTime = Date.now() + time;
    
    if(!isNumber(time)){
      time=0;
    }
    
    if(!isNumber(resolutionRatio)){
      resolutionRatio = 0.75
    }
    
    if(!isNumber(coverage)){
      resolutionRatio = 25
    }
    
    if(resolutionRatio > 1){
      resolutionRatio = 1;
    }
        
    if(resolutionRatio < 0.1){
      resolutionRatio = 0.1;
    }
    
    if(coverage < 5){
      coverage = 5;
    }
        
    function preparation(restTime){
      const preparaTime = Math.floor(restTime * resolutionRatio);
      originalTimeout(execution,preparaTime);
    }
        
    function execution(){
      const restTime = destTime - Date.now();
        
      if(restTime < coverage){
        if(restTime < 1){
          originalTimeout(trigger,0);
        } else {
          originalTimeout(trigger,restTime);
        }
      } else {
        preparation(restTime);
      }
    }
    
    execution();
  }
}(setTimeout))