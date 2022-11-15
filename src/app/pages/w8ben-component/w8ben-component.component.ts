import { Component, OnInit } from '@angular/core';
import * as pdfLib from "pdf-lib/dist/pdf-lib.min.js";
import download from 'downloadjs';
 
@Component({
  selector: 'app-w8ben-component',
  templateUrl: './w8ben-component.component.html',
  styleUrls: ['./w8ben-component.component.css']
})
export class W8benComponentComponent implements OnInit {

  constructor() { }
  
  ngOnInit(): void {
    //const formUrl = 'https://www.irs.gov/pub/irs-pdf/fw8ben.pdf';
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
      /*const countryOfCitizenship = form.getTextField('topmostSubform[0].Page1[0].f_2[0]')
      const permResidenceAddress = form.getTextField('topmostSubform[0].Page1[0].f_3[0]')
      const cityStateZip = form.getTextField('topmostSubform[0].Page1[0].f_4[0]')
      const Country = form.getTextField('topmostSubform[0].Page1[0].f_5[0]')
      const mailingAddress = form.getTextField('topmostSubform[0].Page1[0].f_6[0]')
      const mailingAddressCityStateZip = form.getTextField('topmostSubform[0].Page1[0].f_7[0]')

      const ssnOrTin = form.getTextField('topmostSubform[0].Page1[0].f_8[0]')
      const fTin = form.getTextField('topmostSubform[0].Page1[0].f_9[0]')
      const isFtinRequired = form.getTextField('topmostSubform[0].Page1[0].f_10[0]')
      const referenceNumber = form.getTextField('topmostSubform[0].Page1[0].c1_01[0]')
      const doB = form.getTextField('topmostSubform[0].Page1[0].f_11[0]')
      //PART 2: Claim of Tax Treaty Benefits
      const countryOfResidenceVerification = form.getTextField('topmostSubform[0].Page1[0].f_12[0]')
      const articleAndParagraph = form.getTextField('topmostSubform[0].Page1[0].f_13[0]')
      const percentage = form.getTextField('topmostSubform[0].Page1[0].f_14[0]')
      const typeOfIncome = form.getTextField('topmostSubform[0].Page1[0].f_15[0]')
      const additionalConditions = form.getTextField('topmostSubform[0].Page1[0].f_16[0]')
      //PART 3: Certification
      const certifyCapacityToSign = form.getTextField('topmostSubform[0].Page1[0].f_20[0]')
      const signDate = form.getTextField('topmostSubform[0].Page1[0].Date[0]')
      const printNameOfSigner = form.getTextField('topmostSubform[0].Page1[0].f_21[0]')     
      */

      // Fill in the basic info fields
      nameField.setText('Not Exactly Mario')

      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save()

			// Trigger the browser to download the PDF document

      download(pdfBytes, "pdf-lib_form_creation_example.pdf", "application/pdf");
    }

}
