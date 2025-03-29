import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepartmentModel } from '../../models/department.model';
import { DoctorModel } from '../../models/doctor.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DxSchedulerModule } from 'devextreme-angular';
import { HttpService } from '../../services/http.service';
import {
  appointmentActionCreate,
  appointmentActionDelete,
  appointmentActionGetAllByDoctorId,
  appointmentActionUpdate,
  departmentAction,
  doctorActionGetDoctorsByDepartment,
  patientActionGetPatientByIdentityNumber,
} from '../../constants/urlconstants';
import { AppointmentModel } from '../../models/appointment.model';
import { CreateAppointmentModel } from '../../models/create-appointment.model';
import { FormValidateDirective } from 'form-validate-angular';
import { SwalService } from '../../services/swal.service';
import { ResultModel } from '../../models/result.model';
import { PatientModel } from '../../models/patient.model';
import { SignalRService } from '../../services/signalR.service';
import { AuthService } from '../../services/auth.service';

declare const $: any;

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    CommonModule,
    DxSchedulerModule,
    FormValidateDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  departments: DepartmentModel[] = [];
  doctors: DoctorModel[] = [];

  appointments: AppointmentModel[] = [];
  createModel: CreateAppointmentModel = new CreateAppointmentModel();

  selectedDepartmentValue: number = 0;
  selectedDoctorId: number = 0;

  @ViewChild('createModalCloseBtn') createModalCloseBtn:
    | ElementRef<HTMLButtonElement>
    | undefined;

  constructor(
    private http: HttpService,
    private date: DatePipe,
    private swal: SwalService,
    private signalR: SignalRService
  ) {}

  ngOnInit(): void {
    this.getAll();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000); // Her saniye saati günceller

    this.signalR.startConnection();
    this.signalR.listenForDeletedAppointments((appointmentId:string) => {
      this.appointments = this.appointments.filter(a => a.id !== appointmentId);
    });
  }

  getAll() {
    // Departmanları getir
    return this.http.get<DepartmentModel[]>(departmentAction, (res) => {
      this.departments = res.data;
    });
  }

  getAllDoctor() {
    // Seçilen departmana ait doktorları listele
    this.selectedDoctorId = 0;
    if (this.selectedDepartmentValue > 0) {
      this.http.post<DoctorModel[]>(
        doctorActionGetDoctorsByDepartment,
        { departmentId: this.selectedDepartmentValue },
        (res) => {
          this.doctors = res.data;
        }
      );
    }
  }

  getAllAppointments() {
    // Seçilen doktora ait randevu sistemini göster
    if (this.selectedDoctorId) {
      this.http.post<ResultModel<AppointmentModel[]>>(
        appointmentActionGetAllByDoctorId,
        { doctorId: this.selectedDoctorId },
        (res) => {
          this.appointments = res.data;
        }
      );
    }
  }

  onAppointmentFormOpening(event: any) {
    event.cancel = true;
    this.createModel.startDate =
      this.date.transform(
        event.appointmentData.startDate,
        'dd.MM.yyyy HH:mm'
      ) ?? '';
    this.createModel.endDate =
      this.date.transform(event.appointmentData.endDate, 'dd.MM.yyyy HH:mm') ??
      '';
    this.createModel.doctorId = this.selectedDoctorId;

    $('#createModal').modal('show');
  }

  onAppointmentDeleted(event: any) {
    event.cancel = true;
  } // Silmeden önce

  onAppointmentDeleting(event: any) {
    event.cancel = true;

    this.http.delete<string>(
      appointmentActionDelete,
      { id: event.appointmentData.id, doctorId: this.selectedDoctorId },
      (res) => {
        this.swal.callToast(res.data, 'info');
        this.getAllAppointments();
      }
    );

    // SWAL İLE MESAJ SİLME
    // this.swal.deleteToast("Delete appointment?", `You want to delete ${event.appointmentData.patient.fullName} appointment?`, () => {
    //   this.http.delete<string>(appointmentActionDelete, { id: event.appointmentData.id, doctorId: this.selectedDoctorId}, res => {
    //     this.swal.callToast(res.data, "info")
    //     this.getAllAppointments();
    //   })
    // })
  } // Silmeden sonra

  onAppointmentUpdating(event: any) {
    event.cancel = true;

    const data = {
      id: event.oldData.id,
      startDate: this.date.transform(event.newData.startDate,'dd.MM.yyyy HH:mm'),
      endDate: this.date.transform(event.newData.endDate, 'dd.MM.yyyy HH:mm'),
    };

    this.http.put<string>(appointmentActionUpdate, data, (res) => {
      this.swal.callToast(res.data, 'success');
      this.getAllAppointments();
    });

    // IF ile geçmiş tarih kontrolü
    //const now = new Date(); // Şu anki tarih ve saat
    // if (Date.parse(event.newData.startDate) < now.getTime()) {
    //   this.swal.callToast('Geçmiş bir tarihe randevu oluşturamazsınız. Lütfen geçerli bir tarih girin.', 'warning');
    // } else {
    //   const data = {
    //     id: event.oldData.id,
    //     startDate: this.date.transform(event.newData.startDate,'dd.MM.yyyy HH:mm'),
    //     endDate: this.date.transform(event.newData.endDate, 'dd.MM.yyyy HH:mm'),
    //   };

    //   this.http.put<string>(appointmentActionUpdate, data, (res) => {
    //     this.swal.callToast(res.data, 'success');
    //     this.getAllAppointments();
    //   });
    // }
  }

  isInputDisabled: boolean = false;
  getPatient() {
    this.http.post<PatientModel>(
      patientActionGetPatientByIdentityNumber,
      { identityNumber: this.createModel.identityNumber },
      (res) => {
        if (res.data === null) {
          this.createModel.patientId = 0;
          this.createModel.firstName = '';
          this.createModel.lastName = '';
          this.createModel.city = '';
          this.createModel.town = '';
          this.createModel.fullAddress = '';

          this.isInputDisabled = false;
          return;
        }

        this.createModel.patientId = res.data.id;
        this.createModel.firstName = res.data.firstName;
        this.createModel.lastName = res.data.lastName;
        this.createModel.city = res.data.city;
        this.createModel.town = res.data.town;
        this.createModel.fullAddress = res.data.fullAddress;

        this.isInputDisabled = true;
      }
    );
  }

  create(form: NgForm) {
    if (form.valid) {
      this.http.post<string>(
        appointmentActionCreate,
        this.createModel,
        (res) => {
          this.swal.callToast(res.data);
          this.createModalCloseBtn?.nativeElement.click();
          this.createModel = new CreateAppointmentModel();
          this.getAllAppointments();
        }
      );
    }
  }


  currentTime: string = "";
  updateClock(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    this.currentTime = `${hours}:${minutes}:${seconds}`;
  }
}
