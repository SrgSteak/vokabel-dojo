import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { FLY_IN_OUT_ANIMATION } from '../../core/animations/modal.animation';

@Component({
  selector: 'app-magic-link',
  templateUrl: './magic-link.component.html',
  styleUrls: ['./magic-link.component.scss'],
  animations: [
    FLY_IN_OUT_ANIMATION
  ]
})
export class MagicLinkComponent implements OnInit {
  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  })
  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data.finishMagicLink) {
        this.authService.emailValidateLogin();
      }
    });
  }

  onSubmit() {
    this.authService.emailLogin(this.form.get('email').value, this.form.get('name').value);
    this.form.reset();
    this.close();
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }
}
