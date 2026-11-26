import { Component, computed, inject, signal } from '@angular/core';
import { HealthStateService } from './services/health-state.service';
import {
  calculateBmi, calculateBmr, calculateThr, classifyBmi,
  displayHeight, displayWeight, formatHeight,
} from './domain/health-calculations';

@Component({ selector: 'app-root', templateUrl: './app.html', styleUrl: './app.css' })
export class App {
  readonly state = inject(HealthStateService);
  readonly isUsMeasure = this.state.isUsMeasure;
  readonly profile = this.state.profile;
  readonly heightValue = computed(() => displayHeight(this.profile().heightInches, this.isUsMeasure()));
  readonly heightMinimum = computed(() => this.isUsMeasure() ? 24 : 60);
  readonly heightMaximum = computed(() => this.isUsMeasure() ? 84 : 215);
  readonly heightMinimumLabel = computed(() => formatHeight(this.heightMinimum(), this.isUsMeasure(), false));
  readonly heightMaximumLabel = computed(() => formatHeight(this.heightMaximum(), this.isUsMeasure(), false));
  readonly weightMinimum = computed(() => this.isUsMeasure() ? 20 : 9);
  readonly weightMaximum = computed(() => this.isUsMeasure() ? 400 : 182);
  readonly weightUnit = computed(() => this.isUsMeasure() ? 'lbs.' : 'kgs.');
  readonly bmi = computed(() => calculateBmi(this.profile()));
  readonly bmiCategory = computed(() => classifyBmi(this.bmi()));
  readonly bmr = computed(() => calculateBmr(this.profile()));
  readonly targetHeartRate = computed(() => calculateThr(this.profile().ageYears));
  readonly heightDescription = computed(() => formatHeight(this.profile().heightInches, this.isUsMeasure()));
  readonly weightDraft = signal('130');
  readonly ageDraft = signal('40');

  toggleMeasure(): void {
    this.state.toggleMeasure();
    this.weightDraft.set(String(displayWeight(this.profile().weightPounds, this.isUsMeasure())));
  }
  toggleGender(): void { this.state.toggleGender(); }
  updateHeight(event: Event): void {
    this.state.setHeightFromDisplay((event.target as HTMLInputElement).value);
  }
  updateWeight(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.weightDraft.set(value);
    this.state.setWeightFromDisplay(value);
  }
  updateAge(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.ageDraft.set(value);
    this.state.setAge(value);
  }
  get genderLabel(): string { return this.profile().isMale ? 'Male' : 'Female'; }
}
