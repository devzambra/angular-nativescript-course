import { AuthService } from './auth.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TextField } from 'tns-core-modules/ui/text-field';

@Component({
  selector: 'ns-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  moduleId: module.id,
})
export class AuthComponent implements OnInit {

    @ViewChild('emailRef') emailRef: ElementRef<TextField>;
    @ViewChild('passwordRef') passwordRef: ElementRef<TextField>;

    form: FormGroup;
    emailControlIsValid = true;
    passwordControlIsValid = true;

    isLogin = true;
    isLoading = false;

  constructor(private router: RouterExtensions, private auth: AuthService) { }

  ngOnInit() {
      this.form = new FormGroup({
          email: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.email]}),
          password: new FormControl(null, {updateOn: 'blur', validators: [Validators.required, Validators.min(6)]})
      });

      this.form.get('email').statusChanges.subscribe(status => {
          this.emailControlIsValid = status === 'VALID';
      });
      this.form.get('password').statusChanges.subscribe(status => {
        this.passwordControlIsValid = status === 'VALID';
    });
  }

  onSubmit() {
    this.onDone();


    if(this.form.valid) {
        const email = this.form.get('email').value;
        const pass = this.form.get('password').value;

        this.form.reset();

        this.emailControlIsValid = true;
        this.passwordControlIsValid = true;
        this.isLoading = true;
        if(this.isLogin) {
            this.auth.login(email, pass).subscribe(res => {
                this.isLoading = false;
                this.router.navigate(['/challenges'], {clearHistory: true});
            }, err => {
                this.isLoading = false;
            });
        } else {
            this.auth.signUp(email, pass).subscribe(res => {
                this.isLoading = false;
                this.router.navigate(['/challenges'], {clearHistory: true});
            }, err => {
                this.isLoading = false;
            });
        }
    }


  }

  onDone() {
    this.emailRef.nativeElement.focus();
    this.passwordRef.nativeElement.focus();
    this.passwordRef.nativeElement.dismissSoftInput();
  }

  onSwitch() {
      this.isLogin = !this.isLogin;
  }
}
