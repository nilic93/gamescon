import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FilterComponent } from "./filter.component";
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    FilterComponent,
    FilterInputComponent
  ],
  exports: [],
})
export class FilterModule {}
