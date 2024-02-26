import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ReserveAnimal } from 'src/app/models/reserve/reserve-animal';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  private _hores: ReserveAnimal[] = [];
  private _reserveAnimal: CollectionReference<ReserveAnimal>;

  constructor(private _firestore: Firestore) { 
    this._reserveAnimal = collection(this._firestore, 'reserves') as CollectionReference<ReserveAnimal>;
    this.retrieveReserves();
  }

  retrieveReserves(){
    collectionData(this._reserveAnimal, {'idField': 'reserva_id'}).subscribe({
      next: (reservedHours: ReserveAnimal[]) => {
        this._hores = reservedHours;
      }
    })
  }

  getHours(): ReserveAnimal[]{
    return this._hores;
  }
}
