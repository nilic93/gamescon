import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterModule } from "../../filter.module";
import { FilterInputComponent } from "./filter-input.component";

describe('FilterInputComponent', () => {

  let component: FilterInputComponent;
  let fixture: ComponentFixture<FilterInputComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FilterModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit()', () => {
    it('Waiting for implementation', () => {
      const spy = jest.spyOn(component, "onSubmit");
      component.onSubmit();
      expect(spy).toHaveBeenCalledTimes(1);
    })
  })

  describe('minMax()', () => {
    it('Should return true', () => {
      const returnResult = component.minMax(-1, -1);
      expect(returnResult).toBe(false);
    })
    it('Should return true', () => {
      const returnResult = component.minMax(1, 1);
      expect(returnResult).toBe(true);
    })

    it('Should return true', () => {
      const returnResult = component.minMax(23, 34);
      expect(returnResult).toBe(true);
    })

    it('Should return true', () => {
      const returnResult = component.minMax(8, 2);
      expect(returnResult).toBe(false);
    })

    it('Should return true', () => {
      const returnResult = component.minMax(234, 78);
      expect(returnResult).toBe(false);
    })
  })

  describe('checkEpisodes()', () => {
    let event = {
      target: {
        value: 5
      }
    }
    it('Should test input for 5', () => {
      component.checkEpisodes(event,true);
      expect(event.target.value).toBe(5);
      expect(component.lastValidEpisodeMin).toBe(5);
    })

    it('Should test input for -345', () => {
      event.target.value = -345;
      component.checkEpisodes(event,false);
      expect(event.target.value).toBe('');
      expect(component.lastValidEpisodeMax).toBe('');
    })

    it('Should test input for 100 and 10000000000000000000000000000000000000000000000', () => {
      event.target.value = 100;
      component.checkEpisodes(event, true);
      event.target.value = 10000000000000000000000000000000000000000000000;
      component.checkEpisodes(event,true);
      expect(event.target.value).toBe(100);
      expect(component.lastValidEpisodeMin).toBe(100);
    })
  })

  describe('checkPrize()', () => {
    let event = {
      target: {
        value: 5
      }
    }
    it('Should test for input 5', () => {
      component.checkPrize(event, true);
      expect(event.target.value).toBe(5);
      expect(component.lastValidPrizeMin).toBe(5);
    })

    it('Should test input for -345', () => {
      event.target.value = -345;
      component.checkPrize(event, true);
      expect(component.lastValidPrizeMin).toBe('');
    })

    it('Should test input for 100 and 10000000000000000000000000000000000000000000000', () => {
      event.target.value = 100;
      component.checkPrize(event, true);
      event.target.value = 10000000000000000000000000000000000000000000000;
      component.checkPrize(event, true);
      expect(component.lastValidPrizeMin).toBe(100);
    })

    it('Should test for input 5', () => {
      event.target.value = 5;
      component.checkPrize(event, false);
      expect(component.lastValidPrizeMax).toBe(5);
    })
    it('Should test input for -345', () => {
      event.target.value = -345;
      component.checkPrize(event, false);
      expect(component.lastValidPrizeMax).toBe('');
    })

    it('Should test input for 100 and 10000000000000000000000000000000000000000000000', () => {
      event.target.value = 100;
      component.checkPrize(event, false);
      event.target.value = 10000000000000000000000000000000000000000000000;
      component.checkPrize(event, false);
      expect(component.lastValidPrizeMax).toBe(100);
    })
  })

  describe('formatDecimals()', () => {
    let event = {
      target: {
        value: 5
      }
    }
    it('test format decimals for input 5', () => {
      component.formatDecimals(event, true);
      expect(event.target.value).toBe(5);
    })

    it('test format decimals for input 17.67', () => {
      event.target.value = 17.67;
      component.formatDecimals(event, true);
      expect(event.target.value).toBe(17.67);
    })
  })

  describe('getInputErrorMessage()', () => {
    it('Should return "You must enter search parameters for won episodes"', () => {
      const returnResult = component.getInputErrorMessage();
      expect(returnResult).toBe("You must enter search parameters for won episodes");
    })

    it('Should return "You must enter search parameters for won episodes"', () => {
      component.filterFormGroup.controls['minEpisodes'].setErrors({ 'episodes': 'Please enter valid range for episodes.' });
      const returnResult = component.getInputErrorMessage();
      expect(returnResult).toBe("Please enter valid range for episodes.");
    })
    it('Should return ""', () => {
      component.filterFormGroup.controls['minEpisodes'].setErrors(null);
      const returnResult = component.getInputErrorMessage();
      expect(returnResult).toBe("");
    })
    it('Should return ""', () => {
      component.filterFormGroup.controls['minEpisodes'].setErrors(null);
      component.filterFormGroup.controls['minPrize'].setErrors({ 'prize': "Please enter valid range for prize money." });
      const returnResult = component.getInputErrorMessage();
      expect(returnResult).toBe("Please enter valid range for prize money.");
    })
    it('Should return ""', () => {
      component.filterFormGroup.controls['minEpisodes'].setErrors(null);
      component.filterFormGroup.controls['minPrize'].setErrors(null);
      const returnResult = component.getInputErrorMessage();
      expect(returnResult).toBe("");
    })
  })

   describe('validationMinEpisodes()', () => {
    it('Should return null', () => {
      component.filterFormGroup.controls['minEpisodes'].setValue(2);
      component.maxEpisodes = 6;
      const returnResult = component.validationMinEpisodes(this);
      expect(returnResult).toBe(null);
    })
    it('Should return {episodes:true}', () => {
      component.filterFormGroup.controls['minEpisodes'].setValue(-2);
      component.maxEpisodes = 3;
      const returnResult = component.validationMinEpisodes(this);
      expect(returnResult.episodes).toBe("Please enter valid range for episodes.");
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['minEpisodes'].setValue(1);
      component.maxEpisodes = 6;
      const returnResult = component.validationMinEpisodes(this);
      expect(returnResult).toBe(null);
    })
    it('Should return {episodes:true}', () => {
      component.filterFormGroup.controls['minEpisodes'].setValue(-1);
      component.maxEpisodes = 3;
      const returnResult = component.validationMinEpisodes(this);
      expect(returnResult.episodes).toBe("Please enter valid range for episodes.");
    })
   })

  describe('validationMaxEpisodes()', () => {
    it('Should return {episodes:true}', () => {
      component.filterFormGroup.controls['maxEpisodes'].setValue(2);
      component.minEpisodes = 6;
      const returnResult = component.validationMaxEpisodes(this);
      expect(returnResult.episodes).toBe("Please enter valid range for episodes.");
    })
    it('Should return {episodes:true}', () => {
      component.filterFormGroup.controls['maxEpisodes'].setValue(-2);
      component.minEpisodes = 3;
      const returnResult = component.validationMaxEpisodes(this);
      expect(returnResult.episodes).toBe("Please enter valid range for episodes.");
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['maxEpisodes'].setValue(6);
      component.minEpisodes = 6;
      const returnResult = component.validationMaxEpisodes(this);
      expect(returnResult).toBe(null);
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['maxEpisodes'].setValue(7);
      component.minEpisodes = 3;
      const returnResult = component.validationMaxEpisodes(this);
      expect(returnResult).toBe(null);
    })
  })


  describe('validationMaxPrize()', () => {
    it('Should return { \'prize\': true }', () => {
      component.filterFormGroup.controls['maxPrize'].setValue(2);
      component.minPrize = '6';
      const returnResult = component.validationMaxPrize(this);
      expect(returnResult.prize).toBe('Please enter valid range for prize money.');
    })
    it('Should return { \'prize\': true }', () => {
      component.filterFormGroup.controls['maxPrize'].setValue(-2);
      component.minPrize = '3';
      const returnResult = component.validationMaxPrize(this);
      expect(returnResult.prize).toBe('Please enter valid range for prize money.');
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['maxPrize'].setValue(6);
      component.minPrize = '6';
      const returnResult = component.validationMaxPrize(this);
      expect(returnResult).toBe(null);
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['maxPrize'].setValue(7);
      component.minPrize = '3';
      const returnResult = component.validationMaxPrize(this);
      expect(returnResult).toBe(null);
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['maxPrize'].setValue('');
      component.minPrize = '';
      const returnResult = component.validationMaxPrize(this);
      expect(returnResult).toBe(null);
    })
  })
  describe('validationMinPrize()', () => {
    it('Should return { \'prize\': true }', () => {
      component.filterFormGroup.controls['maxPrize'].setValue(2);
      component.maxPrize = '6';
      const returnResult = component.validationMinPrize(this);
      expect(returnResult.prize).toBe('Please enter valid range for prize money.');
    })
    it('Should return { \'prize\': true }', () => {
      component.filterFormGroup.controls['minPrize'].setValue(-2);
      component.maxPrize = '3';
      const returnResult = component.validationMinPrize(this);
      expect(returnResult.prize).toBe('Please enter valid range for prize money.');
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['minPrize'].setValue(6);
      component.maxPrize = '6';
      const returnResult = component.validationMinPrize(this);
      expect(returnResult).toBe(null);
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['minPrize'].setValue(3);
      component.maxPrize = '7';
      const returnResult = component.validationMinPrize(this);
      expect(returnResult).toBe(null);
    })
    it('Should return null', () => {
      component.filterFormGroup.controls['minPrize'].setValue('');
      component.maxPrize = '';
      const returnResult = component.validationMinPrize(this);
      expect(returnResult).toBe(null);
    })
  })
})

