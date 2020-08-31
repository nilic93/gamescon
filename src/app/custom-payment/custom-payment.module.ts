import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPaymentComponent} from "./custom-payment.component";
import { PaymentValidationComponent} from "./components/payment-validation/payment-validation.component";
import { PaymentFormComponent} from "./components/payment-form/payment-form.component";
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule
  ],
  declarations: [
    CustomPaymentComponent,
    PaymentValidationComponent,
    PaymentFormComponent
  ],
  exports: [
  ]
})
export class CustomPaymentModule { }
