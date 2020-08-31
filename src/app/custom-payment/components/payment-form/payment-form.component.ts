import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validatorEmail } from "../../../shared/form-validators/email.validator";
import { moneyValidator } from "../../../shared/form-validators/money.validator";
import { taxValidator } from "../../../shared/form-validators/tax.validator";
import { validatorEpisode} from "../../../shared/form-validators/episode.validator";
import { PaymentService } from "../../payment.service";
import { Subject } from "rxjs";
import config from "../../../../environments/config";



@Component({
  selector: 'cmp-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent implements OnInit {
  @Output() formSubmitted = new Subject<void>();
  paymentFormGroup: FormGroup;
  gameFormat: string;
  gameFormatArray: any;
  constructor(public paymentService: PaymentService) {
    this.gameFormatArray = config.getGameFormats();
  }

  ngOnInit() {
    this.paymentFormGroup = new FormGroup({
      email: new FormControl(this.paymentService.getEmail(), [Validators.required, validatorEmail]),
      prizeMoney: new FormControl(this.paymentService.getPrizeMoney(), [Validators.required, moneyValidator]),
      tax: new FormControl(this.paymentService.getTax(), [Validators.required, taxValidator]),
      format: new FormControl(this.paymentService.getFormat(), [Validators.required]),
      episode: new FormControl(this.paymentService.getEpisode(), [Validators.required, validatorEpisode])
    });
    this.gameFormat = this.paymentService.getPayoutData().gameFormat;
  }

  onSubmit = () => {
    const insertedEpisode = this.paymentFormGroup.get('episode').value;
    const insertedEmail = this.paymentFormGroup.get('email').value;

    this.paymentService.setPayoutData({
      email: insertedEmail,
      prizemoney: this.paymentFormGroup.get('prizeMoney').value,
      tax: this.paymentFormGroup.get('tax').value,
      format: this.paymentFormGroup.get('format').value,
      episode: insertedEpisode,
      userID: insertedEpisode + "_custom_" + insertedEmail,
      gameFormat: this.gameFormat
    });
    this.formSubmitted.next();
  }


  /**
   * @desc This is a method for getting input error
   * @param {stirng} field
   * @memberof PaymentFormComponent
   * @returns {String} Input error message to be displayed
   */
  getInputErrorMessage = (field: string): string => {
    const inputField = this.paymentFormGroup.get(field);
    if (inputField.hasError('required')) {
      return `You must set ${field.toLowerCase()}`;
    } else if (inputField.hasError(field)) {
      return inputField.getError(`${field}`).value;
    } else {
      return '';
    }
  }

  updateGameFormat = (gameFormat:string) => {
    this.gameFormat = gameFormat;
    this.paymentFormGroup.controls['format'].setValue(gameFormat);
  }
}
