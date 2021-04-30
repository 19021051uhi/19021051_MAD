import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthsService } from "../services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { RegistrationService, User } from 'src/app/services/registration.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private registrationService: RegistrationService,
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

  preSignup(email, password, dob, discipline, username){

    let result = this.registrationService.checkIfUsernameExists(email.value, dob.value, discipline.value, username.value);
    result.then(res => {
      if(res){
        this.signUp(email, password)
      }else
      {
        alert('Username already exist!');
      }
    })

  }

  signUp(email, password){
    this.authService.RegisterUser(email.value, password.value)
    .then((res) => {
      this.router.navigate(['login'])
    }).catch((error) => {
      window.alert(error.message)
    })
}
}
