import { asArray } from '../../functions';

export default function RepeatHelper({ key, enter:enterFn, update:updateFn, exit:exitFn }){
  // {key:string, vm:Component}
  let oldBag = [];
  
  // 모델의 키를 얻는 함수
  const getKey = typeof key === "function" ? key : function(datum){
    return datum[key];
  }
  
  // ng-repeat, v-for와 같은 리피터 구현체 (d3의 data().enter().exit() 컨샙이 비슷함)
  const repeater = function(data){
    let newData = asArray(data);
    let newBag  = [];
    
    //새 데이터를 검사합니다.
    newData.forEach((datum, index)=>{
      //키를 추출합니다.
      const newDatumKey = getKey(datum) || index;
      
      //키 샘플입니다.
      const newMeta = {
        key:newDatumKey,
        datum:datum,
      };
      
      //매치되는 오래된 메타를 확인합니다.
      const matchOldMeta = oldBag.find(old=>old.key === newDatumKey);
      
      //오래된 메타가 확인될 시
      if(matchOldMeta){
        //exit를 하지 않고 살립니다.
        newMeta.vm = matchOldMeta.vm;
        matchOldMeta.$continue = true;
      }
      
      newBag.push(newMeta);
    });
    
    //exit (require)
    oldBag.forEach(oldMeta=>{
      if(!oldMeta.$continue){
        exitFn(oldMeta);
      }
    });
    
    //메타에 추가 정보 입력 (prevVm)
    newBag.forEach((newMeta, index)=>{
      const prevMeta = newBag[index - 1];
      if(prevMeta && prevMeta["vm"]){
        newMeta["prevVm"] = prevMeta["vm"];
      }
    });
    
    //enter (require)
    newBag.forEach((newMeta, index)=>{
      if(!newMeta.vm){
        let result = enterFn(newMeta, index);
        if(!result){
          throw new Error("enter는 반드시 vm을 리턴해야합니다.");
        } else {
          newMeta["vm"] = result;
        }
      }
    });
    
    //update (option)
    updateFn && newBag.forEach((newMeta, index)=>{
      updateFn(newMeta, index);
    });
    
    //history change
    oldBag = newBag;
  }
  
  //컴포넌트에서 정렬된 데이터를 얻기위한 용도로 제작. Component에서 (개발 시간상) 한계로 이곳에서 수행
  repeater["vm"] = function(){
    return oldBag.map(d=>d.vm);
  }
  
  return repeater;
};