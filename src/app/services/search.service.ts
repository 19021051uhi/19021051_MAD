import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore'
import { map, tap, switchMap } from 'rxjs/operators'
import { Observable, observable, combineLatest, of } from 'rxjs'

export interface Room {
  id?: string,
  admin: string,
  datecreated: string,
  name: string,
  type: string

}


export interface User {
  id?: string,
  datejoined: string,
  discipline: string,
  dob: string,
  email: string,
  role: string,
  username: string

}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private users: Observable<User[]>;
  private all: Observable<Room[]>;
  private usersCollection: AngularFirestoreCollection<User>;
  constructor(
    private af: AngularFirestore
    ) {

    this.usersCollection = this.af.collection<User>('user');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
        });
      })
    );

   }


   getUsers(username: string){

    this.users = this.af.collection<any>('user', ref => ref.where('username', '==', username)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    })))

    return this.users;


   }



}
