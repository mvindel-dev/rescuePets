// cats.component.ts
import { Component, OnInit } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { Animal } from 'src/app/models/animal/animal';
import { AnimalsService } from 'src/app/services/Animals/animals.service';
import { PetService } from 'src/app/services/Pets/pet.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent{
  public cats!:Animal[];
  isAdmin!:boolean;
  isVolunteer!:boolean;


  constructor(private _animals: AnimalsService, private _petService: PetService, private _authService:AuthService) {
    this.loadRoles();

  }

  loadRoles(){
    let userid = this._authService.currentUser?.uid;
    if(userid && this._authService.checkIsLogged()){
      this.isAdmin = this._authService.checkIsAdmin(userid);
      this.isVolunteer = this._authService.checkIsVolunteer(userid);
    }
  }


  getCats(){
    return this._animals.getAnimals().filter(animal => animal.type === 'Cat');
  }

  selectCat(cat: Animal): void {
    this._petService.selectPet(cat);
  }
}
