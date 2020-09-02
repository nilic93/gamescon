import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import {ResultsComponent} from './results.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule
  ],
  declarations: [
      ResultsComponent
  ],
  exports: [
  ]
})
export class ResultsModule { }
