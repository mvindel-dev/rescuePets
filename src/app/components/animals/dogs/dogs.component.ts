import { Component } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import { Animal } from 'src/app/models/animal/animal';
import { AnimalsService } from 'src/app/services/Animals/animals.service';
import { PetService } from 'src/app/services/Pets/pet.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dogs',
  templateUrl: './dogs.component.html',
  styleUrls: ['./dogs.component.css']
})
export class DogsComponent {

  public dogs!: Animal[];
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

  getDogs(){
    return this._animals.getAnimals().filter(animal => animal.type === 'Dog');
  }

  selectDog(dog: Animal): void {
    this._petService.selectPet(dog);
  }
  
}

