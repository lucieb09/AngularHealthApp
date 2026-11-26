import { TestBed } from '@angular/core/testing';
import { HealthStateService } from './health-state.service';

describe('HealthStateService', () => {
  let state: HealthStateService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HealthStateService] });
    state = TestBed.inject(HealthStateService);
  });

  it('starts with the original profile defaults', () => {
    expect(state.profile()).toEqual({ isMale: true, heightInches: 60, weightPounds: 130, ageYears: 40 });
    expect(state.isUsMeasure()).toBe(true);
  });

  it('switches measurement units without changing canonical profile values', () => {
    state.toggleMeasure();
    expect(state.isUsMeasure()).toBe(false);
    expect(state.profile().weightPounds).toBe(130);
    state.toggleMeasure();
    expect(state.isUsMeasure()).toBe(true);
  });

  it('changes gender and converts metric height to canonical inches', () => {
    state.toggleGender();
    expect(state.profile().isMale).toBe(false);
    state.toggleMeasure();
    state.setHeightFromDisplay('178');
    expect(state.profile().heightInches).toBeCloseTo(70.0787, 3);
  });

  it('accepts weight within 20–400 pounds through either unit system', () => {
    state.setWeightFromDisplay('200');
    expect(state.profile().weightPounds).toBe(200);
    state.toggleMeasure();
    state.setWeightFromDisplay('60');
    expect(state.profile().weightPounds).toBe(132.3);
  });

  it('ignores invalid, empty, and out-of-range weight input', () => {
    state.setWeightFromDisplay('19');
    state.setWeightFromDisplay('401');
    state.setWeightFromDisplay('');
    state.setWeightFromDisplay('not-a-number');
    expect(state.profile().weightPounds).toBe(130);
  });

  it('accepts age from 13 through 120 and ignores other values', () => {
    state.setAge('13');
    expect(state.profile().ageYears).toBe(13);
    state.setAge('120');
    expect(state.profile().ageYears).toBe(120);
    state.setAge('12');
    state.setAge('121');
    state.setAge('');
    expect(state.profile().ageYears).toBe(120);
  });
});
