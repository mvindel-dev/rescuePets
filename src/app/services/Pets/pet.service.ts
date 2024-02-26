import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Animal } from '../../models/animal/animal';


@Injectable({
  providedIn: 'root'
})
export class PetService{
  
  private selectedPetSubject = new BehaviorSubject<Animal | null>(null);
  selectedPet$ = this.selectedPetSubject.asObservable();

  selectPet(pet: Animal | null) {
    this.selectedPetSubject.next(pet);
  }
}
