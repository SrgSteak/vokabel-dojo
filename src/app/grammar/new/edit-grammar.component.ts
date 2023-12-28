import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FLY_IN_OUT_ANIMATION, ROLL_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { Router, RouterModule } from '@angular/router';
import { IconsModule } from 'src/app/shared/card-info/icons.module';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DescriptionType } from 'src/app/core/entities/DescriptionType';
import { GrammarService } from 'src/app/core/grammar.service';
import { GrammarInterface } from 'src/app/core/entities/grammar';
import { TextSelectionDirective } from 'src/app/directives/text-selection.directive';

@Component({
  selector: 'app-edit-grammar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconsModule, ReactiveFormsModule, TextSelectionDirective],
  templateUrl: './edit-grammar.component.html',
  styleUrls: ['./edit-grammar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    FLY_IN_OUT_ANIMATION,
    ROLL_IN_OUT_ANIMATION
  ]
})
export class EditGrammarComponent implements OnInit {

  @HostBinding('@flyInOutTrigger') flyInOutTrigger = 'in';

  grammarForm = this.fb.group({
    uid: [''],
    slug: [''],
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: this.fb.array([]),
    sections: this.fb.array([])
  })

  toggleDescriptionAtIndex: number;
  selection: {from: number, to: number};

  constructor(
    protected fb: FormBuilder,
    protected grammarService: GrammarService,
    protected router: Router,
    @Inject(DOCUMENT) protected document: Document
  ) { }

  get descriptions() {
    return (this.grammarForm.get('description') as FormArray<FormGroup<{type: FormControl<DescriptionType>, text: FormControl<string>}>>).controls;
  }

  get sections() {
    return (this.grammarForm.get('sections') as FormArray<FormGroup<{
      explanation: FormControl<string>,
      grammarpoints: FormArray<FormGroup<{
        text: FormControl<string>,
        highlight: FormGroup<{ from: FormControl<number>, to: FormControl<number>}>,
        strikethrough: FormGroup<{ from: FormControl<number>, to: FormControl<number>}>,
        placeholders: FormArray<FormGroup<{
          japanese: FormControl<string>,
          reading: FormControl
        }>>
      }>>
    }>>).controls;
  }

  ngOnInit(): void {
    this.addDescription();
    this.addSection();
    this.grammarForm.valueChanges.subscribe(() => {
      this.toggleDescriptionAtIndex = null;
    })
  }

  protected onSubmit() {
    console.log(this.grammarForm.value);
      this.grammarService.write(this.grammarForm.value as GrammarInterface).then((reference) => {
        this.router.navigate(['/grammar', { outlets: { primary: [reference.slug], modal: null} }]);
      })
    // TODO: save and load me from service
  }

  // protected memorizeSelection($event: {from: number, to: number}) {
  //   this.selection = $event;
  //   console.log(this.selection);
  // }

  // protected aaaa($event) {
  //   console.log(($event.target as HTMLInputElement).selectionStart);
  // }

  protected toggleDescription(index: number) {
    if (this.toggleDescriptionAtIndex === index) {
      this.toggleDescriptionAtIndex = null;
    } else {
      this.toggleDescriptionAtIndex = index;
    }
  }

  protected addDescription(data: Array<{ type: DescriptionType, text: string}> = [{ type: DescriptionType.paragraph, text: ''}]) {
      data.forEach(d => {
        const newGroup = this.fb.group({
          type: [d.type.toString()],
          text: [d.text, [Validators.required, Validators.minLength(1)]]
        });
        newGroup.setValue({ type: d.type.toString(), text: d.text});
        (this.grammarForm.get('description') as FormArray).push(newGroup);
        newGroup.updateValueAndValidity();
      });
  }

  protected removeDescription(i: number) {
    (this.grammarForm.get('description') as FormArray).removeAt(i);
  }

  protected addSection(data: Array<{
    explanation: string,
    grammarpoints: Array<{
      text: string,
      highlight: { from: number, to: number},
      strikethrough: { from: number, to: number},
      placeholders: Array<{ japanese: string, reading: string}>
    }>
  }> = [{explanation: '', grammarpoints: [{text: '', highlight: { from: 0, to: 0}, strikethrough: { from: 0, to: 0}, placeholders: [{ japanese: '', reading: ''}]}]}]) {
    data.forEach(section => {
      const grammarpointArray: FormArray<FormGroup<{
        text: FormControl<string>,
        highlight: FormGroup<{ from: FormControl<number>, to: FormControl<number>}>,
        strikethrough: FormGroup<{ from: FormControl<number>, to: FormControl<number>}>
        placeholders: FormArray<FormGroup<{ japanese: FormControl<string>, reading: FormControl<string>}>>
        }>> = this.fb.array([]) as FormArray;
      section.grammarpoints.forEach(d => {
        const placeholderArray: FormArray<FormGroup<{ japanese: FormControl<string>, reading: FormControl<string>}>> = this.fb.array([]) as FormArray;
        d.placeholders.forEach(element => {
          placeholderArray.push(this.fb.group({
            japanese: [element.japanese, [Validators.required]],
            reading: [element.reading]
          }));
        });

        const newGroup = this.fb.group({
          text: [d.text],
          highlight: this.fb.group({ from: d.highlight.from, to: d.highlight.to}),
          strikethrough: this.fb.group({ from: d.highlight.from, to: d.highlight.to}),
          placeholders: placeholderArray
        }) as FormGroup;
        grammarpointArray.push(newGroup);
      })

      const sectionGroup = this.fb.group({
        explanation: ['', [Validators.required]],
        grammarpoints: grammarpointArray
      });
      (this.grammarForm.get('sections') as FormArray).push(sectionGroup);
    })
  }

  protected removeSection(i: number) {
    (this.grammarForm.get('sections') as FormArray).removeAt(i);
  }

  protected setRangeOption(sectionIndex: number, grammarpointIndex: number, option: string) {
    const range = this.getGrammarpointFor(sectionIndex)[grammarpointIndex].get(option) as FormGroup;
    if (this.selection) {
      range.get('from').setValue(this.selection.from)
      range.get('to').setValue(this.selection.to)
      // console.log(selection.anchorOffset, selection.focusOffset);
      console.log(range);
      this.selection = null;
    }
  }

  // ---- Grammarpoints ----
  protected getGrammarpointFor(index: number): AbstractControl<any, any>[] {
    return (this.sections[index].get('grammarpoints') as FormArray).controls;
  }

  protected addGrammarpoint(sectionIndex: number) {
    (this.sections[sectionIndex].get('grammarpoints') as FormArray).push(this.fb.group({
        text: [''],
        highlight: this.fb.group({ from: 0, to: 0}),
        strikethrough: this.fb.group({ from: 0, to: 0}),
        placeholders: this.fb.array([])
    }));
  }

  protected removeGrammarpoint(sectionIndex: number, grammarpointIndex: number) {
   (this.sections[sectionIndex].get('grammarpoints') as FormArray).removeAt(grammarpointIndex);
  }

  // ---- Placeholders ----
  protected getPlaceholderForGrammarpoint(sectionIndex: number, grammarpointIndex: number) {
    return ((this.sections[sectionIndex].get('grammarpoints') as FormArray).controls[grammarpointIndex].get('placeholders') as FormArray).controls;
  }

  protected addToGrammarpoint(sectionIndex: number, grammarpointIndex: number) {
    ((this.sections[sectionIndex].get('grammarpoints') as FormArray).controls[grammarpointIndex].get('placeholders') as FormArray).push(this.fb.group({
      japanese: ['', [Validators.required]],
      reading: ['']
    }));
  }

  protected removeFromGrammarpoint(sectionIndex: number, grammarpointIndex: number, placeholderIndex: number) {
    ((this.sections[sectionIndex].get('grammarpoints') as FormArray).controls[grammarpointIndex].get('placeholders') as FormArray).removeAt(placeholderIndex);
  }

  aaaa($event) {
    this.selection = {from: ($event.target as HTMLInputElement).selectionStart, to: ($event.target as HTMLInputElement).selectionEnd };
  }
}
