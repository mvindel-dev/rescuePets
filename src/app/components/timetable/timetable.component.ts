import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Animal } from 'src/app/models/animal/animal';
import { ReserveAnimal } from 'src/app/models/reserve/reserve-animal';
import { AnimalsService } from 'src/app/services/Animals/animals.service';
import { PetService } from 'src/app/services/Pets/pet.service';
import { VolunteerService } from 'src/app/services/Volunteer/volunteer.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})

export class TimetableComponent implements OnInit{

  reservedHours: ReserveAnimal[] = [];
  horas: { hora: number, reservado: boolean }[] = [];
  selectedDate!:Date;
  
  today: Date = new Date();
  tomorrow: Date = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
  pastTomorrow: Date = new Date(this.today.getTime() + 2 * 24 * 60 * 60 * 1000);

  selectedButton: string = 'today';
  selectedPet: Animal | null = null;


  constructor(private route: ActivatedRoute, private _volunteer: VolunteerService, private _animalsService: AnimalsService, private _petService: PetService, private _authService:AuthService,  private _router:Router) {
    this._volunteer.retrieveReserves();
    this.reservedHours = this._volunteer.getHours();
    this.updateHours();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const name = params['name'];
      this.selectedPet = this._animalsService.getAnimalByName(name) || null;
      this._petService.selectPet(this.selectedPet);
    });
  }

  updateHours() {
    

    if (this.selectedButton === 'today') {
      this.selectedDate = this.today;
    } else if (this.selectedButton === 'tomorrow') {
      this.selectedDate = this.tomorrow;
    } else {
      this.selectedDate = this.pastTomorrow;
    }

    this.horas = [];
    for (let i = 9; i <= 17; i++) {
      this.horas.push({ hora: i, reservado: this.isHourReserved(this.selectedDate.toLocaleDateString(), i) });
    }
  }

  isHourReserved(date: string, hour: number): boolean {

    for (let i = 0; i < this.reservedHours.length; i++) { 
      const reservation = this.reservedHours[i];
      if (reservation.day === date && reservation.hour === hour && this.selectedPet?.id === reservation.animal_id) {  
        return true;
      }
  }

    return false; 
  }

  reserveHour(hora:any){
    if(this._authService.currentUser?.uid && this.selectedPet?.id){
      let isDone = this._volunteer.reserve(this._authService.currentUser?.uid, this.selectedPet, this.selectedDate.toLocaleDateString(), hora.hora);
      if(isDone) this._router.navigate(['/pet/'+this.selectedPet.name]);
    }
  }

  getHoras(){
    this.updateHours();
    return this.horas;
  }


}
