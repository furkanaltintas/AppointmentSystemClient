import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { patientAction, patientActionCreate, patientActionDelete, patientActionUpdate } from '../../constants/urlconstants';
import { PatientModel } from '../../models/patient.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ResultModel, Unit } from '../../models/result.model';
import { CommonModule } from '@angular/common';
import { FormValidateDirective } from 'form-validate-angular';
import { PatientPipe } from '../../pipes/patient.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient',
  imports: [CommonModule, FormsModule, FormValidateDirective, PatientPipe, RouterLink],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit {
  patients: PatientModel[] = [];

  createModel: PatientModel = new PatientModel();
  updateModel: PatientModel = new PatientModel();

  @ViewChild("createModalCloseButton") createModalCloseButton: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild("updateModalCloseButton") updateModalCloseButton: ElementRef<HTMLButtonElement> | undefined;

  search: string = "";

  constructor(
    private http: HttpService,
    private swal: SwalService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    return this.http.get<PatientModel[]>(patientAction, (res)=> {
      this.patients = res.data;
    })
  }

  get(data: PatientModel) {
    this.updateModel = {...data};
  }

  create(form: NgForm) {
    if(form.valid) {
      this.http.post<string>(patientActionCreate, this.createModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.createModalCloseButton?.nativeElement.click();
        this.createModel = new PatientModel();
      });
    }
  }

  update(form: NgForm) {
    if(form.valid) {
      this.http.put<string>(patientActionUpdate, this.updateModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.updateModalCloseButton?.nativeElement.click();
      });
    }
  }

  delete(id: string, fullName: string) {
      this.swal.deleteToast("Delete patient ?", `You want to delete ${fullName}?`, () => {
        this.http.delete<string>(patientActionDelete, {id:id}, (res) => {
          this.swal.callToast(res.data, "info");
          this.getAll();
        })
      })
  }
}
