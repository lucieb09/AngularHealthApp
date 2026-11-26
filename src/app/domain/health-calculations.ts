export interface UserProfile {
  isMale: boolean;
  heightInches: number;
  weightPounds: number;
  ageYears: number;
}

export function calculateBmi(profile: Pick<UserProfile, 'heightInches' | 'weightPounds'>): number {
  return Math.round((profile.weightPounds * 703 / (profile.heightInches * profile.heightInches)) * 10) / 10;
}

export function calculateBmr(profile: UserProfile): number {
  const { weightPounds, heightInches, ageYears, isMale } = profile;
  return isMale ? Math.floor(66 + 6.23 * weightPounds + 12.7 * heightInches - 6.8 * ageYears)
    : Math.floor(655 + 4.35 * weightPounds + 4.7 * heightInches - 4.7 * ageYears);
}

export function calculateThr(ageYears: number): { min: number; max: number } {
  const maxHeartRate = 220 - Number(ageYears);
  return { min: Math.round(5 * maxHeartRate) / 10, max: Math.round(8.5 * maxHeartRate) / 10 };
}

export function classifyBmi(value: number): 'Underweight' | 'Normal' | 'Overweight' | 'Obese' {
  if (value >= 30) return 'Obese';
  if (value >= 25) return 'Overweight';
  if (value < 18.5) return 'Underweight';
  return 'Normal';
}

export function inchesToCentimeters(inches: number): number { return Number(inches) * 2.54; }
export function centimetersToInches(centimeters: number): number { return Number(centimeters) / 2.54; }
export function poundsToKilograms(pounds: number): number { return Number(pounds) / 2.205; }
export function kilogramsToPounds(kilograms: number): number { return Number(kilograms) * 2.205; }

export function displayHeight(heightInches: number, isUsMeasure: boolean): number {
  return isUsMeasure ? heightInches : inchesToCentimeters(heightInches);
}
export function displayWeight(weightPounds: number, isUsMeasure: boolean): number {
  return isUsMeasure ? weightPounds : Math.round(poundsToKilograms(weightPounds) * 100) / 100;
}
export function formatHeight(heightInches: number, isUsMeasure: boolean, convert = true): string {
  if (!isUsMeasure) return `${convert ? Math.round(inchesToCentimeters(heightInches)) : heightInches} cm.`;
  const feet = Math.floor(heightInches / 12);
  const inches = heightInches - feet * 12;
  let result = feet > 0 ? `${feet} ft. ` : '';
  if (inches >= 1) result += `${Math.floor(inches)} in.`;
  return result;
}
