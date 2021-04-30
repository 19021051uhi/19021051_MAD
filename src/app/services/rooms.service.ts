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
export class RoomsService {

  private privateRooms: Observable<Room[]>;
  private rooms: Observable<Room[]>;
  private me: Observable<Room[]>;
  private their: Observable<Room[]>;
  private all: Observable<Room[]>;
  private currentUser: Observable<User[]>;
  private username: string;
  private roomsCollection: AngularFirestoreCollection<Room>;
  constructor(
    private af: AngularFirestore
    ) {

    this.roomsCollection = this.af.collection<Room>('room');
    this.rooms = this.roomsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
        });
      })
    );

   }

   getRooms(): Observable<Room[]>{
    return this.rooms;
   }

   getRoom(){
    // return this.roomsCollection.doc<Room>().valueChanges().pipe(
    //   map(room =>{
    //       return room;
    //   })
    // )

    this.rooms = this.af.collection<any>('room', ref => ref.where('type', '==', 'public')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    })))

    return this.rooms;


   }

   getSimpleUsername(){

      return this.username;
   }


   getUsername(email: string){

    this.currentUser = this.af.collection<any>('user', ref => ref.where('email','==',  email)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
      })));

      let counter: number;
      let id = [];
      counter = 0;
      this.currentUser.forEach(element => {
        if(counter == 0){
          this.username = element[0].username;
          counter = counter + 1;
        }
      });
   }

   getUsernameForSearch(): string{
     return this.username;
   }

   getPrivateChats(){



    this.me = this.af.collection<any>('room', ref => ref.where('admin', '==', this.username).where('type', '==', 'private')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    })))

    this.their = this.af.collection<any>('room', ref => ref.where('name', '==', 'amir')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    })))


    let caOrCoCities = combineLatest(this.me, this.their)
    .pipe(
       switchMap(all => {
         const [me, their] = all;
         const combined = me.concat(their);
         return of(combined);
       })
    );


    return caOrCoCities;




  }


}
