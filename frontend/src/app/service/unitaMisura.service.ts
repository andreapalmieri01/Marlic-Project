import { Injectable } from '@angular/core';
import {Polimero} from "../Models/polimero";
import {Rinforzo} from "../Models/rinforzo";
@Injectable({
  providedIn: 'root',
})
export class UnitàMisuraService {

  private unitaMisuraRinforzo: { [nomeRinforzo: string]: { [campo: string]: string } } = {};

  private unitaMisuraPolimero: { [nomePolimero: string]: { [campo: string]: string } } = {};


  setUnitaMisuraRinforzo(nomeRinforzo: string, campo: string, unitaMisura: string) {
    if (!this.unitaMisuraRinforzo[nomeRinforzo]) {
      this.unitaMisuraRinforzo[nomeRinforzo] = {};
    }
    this.unitaMisuraRinforzo[nomeRinforzo][campo] = unitaMisura;
  }

  getUnitaMisuraRinforzo(nomeRinforzo: string, campo: string): string {
    if (this.unitaMisuraRinforzo[nomeRinforzo]) {
      return this.unitaMisuraRinforzo[nomeRinforzo][campo] || '';
    }
    return '';
  }

  setUnitaMisuraPolimero(nomePolimero: string, campo: string, unitaMisura: string) {
    if (!this.unitaMisuraPolimero[nomePolimero]) {
      this.unitaMisuraPolimero[nomePolimero] = {};
    }
    this.unitaMisuraPolimero[nomePolimero][campo] = unitaMisura;
  }

  getUnitaMisuraPolimero(nomePolimero: string, campo: string): string {
    if (this.unitaMisuraPolimero[nomePolimero]) {
      return this.unitaMisuraPolimero[nomePolimero][campo] || '';
    }
    return '';
  }
}
