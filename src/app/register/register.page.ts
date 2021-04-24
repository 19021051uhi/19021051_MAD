import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthsService } from "../services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    public authService: AuthsService,
    public router: Router
  ) {
    let myCookie = Cookie.get('challegeuser');
    if(myCookie != null && myCookie != ''){
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
  }
  signUp(email, password){
    this.authService.RegisterUser(email.value, password.value)
    .then((res) => {
      // Do something here
      // this.authService.SendVerificationMail()
      this.router.navigate(['login']);

    }).catch((error) => {
      window.alert(error.message)
    })
}
}
