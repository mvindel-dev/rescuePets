import { Injectable } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Animal } from 'src/app/models/animal/animal';
import { ReserveAnimal } from 'src/app/models/reserve/reserve-animal';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  private _hores: ReserveAnimal[] = [];
  private _reserveAnimal: CollectionReference<ReserveAnimal>;

  constructor(private _firestore: Firestore, private _authService:AuthService) { 
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

  reserve(volunteerId:string, animal:Animal, day:string, hour:number): boolean{
    let user_id= this._authService.currentUser?.uid;
    if(user_id){
      let isAdmin = this._authService.checkIsAdmin(user_id);
      let isVolunteer = this._authService.checkIsVolunteer(user_id);
      if(isAdmin || isVolunteer){
        let reservedDate : ReserveAnimal = {
          reserva_id : this.generarStringAleatorio(),
          volunteer_id : volunteerId,
          animal_id : animal.id,
          day : day,
          hour : hour,
        }
    
        addDoc(this._reserveAnimal, reservedDate),
        this.retrieveReserves();
        return true;
      }
    }

    return false;
    
  }





  generarStringAleatorio(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < 12; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return resultado;
  }
}
