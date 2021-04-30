import { Inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore'
import { map, retryWhen, take } from 'rxjs/operators'
import { Observable, observable, combineLatest } from 'rxjs'
import { element } from 'protractor';
import { Router } from "@angular/router";
import * as moment from 'moment';


export interface Chat {
  id?: string,
  userid: string,
  mediaid: string,
  roomid: string,
  type: string,
  dateposted: string,
  message: string

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


export interface Media {
  id?: string,
  datecreated: string,
  type: string,
  url: string,
  userid: string

}

export interface Room {
  id?: string,
  admin: string,
  datecreated: string,
  name: string,
  type: string

}



@Injectable({
  providedIn: 'root'
})
export class RoomchatService {

  private chats: Observable<Chat[]>;
  private users: Observable<User[]>;
  private media: Observable<Media[]>;
  private rooms: Observable<Media[]>;
  private all: Observable<{ user: User[], chat: Chat[], media: Media[] }>

  private chatsCollection: AngularFirestoreCollection<Chat>;
  private userCollection: AngularFirestoreCollection<User>;
  private mediaCollection: AngularFirestoreCollection<Media>;
  private currentMillis: string;
  private currentUser: Observable<User[]>;

  constructor(
    private af: AngularFirestore,
    public router: Router
    ) {
    this.chatsCollection = this.af.collection<Chat>('chat');
    this.userCollection = this.af.collection<User>('user');
    this.mediaCollection = this.af.collection<Media>('media');
    this.chats = this.chatsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
        });
      })
    );
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
        });
      })
    );

    this.media = this.mediaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data}
        });
      })
    );


   }

    getChats() {
          this.chats = this.af.collection<Chat>('chat', ref => ref.where('roomid','==', 'Hu31BkitmGtQKyinhFnC' )).valueChanges()

          return this.chats;
    };

    getAll(roomid: string){

      this.users = this.af.collection<any>('user').snapshotChanges().pipe(
                map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
            })))


      this.chats = this.af.collection<any>('chat', ref => ref.where('roomid','==', roomid ).orderBy('dateposted','asc')).snapshotChanges().pipe(
              map(actions => actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            })))

      this.media = this.af.collection<any>('media').snapshotChanges().pipe(
              map(actions => actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            })))

      this.all = combineLatest(
        this.users,
        this.chats,
        this.media
      ).pipe(
        map(([user, chat, media]) => {

          return { user, chat, media }
        })
      )
      return this.all;
    }


   getRooms(): Observable<Chat[]>{
    return this.chats;
   }

   getRoom(): Observable<Chat>{
    return this.chatsCollection.doc<Chat>().valueChanges().pipe(
      map(room =>{
          return room;
      })
    )

   }



   postToRoom(email: string, roomid: string, message: string, type: string): void {

    console.log('OOOOOOOOOOOOOOOOOOOOOOO ' + email + " / " + roomid + " / " + message)
    this.currentUser = this.af.collection<any>('user', ref => ref.where('email','==',  email)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
      })));

    let counter: number;
    counter = 0;
    this.currentUser.forEach(element => {
      if(counter == 0){
        console.log('wwwwwwwwwwwwwwwwwwwwww  ' + element[0].id + " / " + roomid + " / " + message)
        this.doTheRest(roomid, element[0].id, message, type);
        counter = counter + 1;
      }
    });

  }

  getUserPrivateRoom(){

    return this.all
  }

  doTheRest(roomid: string, id: string, message: string, type: string){

    console.log('attempting post')
    this.af.collection('chat').add({
      dateposted: new Date().valueOf(),
      mediaid: '',
      type: type,
      userid: id,
      roomid: roomid,
      message: message

    }).then((doc) => {
      console.log(doc);
    }).catch((err) => {
      console.log(err)
    })

  }


  getRoomCollectionID(username: string, target: string): Promise<string>{

    return new Promise<string>(resolve => {
      console.log('-----------------> ' + username, " / " + target)

      this.rooms = this.af.collection<any>('room', ref => ref.where('admin','==', username).where('name','==', target).where('type','==', 'private')).snapshotChanges().pipe(
        map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })))

      let counter: number;
      counter = 0;
      this.rooms.forEach(element => {
        if(counter == 0){
          if(element[0] != undefined){
            console.log('JJJJJJJJJJJJJJJJJJJJJJ ' + element[0].id)
            this.getAll(element[0].id)
            resolve(element[0].id)
          }else{
            console.log('KKKKKKKKKKKKKKKKKKKKK ' + element[0])
            this.createPrivateRoom(username, target)
          }
          counter = counter + 1;
        }
      });

    })

  }


   createPrivateRoom(admin, target){

      console.log('===========> ' + admin + " / " + target)
      console.log('attempting post')
      this.af.collection('room').add({
        datecreated: new Date().valueOf(),
        admin: admin,
        name: target,
        type: 'private'

      }).then((doc) => {
        this.router.navigate(['chats', {roomid: doc.id}])
        console.log(doc);
      }).catch((err) => {
        window.alert(err.message)

      })

   }


}
