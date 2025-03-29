export const api: string ="https://localhost:7135/api/";
export const claims: string = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims";
export const tokenKey: string = "token";

// Client
export const login: string = "/login";



// Backend
export const loginAction: string = "Auth/Login";


export const doctorAction: string = "Doctors/GetAll";
export const doctorActionGetDoctorsByDepartment = "Doctors/GetDoctorsByDepartment";
export const doctorActionCreate: string = "Doctors/Create";
export const doctorActionUpdate: string = "Doctors/Update";
export const doctorActionDelete: string = "Doctors/DeleteById";


export const departmentAction: string = "Departments/GetAll";
export const departmentActionCreate: string = "Departments/Create";
export const departmentActionUpdate: string = "Departments/Update";
export const departmentActionDelete: string = "Departments/DeleteById";


export const patientAction: string = "Patients/GetAll";
export const patientActionGetPatientByIdentityNumber = "Patients/GetPatientByIdentityNumber";
export const patientActionCreate: string = "Patients/Create";
export const patientActionUpdate: string = "Patients/Update";
export const patientActionDelete: string = "Patients/DeleteById";

export const appointmentActionGetAllByDoctorId = "Appointments/GetAllByDoctorId";
export const appointmentActionCreate = "Appointments/Create";
export const appointmentActionUpdate = "Appointments/Update";
export const appointmentActionDelete = "Appointments/DeleteById";

export const userAction: string = "Users/GetAll";
export const userActionCreate: string = "Users/Create";
export const userActionUpdate: string = "Users/Update";
export const userActionDelete: string = "Users/DeleteById";
export const userActionGetAllRoles: string = "Roles/GetAllRoles"
