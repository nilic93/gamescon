import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomPaymentModule } from "../../custom-payment.module";
import { PaymentService } from "../../payment.service";
import { HttpClient } from '@angular/common/http';
import { PaymentValidationComponent } from "./payment-validation.component";


const httpClientMock = {
  post: jest.fn(),
};

describe('PaymentFormComponent', () => {
  let component: PaymentValidationComponent;
  let fixture: ComponentFixture<PaymentValidationComponent>;


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
    fixture = TestBed.createComponent(PaymentValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit() : should create', (() => {
    expect(component).toBeTruthy();
  }));


  it('validateData()', (() => {
    component.validateData();
    expect(component.validData).toBeTruthy();
    component.validateData();
    expect(component.validData).toBeFalsy();
  }));

  it('returnToForm()', (() => {
    component.sendPayout();
    component.returnToForm();
  }));

});