import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseType } from "src/app/core/entities/ExerciseType";
import { OnyomiPipe } from "../../shared/pipes/onyomi.pipe";
import { NgFlipAnimationDirective } from 'src/app/directives/ng-flip-animation.directive';
import { ProgressComponent } from "../progress/progress.component";
import { IconsModule } from 'src/app/shared/card-info/icons.module';
import { FLY_IN_OUT_ANIMATION } from 'src/app/core/animations/modal.animation';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GrammarService } from 'src/app/core/grammar.service';
import { TransformComponent } from "./transform/transform.component";
import { BuildingblockComponent } from "./buildingblock/buildingblock.component";
import { SelectComponent } from "./select/select.component";
import { MenuModule } from "../../shared/menu/menu.module";
import { ExerciseInterface } from 'src/app/core/entities/exercise-interface';

@Component({
    selector: 'app-exercise',
    standalone: true,
    templateUrl: './exercise.component.html',
    styleUrls: ['./exercise.component.scss'],
    animations: [FLY_IN_OUT_ANIMATION],
    imports: [
      RouterModule,
      CommonModule,
      OnyomiPipe,
      NgFlipAnimationDirective,
      ProgressComponent,
      IconsModule,
      TransformComponent,
      BuildingblockComponent,
      SelectComponent,
      MenuModule
    ]
})
export class ExerciseComponent implements OnInit {
  exercises: Array<ExerciseInterface> = [];

  get currentExercise() {
    return this.exercises[this.currentExerciseIndex];
  }
  currentExerciseIndex = 0;
  hits = 0;
  misses = 0;
  success: boolean;
  ExerciseType = ExerciseType;
  score: number;

  constructor(
    private route: ActivatedRoute,
    private grammarService: GrammarService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.grammarService.get(params.get('slug')).subscribe(result => {
        console.log(result[0].sections);
        this.exercises = result[0].sections[params.get('section') ? params.get('section') : 3].exercises;
      })
    })
  }

  next() {
    if (this.currentExerciseIndex - 1 >= this.exercises.length) {

    } else {
      this.currentExerciseIndex++;
      this.success = null;
    }
  }

  handleResponse(event: boolean) {
    this.success = event;
    if (this.success) {
      this.hits++;
    }
    this.score = Math.round(this.hits * 100 / this.exercises.length);
  }

  closeExercise() {
    // TODO: store result for user
    this.router.navigate(['/grammar']);
  }
}
