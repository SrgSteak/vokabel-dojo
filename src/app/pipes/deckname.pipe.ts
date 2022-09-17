import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { DeckService } from '../core/services/deck.service';

/**
 * loads the deckname by the id
 */
@Pipe({
  name: 'deckname',
  pure: false,
  standalone: true
})
export class DecknamePipe implements PipeTransform {

  protected transval = null;
  private loading = false;

  constructor(private deckService: DeckService, private ref: ChangeDetectorRef) { }

  transform(value: any, ...args: any[]): any {
    if (!this.transval && !this.loading) {
      this.loading = true;
      this.deckService.getDeck(value).subscribe(deck => {
        this.ref.markForCheck();
        if (deck) {
          this.transval = deck.name;
        } else {
          this.transval = '';
        }
        return this.transval;
      });
    }
    return this.transval;
  }

}
