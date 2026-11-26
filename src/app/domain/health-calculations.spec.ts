import {
  calculateBmi, calculateBmr, calculateThr, classifyBmi,
  centimetersToInches, displayHeight, displayWeight,
  formatHeight, inchesToCentimeters, kilogramsToPounds, poundsToKilograms,
} from './health-calculations';

describe('health calculations and unit formatting', () => {
  it('calculates and rounds BMI to one decimal place', () => {
    expect(calculateBmi({ heightInches: 70, weightPounds: 300 })).toBe(43);
    expect(calculateBmi({ heightInches: 68, weightPounds: 120 })).toBe(18.2);
  });

  it('calculates the original male and female BMR formulas', () => {
    expect(calculateBmr({ isMale: true, heightInches: 70, weightPounds: 200, ageYears: 40 })).toBe(1929);
    expect(calculateBmr({ isMale: false, heightInches: 68, weightPounds: 120, ageYears: 35 })).toBe(1332);
  });

  it('calculates the original 50% to 85% target heart rate range', () => {
    expect(calculateThr(40)).toEqual({ min: 90, max: 153 });
  });

  it.each([
    [18.4, 'Underweight'], [18.5, 'Normal'], [24.9, 'Normal'],
    [25, 'Overweight'], [29.9, 'Overweight'], [30, 'Obese'],
  ] as const)('classifies BMI %s as %s', (value, expected) => {
    expect(classifyBmi(value)).toBe(expected);
  });

  it('converts inches and centimeters both ways', () => {
    expect(inchesToCentimeters(12)).toBe(30.48);
    expect(centimetersToInches(50)).toBeCloseTo(19.685, 2);
    expect(displayHeight(60, false)).toBe(152.4);
  });

  it('converts pounds and kilograms both ways', () => {
    expect(poundsToKilograms(130)).toBeCloseTo(58.957, 2);
    expect(kilogramsToPounds(60)).toBe(132.3);
    expect(displayWeight(130, false)).toBe(58.96);
  });

  it('formats height in U.S. and metric units as the original UI did', () => {
    expect(formatHeight(70, true)).toBe('5 ft. 10 in.');
    expect(formatHeight(70, false)).toBe('178 cm.');
    expect(formatHeight(70, false, false)).toBe('70 cm.');
  });
});
