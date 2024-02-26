import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Animal } from 'src/app/models/animal/animal';
import { AnimalsService } from 'src/app/services/Animals/animals.service';
import { PetService } from 'src/app/services/Pets/pet.service';
import { VolunteerService } from 'src/app/services/Volunteer/volunteer.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})

export class TimetableComponent implements OnInit{

  horas: { hora: number, reservado: boolean }[] = [];
  
  today: Date = new Date();
  tomorrow: Date = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
  pastTomorrow: Date = new Date(this.today.getTime() + 2 * 24 * 60 * 60 * 1000);

  selectedButton: string = 'today';
  selectedPet: Animal | null = null;


  constructor(private route: ActivatedRoute, private _volunteer: VolunteerService, private _animalsService: AnimalsService, private _petService: PetService) {
    this._volunteer.getHours();
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
    let selectedDate: Date;

    if (this.selectedButton === 'today') {
      selectedDate = this.today;
    } else if (this.selectedButton === 'tomorrow') {
      selectedDate = this.tomorrow;
    } else {
      selectedDate = this.pastTomorrow;
    }

    this.horas = [];
    for (let i = 9; i <= 17; i++) {
      this.horas.push({ hora: i, reservado: this.isHourReserved(selectedDate, i) });
    }
  }

  isHourReserved(date: Date, hour: number): boolean {
    if (this.selectedButton === 'tomorrow' && date.getDate() === this.tomorrow.getDate()) {
      if (hour === 10 || hour === 11) {
        return true;
      }
    }
    
    if (this.selectedButton === 'pastTomorrow' && date.getDate() === this.pastTomorrow.getDate()) {
      if (hour === 13) {
        return true;
      }
    }
  
    return false;
  }


}
