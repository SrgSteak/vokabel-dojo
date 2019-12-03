import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FontSwitcherService } from '../../services/font-switcher.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-font-switcher',
  templateUrl: './font-switcher.component.html',
  styleUrls: ['./font-switcher.component.css']
})
export class FontSwitcherComponent implements OnInit, OnDestroy {

  modeForm = new FormGroup({
    fontMode: new FormControl(this.fontSwitcher.currentStyle)
  });
  private updateSub: Subscription;
  private formSub: Subscription;

  get fontMode() {
    return this.modeForm.get('fontMode');
  }

  constructor(private fontSwitcher: FontSwitcherService) { }

  ngOnInit() {
    // do stuff on form changes (update style)
    this.formSub = this.modeForm.valueChanges.subscribe(() => {
      this.fontSwitcher.updateFontStyle(this.fontMode.value, true);
    })
    // do stuff if programmatically style changes in service
    this.updateSub = this.fontSwitcher.onChange.subscribe((style: string) => {
      this.fontMode.setValue(style);
    });
  }

  ngOnDestroy() {
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }
}
