// cats.component.ts
import { Component, OnInit } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { Animal } from 'src/app/models/animal/animal';
import { AnimalsService } from 'src/app/services/Animals/animals.service';
import { PetService } from 'src/app/services/Pets/pet.service';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent{
  public cats!:Animal[];

  constructor(private _animals: AnimalsService, private _petService: PetService) { }


  getCats(){
    return this._animals.getAnimals().filter(animal => animal.type === 'Cat');
  }

  selectCat(cat: Animal): void {
    this._petService.selectPet(cat);
  }
}
