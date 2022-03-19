import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-kanji',
  templateUrl: './kanji.component.html',
  styleUrls: ['./kanji.component.scss'],
})
export class KanjiComponent implements OnInit, OnChanges, OnDestroy {
  @Input() strokeNumber: boolean = true;
  @Input() hideGrid: boolean = false;
  @Input() draw: boolean;
  @Input() character: string;
  @ViewChild('handle') private handle: ElementRef;

  private intervalHandle;
  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private httpClient: HttpClient
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.draw?.currentValue !== changes.draw?.previousValue) {
      this.drawLines();
    }
    if (changes.character?.currentValue !== changes.character?.previousValue) {
      this.loadSVG(changes.character.currentValue);
    }
    if (
      changes.strokeNumber?.currentValue !== changes.strokeNumber?.previousValue
    ) {
      if (changes.strokeNumber.currentValue) {
        this.drawNumbers();
      } else {
        this.removeNumbers();
      }
    }
  }

  ngOnInit() {
    if (this.character) {
      this.loadSVG(this.character);
    }
  }

  ngOnDestroy() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
  }

  private loadSVG(character: string) {
    this.httpClient
      .get(`./assets/kanji/0${character.codePointAt(0).toString(16)}.svg`, {
        headers: { Accept: 'image/svg+xml' },
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          this.prepareSVG(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  private prepareSVG(svg: string) {
    const svgRegex = /\<svg.*\>(.|\n)*\<\/svg\>/; // fetch the <svg> and skip the header
    this.handle.nativeElement.innerHTML = svg.match(svgRegex)[0];
    const paths = this.elRef.nativeElement.getElementsByTagName('path');
    for (let i = 0; i < paths.length; i++) {
      this.renderer.setAttribute(paths[i], 'pathLength', '1');
      this.renderer.addClass(paths[i], 'visible');
    }
  }

  public drawLines() {
    this.removeLines();
    this.removeNumbers();
    const paths = this.getPaths();
    if (paths.length) {
      let index = 0;
      this.intervalHandle = setInterval(() => {
        if (index >= paths.length) {
          clearTimeout(this.intervalHandle);
          this.drawNumbers();
        } else {
          this.renderer.addClass(paths[index], 'visible');
          index++;
        }
      }, 800);
    }
  }

  protected removeLines() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
    const paths = this.getPaths();
    for (let i = 0; i < paths.length; i++) {
      this.renderer.removeClass(paths[i], 'visible');
    }
  }

  protected drawNumbers() {
    const texts = this.elRef.nativeElement.getElementsByTagName('text');
    for (let i = 0; i < texts.length; i++) {
      this.renderer.removeClass(texts[i], 'hidden');
    }
  }

  protected removeNumbers() {
    const texts = this.elRef.nativeElement.getElementsByTagName('text');
    for (let i = 0; i < texts.length; i++) {
      this.renderer.addClass(texts[i], 'hidden');
    }
  }

  protected getPaths() {
    return this.elRef.nativeElement.getElementsByTagName('path');
  }
}
