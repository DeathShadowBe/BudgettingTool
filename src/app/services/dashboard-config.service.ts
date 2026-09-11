import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardConfigService {

  structureelInkomen = 2585;

  leefbudgetPct = 0.6;

  doelLeefbudget = 1300;

  waarschuwingsGrens = 0.8;

  xMaanden = 6;
}