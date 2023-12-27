import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appTextSelection]',
  standalone: true
})
export class TextSelectionDirective {

  @Output('onTextSelectionChange') public onTextSelectionChange: EventEmitter<{from: number, to: number}> = new EventEmitter();

  constructor(private host: ElementRef<HTMLInputElement>) { }

  ngOnInit() {
    console.log(this.host);
    // this.host.nativeElement.onselect = this.onSelectionChange();
  }

  private onSelectionChange($event?: Event) {
    console.log('directive event:', ($event?.target as HTMLInputElement).selectionStart);
    console.log(this.onTextSelectionChange);
    // if (($event.target as HTMLInputElement).selectionStart !== 0 && ($event.target as HTMLInputElement).selectionEnd !== 0) {
    //   this.onTextSelectionChange.emit({from: ($event.target as HTMLInputElement).selectionStart, to: ($event.target as HTMLInputElement).selectionEnd});
    // }
  }
}
