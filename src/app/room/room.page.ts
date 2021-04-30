import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomchatService, Chat, User, Media } from 'src/app/services/roomchat.service'
import { AuthsService } from "../services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from "@angular/router";
import { IonContent } from '@ionic/angular';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-room',
  templateUrl: 'room.page.html',
  styleUrls: ['room.page.scss'],
})
export class RoomPage {

  chats: Observable<Chat[]>;
  myCookie: string;
  all: Observable<{ user: User[], chat: Chat[], media: Media[] }>
  refresh: string;
  roomid: string;
  username: string;
  target: string;
  myVal: any = "";
  myVal1: any = "";


  room: Chat = {

    id: '',
    userid: '',
    mediaid: '',
    roomid: '',
    type: '',
    dateposted: '',
    message: ''
  };

  user: User = {
    id: '',
    datejoined: '',
    discipline: '',
    dob: '',
    email: '',
    role: '',
    username: ''

  }

  media: Media = {
    id: '',
    datecreated: '',
    type: '',
    url: '',
    userid: ''

  }
  @ViewChild('content', { static: true }) content: any;
  constructor(
    private roomChatService: RoomchatService,
    public authService: AuthsService,
    public router: Router,
    private route: ActivatedRoute,

    ) {

      this.myCookie = Cookie.get('challegeuser');
      if(this.myCookie == null || this.myCookie == ''){
        this.router.navigate(['login']);
      }
      this.roomid = this.route.snapshot.paramMap.get('roomid');
      this.username = this.route.snapshot.paramMap.get('username');
      this.target = this.route.snapshot.paramMap.get('target');

      console.log('^^^^^^^^^^^^^^^^^ => ' + this.roomid + " / " + this.username + " / " + this.target)
      if(this.roomid != null){
        this.all = this.roomChatService.getAll(this.roomid);

      }else if(this.username != null && this.target != null){
          let id = this.roomChatService.getRoomCollectionID(this.username, this.target);
          id.then(res =>{

            this.roomid = res;

          })
         setTimeout(() => {
          this.all = this.roomChatService.getUserPrivateRoom()
          }, 1500)
      }

      this.scrollToBottom();


    }

    ngOnInit() {

    }

    ngAfterContentInit() {
      if (this.all) {
        this.all.subscribe(element =>{

          this.scrollToBottomQuicker();
        })

      }
    }


    scrollToBottom() {
      setTimeout(() => {
        this.content.scrollToBottom(1500);
      }, 1500);
    }
    scrollToBottomQuicker() {
      setTimeout(() => {
        this.content.scrollToBottom(1500);
      }, 100);
    }

    postMessage(formValue:any){
      if(this.target != null){
        this.roomChatService.postToRoom(this.myCookie, this.roomid, this.myVal, 'private');

      }else{
        this.roomChatService.postToRoom(this.myCookie, this.roomid, this.myVal, 'public');
      }
      this.scrollToBottomQuicker();
    }
}
