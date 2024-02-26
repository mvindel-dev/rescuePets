import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'A2P2RescuePetsWebProject';
  loginOrRegister!: boolean;

  constructor(private _router:Router){
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event : any) => {
      const url = event['url'];

      if(!url || url === '/login' || url === '/register') this.loginOrRegister = true 
      else this.loginOrRegister=false
    });

  }

}
