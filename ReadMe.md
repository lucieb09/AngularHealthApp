# Angular Health App

This repository is a migration of the original AngularJS 1.2.9 health calculator to Angular 22.3.0.

## Requirements

- Node.js 22.22.3 or newer in the 22.x line, or 24.15.0 or newer in the 24.x line
- npm 11

## Run locally

```powershell
npm ci
npm start
```

Open the local URL printed by Angular CLI. The app runs entirely in the browser; it has no server API or database.

## Build and tests

```powershell
npm run build
npm test -- --watch=false
```

## What the app does

- Switches between U.S. and metric units while keeping the profile stored in inches and pounds.
- Lets the user switch the gender value used by the original BMR formulas.
- Accepts height, weight, and age inputs with the original ranges.
- Recalculates BMI, BMR, and a 50%–85% target heart rate range as the profile changes.
- Labels BMI using the original category thresholds.

The formulas and bounds are carried over from the AngularJS version. See `MIGRATION.md` for the migration decisions, mapped features, checks, and remaining limitations.
