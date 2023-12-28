import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  transform(value: string | { german: string, highlight: { from: number, to?: number}}, classname?: string): unknown {
    if (typeof value === 'string') {
      return value;
    }
    return `${value.german.slice(0, value.highlight.from)}<span class=${ classname ? classname : 'highlight'}>${value.german.slice(value.highlight.from, value.highlight.to ? value.highlight.to : value.highlight.from + 1)}</span>${value.german.slice(value.highlight.to ? value.highlight.to : value.highlight.from + 1)}`;
  }

}
