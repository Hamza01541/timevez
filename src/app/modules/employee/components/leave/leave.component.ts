import { Component, OnInit } from '@angular/core';
import { AlertService, LoaderService, LeaveService, LocalStorageService } from 'src/app/core/services';
import { Leave } from "src/app/models";
import { Router } from '@angular/router';
import { LeaveType, } from "src/app/models";
import { Constants } from 'src/shared/constants';

@Component({
  selector: 'leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})

export class LeaveComponent implements OnInit {
  leaveTypes: any[];
  leave: Leave;

  // Timepicker Properties
  minfromDate:Date; 
  mintoDate:Date; 

  constructor(
    private alertService: AlertService,
    private router: Router,
    private loaderService: LoaderService,
    private leaveService: LeaveService,
    private storageService: LocalStorageService,
  ) {
    this.leave = new Leave();
  }

  ngOnInit() {
    const user = this.storageService.get(Constants.currentUser);
    this.leave.userId = user.userId;
    this.leaveTypes = [
      { value: LeaveType.casual, name: 'Casual' },
      { value: LeaveType.annual, name: 'Annual' },
    ];

    this.minfromDate = this.getMinDate(new Date(), false);
    this.mintoDate = this.getMinDate(new Date(), false);
  }

  /**
     * Request for Leave 
     * It Submit the object to leave Request endpoint
     */
  leaveRequest() {
if(!this.leave.toDate){
  this.leave.toDate = this.leave.fromDate;
}

    this.leaveService.requestleave(this.leave).subscribe((leave: any) => {
      this.alertService.successToastr(`Requested Leave  Sucessflly`, false);
      this.router.navigate(['/employee/dashboard']);
    }, error => {
      if(error && error.error && error.error.message){
        this.alertService.errorToastr(error.error.message);
      }
    });
  }

  /**
   * On start date selection, sets min date of End date as one day after start date.
   */
  fromDateSelected(){
    this.mintoDate = this.getMinDate(this.leave.fromDate, true);
    this.leave.toDate = null;
  }

  /**
 * Get 1 forward/backward date from given date 
 */
getMinDate(date: any, isForward: boolean): Date{
  const minDate = new Date(date);
 return new Date(minDate.setDate(minDate.getDate() + (isForward ? + 1 : -1)));
}

  /**
   * Get validation classes.
   * @param el Current Element to be validate.
   * @param expectedLength Expected value length
   */
  getValidationClass(el: any, expectedLength:number = 0) {
    if (el.value && typeof el.value === 'string'){
     return {'is-valid': el.valid && el.value.trim().length >= expectedLength, 'is-invalid': (el.invalid || el.value.trim().length < expectedLength) && (el.dirty || el.touched)};
    } else {
      return {'is-valid': el.valid && el.value, 'is-invalid': el.invalid && (el.dirty || el.touched) && (!el.value)};
    }
  }

  /**
   * Show loader
   */
  showLoader() {
    this.loaderService.show();
  }

  /**
   * Hide loader
   */
  hideLoader() {
    this.loaderService.hide();
  }
}
