import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { CollectionReference, Firestore, addDoc, collection, collectionData, limit, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { getAuth, sendEmailVerification } from "firebase/auth";



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userCollection: CollectionReference<UserModel>;
  isAdmin!:boolean;
  isVolunteer!:boolean;
  isLogged:boolean=false;
  isVerified!:boolean;

  constructor(private _auth: Auth, private _route: Router, private _firestore: Firestore) {
    this._userCollection = collection(this._firestore, 'users') as CollectionReference<UserModel>;
    if(this._auth.currentUser){
      this.checkIsAdmin(this._auth.currentUser.uid);
      this.checkIsVolunteer(this._auth.currentUser?.uid);
    }
  }

  async register(name:string, email: string, passwd: string): Promise<boolean> {
    try {
      let userCredential: UserCredential = await createUserWithEmailAndPassword(this._auth, email, passwd);
      
      if(userCredential){
        const user : UserModel = {'id': this.getUid() || '','name': name, 'email': email, 'role': 'volunteer'}
        addDoc(this._userCollection, user).then(() => {
          const auth = getAuth();
          auth.languageCode = 'Es';
          if(auth.currentUser) sendEmailVerification(auth.currentUser).then(() => window.alert('Siusplau, confirma la teva direcció de gmail abans de prosseguir al login'));
        });
        this._route.navigate(['/login']);
      } 
      return true;
    } catch(error: any) {
      console.log(error);
      return false;
    }
  }

  getUid() { return this._auth.currentUser?.uid }

  async loginWithEmail(email: string, passwd: string): Promise<boolean> {
    try {
      let userCredential: UserCredential = await signInWithEmailAndPassword(this._auth, email, passwd);
      this.isLogged=true;
      if(userCredential.user.emailVerified == true) this.isVerified = true;
      if(userCredential && this.isVerified){
        this._route.navigate(['/home']);
      }else{
        this._route.navigate(['login']); 
        let resend = window.confirm('No esta verificat el gmail encara. Vols reenviar el correu per poder verificarte?');
        if(resend==true){
          const auth = getAuth();
          auth.languageCode = 'Es';
          if(auth.currentUser) sendEmailVerification(auth.currentUser).then(() => window.alert('Correu reenviat satisfactoriament'));
        }
      } 
      return true;
    } catch(error: any) {
      console.log(error);
      return false;
    }
  }

  async loginWithGoogle(): Promise<boolean> {
    try {
      let userCredential = await signInWithPopup(this._auth, new GoogleAuthProvider());
      this.isLogged=true;
      if(userCredential) this._route.navigate(['/home']);
      return true;
    } catch(error: any) {
      console.log(error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      await signOut(this._auth);
      this.isLogged=false;
      this._route.navigate(['/home']);
      return true;
    } catch(error: any) {
      console.log(error);
      return false;
    }
  }

  get currentUser(): User | null {
    return this._auth.currentUser;
  }

  isSessionActive(): boolean {
    return this.currentUser !== null;
  }

  checkIsAdmin(userId: string): boolean{

    const queryRef = query(this._userCollection, where('id', '==', userId), limit(1));

    collectionData(queryRef, {'idField':'id'}).subscribe((user) => {
      if(user[0].role==='admin'){
        this.isAdmin=true;
      }else{
        console.log(user[0].role);
        this.isAdmin= false;
      }
    })
    
    
    return this.isAdmin;
  }

  checkIsVolunteer(userId: string):boolean{

    const queryRef = query(this._userCollection, where('id', '==', userId), limit(1));

    collectionData(queryRef, {'idField':'id'}).subscribe((user) => {
      if(user[0].role==='volunteer'){
        this.isVolunteer=true;
      }else{
        this.isVolunteer= false;
      }
    })
    
    return this.isVolunteer;
  }

  checkIsLogged():boolean{
    return this.isLogged;
  }

  checkIsVerified():boolean{
    return this.isVerified;
  }

}
