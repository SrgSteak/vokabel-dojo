import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-kanji-parts',
  templateUrl: './kanji-parts.component.html',
  styleUrls: ['./kanji-parts.component.scss']
})
export class KanjiPartsComponent implements OnInit {

  @Input() character: string;
  svg: string; // the svg content
  paths;
  placeholders = [];

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.character?.currentValue !== changes.character?.previousValue) {
      this.loadSVG(changes.character.currentValue);
    }
  }

  ngOnInit() {
    if (this.character) {
      this.loadSVG(this.character);
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
    this.svg = svg.match(svgRegex)[0];
    const allPathsRegex = /\<path/g; // fetch all (/g) <path> items. Used to know how many strokes are in the kanji
    this.paths = svg.match(allPathsRegex);
    this.placeholders = [];
    for (let i = 0; i < (24 - this.paths.length); i++) {
      this.placeholders.push(i);
    }
  }
}
