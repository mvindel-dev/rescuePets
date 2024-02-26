import { Component, OnInit } from '@angular/core';
import { Shelter } from 'src/app/models/shelter/shelter';
import { ShelterService } from 'src/app/services/Shelter/shelter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public shelters: Shelter[] = [];

  constructor(private _shelter: ShelterService) { }

  ngOnInit(): void {
    this._shelter.retrieveData();
  }

  getShelters(){
    return this._shelter.getShelters();
  }

}
