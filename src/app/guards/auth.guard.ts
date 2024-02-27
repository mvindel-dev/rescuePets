import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authSessionService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if(route.url[0].path == "login" || route.url[0].path == "register"){
    if(authSessionService.isSessionActive()){
      router.navigate(["/home"]);
      return false;
    }else{
      return true;
    }
  }else if(route.url[0].path == "home" || route.url[0].path == "logout"){
    if(!authSessionService.isSessionActive()){
      router.navigate(["/login"]);
      return false;
    }else{
      return true;
    }
  }else if(route.url[0].path == "cats" || route.url[0].path == "dogs" || (route.url[0].path == "pet" && route.url[1].path == "cat" || "dog")) {
    if(authSessionService.isSessionActive()){
      return true;
    } else {
      router.navigate(["/login"]);
      return false;
    }
  }else if(route.url[0].path == "editAnimal" || route.url[0].path == "addAnimal" || route.url[0].path == "timetable") {
    if(authSessionService.isSessionActive()){
      return true;
    } else {
      router.navigate(["/home"]);
      return false;
    }
  }


  return false;

};
