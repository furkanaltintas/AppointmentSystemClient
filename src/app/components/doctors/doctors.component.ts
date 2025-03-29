import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { departmentAction, doctorAction, doctorActionCreate, doctorActionDelete, doctorActionUpdate } from '../../constants/urlconstants';
import { CommonModule } from '@angular/common';
import { DepartmentModel } from '../../models/department.model';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { DoctorCreateViewModel } from '../../viewModels/doctorCreate.viewmodel';
import { Unit } from '../../models/result.model';
import { SwalService } from '../../services/swal.service';
import { DoctorUpdateViewModel } from '../../viewModels/doctorUpdate.viewmodel';
import { DoctorPipe } from '../../pipes/doctor.pipe';

@Component({
  selector: 'app-doctors',
  imports: [RouterLink, CommonModule, FormsModule, FormValidateDirective, DoctorPipe], // FormsModule=>ngModel yapısı için gerekli
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  doctors: DoctorModel[] = [];
  departments : DepartmentModel[] = [];

  createModel: DoctorCreateViewModel = new DoctorCreateViewModel();
  updateModel: DoctorUpdateViewModel = new DoctorUpdateViewModel();
  doctorModel: DoctorModel = new DoctorModel();

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
    this.http.get<DepartmentModel[]>(departmentAction, (res)=> {
      this.departments = res.data;
    });

    return this.http.get<DoctorModel[]>(doctorAction, (res)=> {
      this.doctors = res.data;
    })
  }

  get(data: DoctorModel) {
    this.updateModel.id = data.id;
    this.updateModel.departmentId = data.department.id;
    this.updateModel.firstName = data.firstName;
    this.updateModel.lastName = data.lastName;
  }

  create(form: NgForm) {
    if(form.valid) {
      this.http.post<string>(doctorActionCreate, this.createModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.createModalCloseButton?.nativeElement.click();
        this.createModel = new DoctorCreateViewModel();
      });
    }
  }

  update(form: NgForm) {
    if(form.valid) {
      this.http.put<string>(doctorActionUpdate, this.updateModel, (res) => {
        this.swal.callToast(res.data, 'success');
        this.getAll();
        this.updateModalCloseButton?.nativeElement.click();
      });
    }
  }

  delete(id: string, fullName: string) {
    this.swal.deleteToast("Delete doctor ?", `You want to delete ${fullName}?`, () => {
      this.http.delete<string>(doctorActionDelete, {id:id}, (res) => {
        this.swal.callToast(res.data, "info");
        this.getAll();
      })
    })
  }
}
