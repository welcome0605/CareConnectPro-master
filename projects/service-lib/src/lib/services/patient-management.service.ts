import { Injectable } from "@angular/core";
import { Patient } from "model-lib";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, Response, Headers } from "@angular/http";
import { JsonPipe } from "@angular/common";
import { CareConnectLocalStorage } from "./localstorage.service";
import { HttpHeaders } from "@angular/common/http";
import { SelectItem } from "primeng/api";

@Injectable({
  providedIn: "root"
})
export class PatientManagementService {
  private _patientLists: Patient[] = [];
  private _patientViewTypes: SelectItem[];
  public patients: Patient[] = [];

  constructor(
    private http: Http,
    private httpc: HttpClient,
    private localstore: CareConnectLocalStorage
  ) {}

  getTestDataPatients(): Patient[] {
    let patients: Patient[] = [];
    //let patients2: any[] =
    //    [
    //        {
    //            agencyCompanyLocationId: '56768889', companyId: '22203302', gender: 'Male', dateCreated: new Date(),
    //            dateOfBirth: new Date(), firstName: 'John', middleName: 'Kevin', lastName: 'Doe', hicNumber: '100222',
    //            id: '297297202', lastUpdatedDate:new Date(), lastUpdatedUser: '3232342223',
    //            medProgram: [{ id: '8892392', medProgramId: '927222', patientId:'87862892'}],
    //            mrn: '257854335', patientId: '87862892', photoName: '1.jpg',
    //            payee: {
    //                id:'332343', firstName: 'Jane', middleName: 'Ruth', lastName: 'Doe',
    //                ssn: '867-76-7886', patientId: '87862892', companyId: '22203302', dateCreated: new Date(), dateOfBirth: new Date(),
    //                gender: '82782', lastUpdatedDate: new Date(), lastUpdatedUser: '28728', prefix: '4433',
    //                relationship: PatientRelationshipType.spouse,
    //                suffix: '3232', photoName: '1.jpg'
    //            },
    //            prefix: '686577', ssn: '678-98-8766', status: '01', suffix: '7689092',
    //        },
    //        {
    //            agencyCompanyLocationId: '6565778', companyId: '22203302', gender: 'Male', dateCreated: new Date(),
    //            dateOfBirth: new Date(), firstName: 'Paul', middleName: 'Matt', lastName: 'Johnson', hicNumber: '565777',
    //            id: '7658888', lastUpdatedDate: new Date(), lastUpdatedUser: '3232342223',
    //            medProgram: [{ id: '8892392', medProgramId: '927222', patientId: '56777657' }],
    //            mrn: '76789723', patientId: '56777657', photoName: '1.jpg',
    //            payee: {
    //                id: '332347', firstName: 'Paula', middleName: 'Stacy', lastName: 'Johnson',
    //                ssn: '557-96-8553', patientId: '56777657', companyId: '22203302', dateCreated: new Date(), dateOfBirth: new Date(),
    //                gender: '82782', lastUpdatedDate: new Date(), lastUpdatedUser: '28728', prefix: '4433',
    //                relationship: PatientRelationshipType.spouse,
    //                suffix: '3232', photoName: '1.jpg'
    //            },
    //            prefix: '686577', ssn: '567-38-9272', status: '06', suffix: '7689092'
    //        }
    //    ]

    return patients;
  }
}
