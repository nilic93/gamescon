import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomPaymentModule } from "../../custom-payment.module";
import { PaymentFormComponent } from "./payment-form.component";
import { PaymentService } from "../../payment.service";
import { HttpClient } from '@angular/common/http';


const httpClientMock = {
  post: jest.fn(),
};

describe('PaymentFormComponent', () => {
  let component: PaymentFormComponent;
  let fixture: ComponentFixture<PaymentFormComponent>;


  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [CustomPaymentModule],
      providers: [PaymentService,
        {
          provide: HttpClient,
          useValue: httpClientMock,

        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit() : should create', (() => {
    expect(component).toBeTruthy();
  }));

  it('onSubmit()', (() => {
    component.paymentFormGroup.controls['email'].setValue("test@test.com");
    component.paymentFormGroup.controls['tax'].setValue("2.22");
    component.paymentFormGroup.controls['prizeMoney'].setValue("2.22");
    component.paymentFormGroup.controls['episode'].setValue("S1E34");
    component.onSubmit();
    let userID = component.paymentService.getPayoutData().userID;
    expect(userID).toBe('S1E34_custom_test@test.com');
  }));

  //
  // required
  //

  it('getInputErrorMessage()', (() => {
    let errorMessage = component.getInputErrorMessage('email');
    expect(errorMessage).toBe('You must set email');
  }));

  it('getInputErrorMessage()', (() => {
    let errorMessage = component.getInputErrorMessage('prizeMoney');
    expect(errorMessage).toBe('You must set prizemoney');
  }));

  it('getInputErrorMessage()', (() => {
    let errorMessage = component.getInputErrorMessage('tax');
    expect(errorMessage).toBe('You must set tax');
  }));

  it('getInputErrorMessage()', (() => {
    let errorMessage = component.getInputErrorMessage('format');
    expect(errorMessage).toBe('You must set format');
  }));

  it('getInputErrorMessage()', (() => {
    let errorMessage = component.getInputErrorMessage('episode');
    expect(errorMessage).toBe('You must set episode');
  }));

  //
  // invalid
  //

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['email'].setValue("test");
    let errorMessage = component.getInputErrorMessage('email');
    expect(errorMessage).toBe('Please enter valid email.');
  }));

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['prizeMoney'].setValue("2");
    let errorMessage = component.getInputErrorMessage('prizeMoney');
    expect(errorMessage).toBe('Please insert valid money between 0.00 and 999.99');
  }));

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['tax'].setValue("sdsd");
    let errorMessage = component.getInputErrorMessage('tax');
    expect(errorMessage).toBe('Please insert valid money between 0.00 and 999.99');
  }));

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['episode'].setValue("sdsd");
    let errorMessage = component.getInputErrorMessage('episode');
    expect(errorMessage).toBe('Please insert valid episode identifier');
  }));

  //
  // valid
  //

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['email'].setValue("test@test.com");
    let errorMessage = component.getInputErrorMessage('email');
    expect(errorMessage).toBe('');
  }));

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['prizeMoney'].setValue("2.22");
    let errorMessage = component.getInputErrorMessage('prizeMoney');
    expect(errorMessage).toBe('');
  }));

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['tax'].setValue("1.07");
    let errorMessage = component.getInputErrorMessage('tax');
    expect(errorMessage).toBe('');
  }));

  it('getInputErrorMessage()', (() => {
    component.paymentFormGroup.controls['episode'].setValue("S1E3");
    let errorMessage = component.getInputErrorMessage('episode');
    expect(errorMessage).toBe('');
  }));

  it('updateGameFormat', () => {
    component.updateGameFormat('gameroom');
    expect(component.paymentFormGroup.controls['format'].value).toBe('gameroom');
  })
});