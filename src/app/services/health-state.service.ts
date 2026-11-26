import { Injectable, signal } from '@angular/core';
import { centimetersToInches, kilogramsToPounds, UserProfile } from '../domain/health-calculations';

@Injectable({ providedIn: 'root' })
export class HealthStateService {
  readonly isUsMeasure = signal(true);
  readonly profile = signal<UserProfile>({ isMale: true, heightInches: 60, weightPounds: 130, ageYears: 40 });
  toggleMeasure(): void { this.isUsMeasure.update((isUs) => !isUs); }
  toggleGender(): void { this.profile.update((p) => ({ ...p, isMale: !p.isMale })); }

  setHeightFromDisplay(value: string): void {
    const displayed = Number(value);
    if (!Number.isFinite(displayed)) return;
    const heightInches = this.isUsMeasure() ? displayed : centimetersToInches(displayed);
    this.profile.update((p) => ({ ...p, heightInches }));
  }

  setWeightFromDisplay(value: string): void {
    if (value.trim() === '') return;
    const displayed = Number(value);
    if (!Number.isFinite(displayed)) return;
    const weightPounds = this.isUsMeasure() ? displayed : kilogramsToPounds(displayed);
    if (weightPounds < 20 || weightPounds > 400) return;
    this.profile.update((p) => ({ ...p, weightPounds }));
  }

  setAge(value: string): void {
    if (value.trim() === '') return;
    const ageYears = Number(value);
    if (!Number.isFinite(ageYears) || ageYears < 13 || ageYears > 120) return;
    this.profile.update((p) => ({ ...p, ageYears }));
  }
}
