import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import { LocationService } from 'src/app/services/location.service';
import * as pdfLib from "pdf-lib/dist/pdf-lib.min.js";
import download from 'downloadjs';
 
@Component({
  selector: 'app-w8ben-component',
  templateUrl: './w8ben-component.component.html',
  styleUrls: ['./w8ben-component.component.css']
})
export class W8benComponentComponent implements OnInit {
  w8benForm: FormGroup;
  ipaddress:string = '';
  city:string = '';
  state_prov:string = '';
  zipcode:string = '';
  country:string ='';
  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.w8benForm = this.fb.group({
      nameField : new FormControl('', [Validators.required]),
      countryOfCitizenship: new FormControl(''),
      permResidenceAddress: new FormControl('', [Validators.required]),
      cityStateZip: new FormControl('', [Validators.required]),
      Country: new FormControl(''),
      mailingAddress: new FormControl(''),
      mailingAddressCityStateZip: new FormControl(''),
      mailingAddressCountry: new FormControl(''),
      ssnItinSelector: new FormControl(''),
      ssn: new FormControl(''),
      tin: new FormControl(''),
      fTin: new FormControl(''),
      isFtinRequired: new FormControl(false),
      referenceNumber: new FormControl(''),
      doB: new FormControl('', [Validators.required]),
      countryOfResidenceVerification: new FormControl('', [Validators.required]),
      articleAndParagraph: new FormControl(''),
      percentage: new FormControl(''),
      typeOfIncome: new FormControl(''),
      additionalConditions: new FormControl(''),
      certifyCapacityToSign: new FormControl(''),
      signDate: new FormControl(''),
      printNameOfSigner: new FormControl('')
    });
   }
  
  ngOnInit(): void {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let todayUI = yyyy + '-' + mm + '-' + dd;
    var signDate = <FormControl>this.w8benForm.get('signDate');
    signDate.setValue(todayUI);
    this.locationService.getIpAddress().pipe().subscribe(res => {

      this.ipaddress = res['ip'];
      this.locationService.getGEOLocation(this.ipaddress).subscribe(res => {
        this.city = res['city'];
        this.state_prov = res['state_prov'];
        this.zipcode = res['zipcode'];
        this.country = res['country_name'];
        var countryOfCitizenship = <FormControl>this.w8benForm.get('countryOfCitizenship');
        countryOfCitizenship.setValue(this.country);
        var Country = <FormControl>this.w8benForm.get('Country');
        Country.setValue(this.country);
        var countryOfResidenceVerification = <FormControl>this.w8benForm.get('countryOfResidenceVerification');
        countryOfResidenceVerification.setValue(this.country);
        var cityStateZip = <FormControl>this.w8benForm.get('cityStateZip');
        if(this.state_prov != ''){
          cityStateZip.setValue(this.city + ', '+ this.state_prov + ', ' + this.zipcode)
        }else{
          cityStateZip.setValue(this.city + ', ' + this.zipcode)
        }
      });

    });
  }


  async fillForm() {
  
      const formUrl = '/assets/fw8ben.pdf';  
      // Load a PDF with form fields
      const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
      const pdfDoc = await pdfLib.PDFDocument.load(formPdfBytes)
      // Get the form containing all the fields
      const form = pdfDoc.getForm()

      // Get all fields in the PDF by their names
      //PART 1: Identification
      const nameField = form.getTextField('topmostSubform[0].Page1[0].f_1[0]')
      const countryOfCitizenship = form.getTextField('topmostSubform[0].Page1[0].f_2[0]')
      const permResidenceAddress = form.getTextField('topmostSubform[0].Page1[0].f_3[0]')
      const cityStateZip = form.getTextField('topmostSubform[0].Page1[0].f_4[0]')
      const Country = form.getTextField('topmostSubform[0].Page1[0].f_5[0]')
      const mailingAddress = form.getTextField('topmostSubform[0].Page1[0].f_6[0]')
      const mailingAddressCityStateZip = form.getTextField('topmostSubform[0].Page1[0].f_7[0]')
      const mailingAddressCountry = form.getTextField('topmostSubform[0].Page1[0].f_8[0]')
      const ssnOrTin = form.getTextField('topmostSubform[0].Page1[0].f_9[0]')
      const fTin = form.getTextField('topmostSubform[0].Page1[0].f_10[0]')
      const isFtinRequired = form.getCheckBox('topmostSubform[0].Page1[0].c1_01[0]')
      const referenceNumber = form.getTextField('topmostSubform[0].Page1[0].f_11[0]')
      const doB = form.getTextField('topmostSubform[0].Page1[0].f_12[0]')
      //PART 2: Claim of Tax Treaty Benefits
      const countryOfResidenceVerification = form.getTextField('topmostSubform[0].Page1[0].f_13[0]')
      const articleAndParagraph = form.getTextField('topmostSubform[0].Page1[0].f_14[0]')
      const percentage = form.getTextField('topmostSubform[0].Page1[0].f_15[0]')
      const typeOfIncome = form.getTextField('topmostSubform[0].Page1[0].f_16[0]')
      const additionalConditions = form.getTextField('topmostSubform[0].Page1[0].f_18[0]')
      //PART 3: Certification
      const certifyCapacityToSign = form.getCheckBox('topmostSubform[0].Page1[0].c1_02[0]')
      //const unknownField = form.getTextField('topmostSubform[0].Page1[0].f_20[0]')
      const signDate = form.getTextField('topmostSubform[0].Page1[0].Date[0]')
      const printNameOfSigner = form.getTextField('topmostSubform[0].Page1[0].f_21[0]')


      // Fill in the basic info fields
      nameField.setText(this.w8benForm.controls['nameField'].value)
      countryOfCitizenship.setText(this.w8benForm.controls['countryOfCitizenship'].value)
      permResidenceAddress.setText(this.w8benForm.controls['permResidenceAddress'].value)
      cityStateZip.setText(this.w8benForm.controls['cityStateZip'].value)
      Country.setText(this.w8benForm.controls['Country'].value)
      mailingAddress.setText(this.w8benForm.controls['mailingAddress'].value)
      mailingAddressCityStateZip.setText(this.w8benForm.controls['mailingAddressCityStateZip'].value)
      mailingAddressCountry.setText(this.w8benForm.controls['mailingAddressCountry'].value)
      if(this.w8benForm.controls['ssnItinSelector'].value == "SSN"){
        ssnOrTin.setText(this.w8benForm.controls['ssn'].value)
      }else if(this.w8benForm.controls['ssnItinSelector'].value == "ITIN"){
        ssnOrTin.setText(this.w8benForm.controls['tin'].value)
      }else{
        ssnOrTin.setText("n/a")
      }
      fTin.setText(this.w8benForm.controls['fTin'].value)
      if(this.w8benForm.controls['isFtinRequired'].value == true){
        isFtinRequired.check()
      }
      referenceNumber.setText(this.w8benForm.controls['referenceNumber'].value)
      doB.setText(this.w8benForm.controls['doB'].value)

      countryOfResidenceVerification.setText(this.w8benForm.controls['countryOfResidenceVerification'].value)
      articleAndParagraph.setText(this.w8benForm.controls['articleAndParagraph'].value)
      percentage.setText(this.w8benForm.controls['percentage'].value)
      typeOfIncome.setText(this.w8benForm.controls['typeOfIncome'].value)
      additionalConditions.setText(this.w8benForm.controls['additionalConditions'].value)
      if(this.w8benForm.controls['certifyCapacityToSign'].value == true){
        certifyCapacityToSign.check()
      }
      //unknownField.setText('TEST') no idea what is that field, type is wrong (signature?)
      signDate.setText(this.w8benForm.controls['signDate'].value)
      if(this.w8benForm.controls['printNameOfSigner'].value == ''){
        printNameOfSigner.setText(this.w8benForm.controls['nameField'].value)
      }
      else{
        printNameOfSigner.setText(this.w8benForm.controls['printNameOfSigner'].value)
      }


      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save()

			// Trigger the browser to download the PDF document

      download(pdfBytes, "pdf-lib_form_creation_example.pdf", "application/pdf");
    }

}
