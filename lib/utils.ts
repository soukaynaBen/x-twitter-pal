import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  function getQueryIdRegex() : RegExp {
     
     return new RegExp(`queryId:[\s\n]*"(.+)",[\s\n]*operationName:[\s\n]*"(.+)"`)
}

export  async function  Sleep (second: number)  {
    return new Promise((resolve)=> {
        setTimeout(() => {
           resolve(second)        
      }, second * 1000);
    })
}