// animals.service.ts
import { Injectable, OnInit } from '@angular/core';
import { Animal } from '../../models/animal/animal';
import { Firestore, collectionData, deleteDoc, limit, setDoc, where} from '@angular/fire/firestore';
import { CollectionReference, DocumentReference, addDoc, collection, doc, query } from 'firebase/firestore';
import { Router } from '@angular/router';
import { idToken } from '@angular/fire/auth';
import { AuthService } from '../auth.service';

// import { Observable, Subject } from 'rxjs';
// import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimalsService{
  private _animals: Animal[] = [];
  private _petCollection: CollectionReference<Animal>;
  // private _dataLoadedSubject = new Subject<void>();

  constructor(private _firestore: Firestore, private _router:Router, private _authService:AuthService) {
    this._petCollection = collection(this._firestore, 'pet') as CollectionReference<Animal>;
    this.retrieveAnimals()
  }

  retrieveAnimals(){
    collectionData(this._petCollection, {'idField': 'id'}).subscribe({
      next: (pets: Animal[]) => {
        this._animals=pets;
      }
    });
  }

  
  getAnimals(): Animal[] {
    return this._animals;
  }


  getAnimalByName(name: string): Animal | null {
    const lowercaseName = name.toLowerCase();
    return this._animals?.find(animal => animal.name.toLowerCase() === lowercaseName) || null;
  }


  addAnimal(animal: Animal): boolean{
    let user_id= this._authService.currentUser?.uid;
    if(user_id){
      let isAdmin = this._authService.checkIsAdmin(user_id);
      if(isAdmin){
        addDoc(this._petCollection, animal);
        this.retrieveAnimals();
        return true;
      }
    }

    return false;
  }

  editAnimal(animal: Animal){
    let updatedAnimalData: Animal = animal;
    let documentRef: DocumentReference<Animal> = doc(this._firestore, 'pet', animal.id) as DocumentReference<Animal>;

    let user_id= this._authService.currentUser?.uid;
    if(user_id){
      let isAdmin = this._authService.checkIsAdmin(user_id);
      if(isAdmin){
        setDoc(documentRef, updatedAnimalData).then(() => {});
        return true;
      }
    }

    return false;
  }

  deleteAnimal(animal:Animal): boolean{
    let documentRef: DocumentReference<Animal> = doc(this._firestore, 'pet', animal.id) as DocumentReference<Animal>;

    let user_id= this._authService.currentUser?.uid;
    if(user_id){
      let isAdmin = this._authService.checkIsAdmin(user_id);
      if(isAdmin){
        try {
          for(let i=0; i<this._animals.length;i++){
            if(this._animals[i]==animal){
              this._animals.splice(i);
            }
          }
          deleteDoc(documentRef).then(() => {});
          return true;          
        } catch (error) {
          console.log(error);
        }
      }
    } 

    return false;
  }
  
  }
















































































  // retrieveData(): void {
  //   this._http.get('../assets/data/pets_data.json').subscribe({
  //     next: (data: any) => {
  //       this._animals = data?.pets || [];
  //       this._cats = this._animals?.filter(animal => animal.type === 'Cat') || [];
  //       this._dogs = this._animals?.filter(animal => animal.type === 'Dog') || [];
  //       this._dataLoadedSubject.next();
  //       // this.putAnimalsOnBBDD(); per carregar animals a bbdd
  //     },
  //     error: (msg: string) => {
  //       console.error("Error " + msg);
  //     }
  //   });
  // }


  // putAnimalsOnBBDD(){
  //   if(this._animals!==null){
  //     for(let i=0; i<this._animals.length; i++){
  //       addDoc(this._petCollection, this._animals[i]);
  //       if(this._animals[i].type==="Cat"){
  //         addDoc(this._catCollection, this._animals[i]);
  //       }else{
  //         addDoc(this._dogCollection, this._animals[i]);
  //       }
  //     }
  //   }
  // }

