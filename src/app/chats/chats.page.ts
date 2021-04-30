import { Component} from '@angular/core';
import { Observable } from 'rxjs';
import { RoomsService, Room } from 'src/app/services/rooms.service'
import { AuthsService } from "../services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from "@angular/router";
import { MenuController } from '@ionic/angular'


@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss'],
})
export class ChatsPage {

  rooms: Observable<Room[]>;
  refresh: string;
  myCookie: string;
  username: string;
  roomId: string;

  room: Room = {
      id: '',
      admin: '',
      datecreated: '',
      name: '',
      type:''
  };

  constructor(
    private roomService: RoomsService,
    public authService: AuthsService,
    public router: Router,
    private route: ActivatedRoute,
    public menuCtrl: MenuController

    ) {

      this.myCookie = Cookie.get('challegeuser');
      if(this.myCookie == null || this.myCookie == ''){
        this.router.navigate(['login']);
      }

      this.roomId = this.route.snapshot.paramMap.get('roomid');

      if(this.roomId != undefined){

        this.goRoom(this.roomId);
      }
    }

    toggleMenu() {
      this.menuCtrl.close;
    }

    ngOnInit() {

     this.roomService.getUsername(this.myCookie);

     setTimeout(() => {

      this.rooms =  this.roomService.getPrivateChats();
      this.username = this.roomService.getSimpleUsername();

    }, 1500);

    }

    goRoom(id: string){
      console.log('88888888888888888888888888 ' + id)
      this.router.navigate(['room', {roomid: id}]);
    }
}
