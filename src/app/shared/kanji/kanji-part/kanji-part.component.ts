import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-kanji-part',
  templateUrl: './kanji-part.component.html',
  styleUrls: ['./kanji-part.component.scss']
})
export class KanjiPartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() strokeNumber: number = 0;
  @Input() showNumbers = false;
  @Input() svg: string;
  @ViewChild('handle') private handle: ElementRef;

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.strokeNumber?.currentValue !== changes.strokeNumber?.previousValue) {
      this.drawLines();
    }
    if (changes.svg?.currentValue !== changes.svg?.previousValue) {
      this.drawLines();
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.prepareSVG(this.svg);
  }

  ngOnDestroy() {
  }

  private prepareSVG(svg: string) {
    this.handle.nativeElement.innerHTML = svg;
    const paths = this.elRef.nativeElement.getElementsByTagName('path');
    for (let i = 0; i < paths.length; i++) {
      this.renderer.setAttribute(paths[i], 'pathLength', '1');
    }
    this.drawLines();
    if (!this.showNumbers) {
      this.removeNumbers();
    }
  }

  public drawLines() {
    const paths = this.getPaths();
    if (paths.length) {
      let index = 0;
      while (index < this.strokeNumber) {
        this.renderer.addClass(paths[index], 'visible');
        index++;
      }
      this.drawNumbers();
    }
  }

  protected removeLines() {
    const paths = this.getPaths();
    for (let i = 0; i < paths.length; i++) {
      this.renderer.removeClass(paths[i], 'visible');
    }
  }

  protected drawNumbers() {
    const texts = this.elRef.nativeElement.getElementsByTagName('text');
    for (let i = 0; i < this.strokeNumber; i++) {
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
