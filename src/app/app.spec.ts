import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { HealthStateService } from './services/health-state.service';

describe('Health calculator app', () => {
  let fixture: ComponentFixture<App>;
  let state: HealthStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    fixture = TestBed.createComponent(App);
    state = TestBed.inject(HealthStateService);
    fixture.detectChanges();
  });

  it('shows the default profile and all three estimates', () => {
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('h1')?.textContent).toContain('Health Calculator');
    expect(page.textContent).toContain('Male');
    expect(page.textContent).toContain('5 ft.');
    expect(page.textContent).toContain('1365');
    expect(page.textContent).toContain('25.4');
    expect(page.textContent).toContain('90–153');
  });

  it('toggles units and updates displayed values without changing the stored measurements', () => {
    const button = (fixture.nativeElement as HTMLElement).querySelector('.toggle-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(state.isUsMeasure()).toBe(false);
    expect(state.profile().heightInches).toBe(60);
    expect(state.profile().weightPounds).toBe(130);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('kgs.');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('152 cm.');
  });

  it('toggles gender and recalculates BMR', () => {
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('.toggle-button');
    (buttons[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(state.profile().isMale).toBe(false);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Female');
  });

  it('stores valid weight input and recalculates the BMI', () => {
    const input = (fixture.nativeElement as HTMLElement).querySelector('#weight') as HTMLInputElement;
    input.value = '200';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(state.profile().weightPounds).toBe(200);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('39');
  });

  it('keeps the last valid age when an out-of-range age is entered', () => {
    const input = (fixture.nativeElement as HTMLElement).querySelector('#age') as HTMLInputElement;
    input.value = '12';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(state.profile().ageYears).toBe(40);
    expect(input.validity.valid).toBe(false);
  });

  it('updates the profile height when the slider changes', () => {
    const input = (fixture.nativeElement as HTMLElement).querySelector('#height') as HTMLInputElement;
    input.value = '70';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(state.profile().heightInches).toBe(70);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('5 ft. 10 in.');
  });
});
