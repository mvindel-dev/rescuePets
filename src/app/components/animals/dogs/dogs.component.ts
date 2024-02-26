import { Component } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { Animal } from 'src/app/models/animal/animal';
import { AnimalsService } from 'src/app/services/Animals/animals.service';
import { PetService } from 'src/app/services/Pets/pet.service';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css']
})
export class DogsComponent {

  public dogs!: Animal[];

  constructor(private _animals: AnimalsService, private _petService: PetService) {}

  getDogs(){
    return this._animals.getAnimals().filter(animal => animal.type === 'Dog');
  }

  selectDog(dog: Animal): void {
    this._petService.selectPet(dog);
  }
  
}

