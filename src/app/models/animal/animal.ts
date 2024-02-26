export interface Animal {
  id:string;
  animalId?:string;
  name:string;
  type:string;
  main_image:string;
  carousel_imgs:String[];
  biography:Array<string>;
  sex:string;
  birthdate:string;
  age:number;
  chip:string;
  vaccines:Array<string>;
  diseases:Array<string>;
  observations:Array<string>;
}

