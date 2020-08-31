import {Component, OnInit} from '@angular/core';
import {PaymentService} from './payment.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-custom-payment',
    templateUrl: './custom-payment.component.html',
    styleUrls: ['./custom-payment.component.scss'],
    providers: [PaymentService]
})
export class CustomPaymentComponent implements OnInit {

    gigyaLoaderActive: boolean;
    loadingData: Subscription;
    validationPage: boolean;
    sendingData: boolean;

    constructor(private paymentService: PaymentService) {
        this.gigyaLoaderActive = false;
        this.validationPage = false;
        this.sendingData = false;
    }

    ngOnInit() {
    }

    onInputedData = () => {
        this.gigyaLoaderActive = true;
        this.validateUserOnGigya();
    }

    validateUserOnGigya = () => {
        const userEmail = 'some_email';
        this.loadingData = this.paymentService.fetchUserInfo$(userEmail).subscribe(response => {
            this.paymentService.gigyaUser = this.paymentService.isUserRegistrer(response);
            this.gigyaLoaderActive = false;
            this.validationPage = true;
        })
    }

    returnToForm = () => {
        this.validationPage = false;
    }

    sendPayout = () => {
        this.sendingData = true;
        this.paymentService.putPayment$().subscribe(response => {
            this.sendingData = false;
            if (response.statusCode === 200) {
                this.paymentService.resetPayoutData();
                this.validationPage = false;
            }
            this.showToastMessage(response);
        })
    }

    showToastMessage(response: any) {
        if (response.statusCode === 200) {
        } else {
            let errorMessage = 'Custom payment not successfully added ';
            let errorMessageResponse = '';
            if (response.body.hasOwnProperty('details')) {
                errorMessageResponse = response.body.details[0].message;
            } else if (response.body.hasOwnProperty('message')) {
                errorMessageResponse = response.body.message;
            }
            errorMessage = errorMessage + errorMessageResponse;
        }
    }

}
