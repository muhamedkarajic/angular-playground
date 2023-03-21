export { };

declare global {
  export interface Date {  
    ConvertToDateFromTS(msg: string): Date;
  }
}
  
Date.prototype.ConvertToDateFromTS = function(msg: string): Date {
    return new Date(msg);
}


export function example() {
  let oldDate = new Date();
  let newDate = oldDate.ConvertToDateFromTS('2.1.2022');
  console.log(newDate);
}