import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { doctorAction } from '../../constants/urlconstants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctors',
  imports: [RouterLink, CommonModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  doctors: DoctorModel[] = [];

  constructor(
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    return this.http.get<DoctorModel[]>(doctorAction, (res)=> {
      this.doctors = res.data;
    })
  }
}
