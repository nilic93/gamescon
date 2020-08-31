import { Component, OnInit, Output } from '@angular/core';
import { PaymentService } from "../../payment.service";
import { Payout } from 'app/shared/models/payout.model';
import { Subject } from "rxjs";

@Component({
  selector: 'cmp-payment-validation',
  templateUrl: './payment-validation.component.html',
  styleUrls: ['./payment-validation.component.scss']
})
export class PaymentValidationComponent implements OnInit {
  @Output() returnToFirstPage = new Subject<void>();
  @Output() sendPayoutRequest = new Subject<void>();
  userData: Payout;
  validData: boolean;
  regitredUser: boolean;



  constructor(private paymentService: PaymentService) {
    this.validData = false;
  }

  ngOnInit() {
    this.userData = this.paymentService.getPayoutData();
    this.regitredUser = this.paymentService.gigyaUser;
  }

  validateData = () => {
    this.validData = !this.validData;
  }

  returnToForm = () => {
    this.returnToFirstPage.next();
  }

  sendPayout = () => {
    this.sendPayoutRequest.next();
  }

}