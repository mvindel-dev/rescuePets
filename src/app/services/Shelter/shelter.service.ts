import { Injectable } from '@angular/core';
import { Shelter } from '../../models/shelter/shelter';
import { CollectionReference, Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShelterService {

  private _sheltersCollection: CollectionReference<Shelter>;
  private _shelters: Shelter[] = [];

  constructor(private _firestore: Firestore) {
    this._sheltersCollection = collection(this._firestore, 'shelter') as CollectionReference<Shelter>;
    this.retrieveData();
  }

  retrieveData(){
    collectionData(this._sheltersCollection, {'idField': 'id'}).subscribe({
      next: (shelter: Shelter[]) => {
        this._shelters=shelter;
      }
    });
  }
  
  insertData(shelter: Shelter): void {
    addDoc(this._sheltersCollection, shelter).then(
      (doc) => {
        console.log(doc);
      }
    ).catch(
      (error: any) => {
        console.log(error);
      }
    ).finally(() => {});
  }

  getShelters():Shelter[]{
    return this._shelters;
  }

}
