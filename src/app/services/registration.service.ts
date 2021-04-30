import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore'
import { map, take } from 'rxjs/operators'
import { Observable, observable } from 'rxjs'
import { element, promise } from 'protractor';
import { Router } from "@angular/router";

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
export class RegistrationService {

  private users: Observable<User[]>;
  private user: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;
  constructor(
    private af: AngularFirestore,
    public router: Router
    ) {

    this.userCollection = this.af.collection<User>('user');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
        });
      })
    );

   }


   checkIfUsernameExists(email, dob, discipline, username): Promise<boolean>{

    return new Promise(resolve => {

      this.user = this.af.collection<any>('user', ref => ref.where('username','==', username )).snapshotChanges().pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })))

      let id =[];
      let counter: number;
      counter = 0;
      this.user.forEach(element => {
        if(element[0] == undefined){
          this.doRegistration(email, dob, discipline, username)
          resolve(true)
        }else{
          if(counter == 0){
            id.push(element[0].id);
            if(id[0] == undefined){
              counter = counter + 1;
              this.doRegistration(email, dob, discipline, username)
              resolve(true)

            }else{
              counter = counter + 1;
              resolve(false)

            }
          }
        }
      });

    });


   }



   doRegistration(email, dob, discipline, username){


      console.log('attempting post')
      this.af.collection('user').add({
        datejoined: new Date().valueOf(),
        discipline: discipline,
        dob: dob,
        email: email,
        role: 'user',
        username: username

      }).then((doc) => {
        this.router.navigate(['login'])
        console.log(doc);
      }).catch((err) => {
        window.alert(err.message)

      })

   }

   getRooms(): Observable<User[]>{
    return this.users;
   }

   getRoom(): Observable<User>{
    return this.userCollection.doc<User>().valueChanges().pipe(
      map(user =>{
          return user;
      })
    )

   }
}
