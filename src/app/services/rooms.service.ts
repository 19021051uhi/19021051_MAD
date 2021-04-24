import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore'
import { map, take } from 'rxjs/operators'
import { Observable, observable } from 'rxjs'

export interface Room {
  id?: string,
  admin: string,
  datecreated: string,
  name: string

}

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  private rooms: Observable<Room[]>;
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

   getRoom(): Observable<Room>{
    return this.roomsCollection.doc<Room>().valueChanges().pipe(
      map(room =>{
          console.log("--->" + room)
          return room;
      })
    )

   }
}
