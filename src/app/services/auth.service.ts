import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { CollectionReference, Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userCollection: CollectionReference<UserModel>;

  constructor(private _auth: Auth, private _route: Router, private _firestore: Firestore) {
    this._userCollection = collection(this._firestore, 'users') as CollectionReference<UserModel>;

  }

  async register(name:string, email: string, passwd: string): Promise<boolean> {
    try {
      let userCredential: UserCredential = await createUserWithEmailAndPassword(this._auth, email, passwd);
      
      if(userCredential){
        const user : UserModel = {'id': this.getUid() || '','name': name, 'email': email, 'role': 'volunteer'}
        addDoc(this._userCollection, user);
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
      if(userCredential) this._route.navigate(['/home']);
      return true;
    } catch(error: any) {
      console.log(error);
      return false;
    }
  }

  async loginWithGoogle(): Promise<boolean> {
    try {
      let userCredential = await signInWithPopup(this._auth, new GoogleAuthProvider());
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
  return this.currentUser != null;
  }
}
