/*
  const { x, y, radius, diameter } = drawCircleVars(this.size, this.stroke);
  return `M${x} ${y} 
  a ${radius} ${radius} 0 0 1 0 ${diameter}
  a ${radius} ${radius} 0 0 1 0 -${diameter}`;
*/

export const drawCircleVars = function(circleWidth, strokeWidth=0, drawRatio=1){
  const circumference = ((circleWidth - strokeWidth) / 2 ) * ( 3.14159 * 2 );
  const radius        = (circumference / ( 3.14159 * 2 ));
  const diameter      = (radius * 2);
  const x             = circleWidth / 2;
  const y             = strokeWidth / 2;
  //const circumLength  = drawRatio == 1 ? drawRatio : drawRatio * circumference;
    
  return { x, y, radius, diameter, circumference, circleWidth, strokeWidth };
};