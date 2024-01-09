import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ROLE } from "./const";

// ADD THIS VALIDATOR
//? Check for More Than one field each time (Check on common ancestor control: FormGroup)
/* Validators for making sure both passwords match to update the password*/
export function MatchPassword(): ValidatorFn{
    return (formGroup: FormGroup): ValidationErrors | null => {
        const password = formGroup.get('password').value;
        const confirmPassword = formGroup.get('confirmPassword').value;
        if(!password || !confirmPassword) return null;
        if(password.length === 0 || confirmPassword.length === 0) return null;
        if(password !== confirmPassword){
            return{
                // Name of the error
                InvalidPassword: {
                    // Contents of the error (JSON Format)
                    message: 'Passwords doesn\'t match',
                }
            }
        }
        return null;
    }
}

/* Validators for making `joining_date` required if registering "ENGINEER || MANAGER" user */
export function isJoiningDateRequired(): ValidatorFn{
    return (formGroup: FormGroup): ValidationErrors | null => {
        const role = formGroup.get('role').value;
        const joining_date = formGroup.get('joining_date').value;
        if(!role) return null;
        if(role == ROLE.CLIENT) return null;
        if(!(role == ROLE.CLIENT) && joining_date == ''){
            return{
                // Name of the error
                InvalidJoiningDate: {
                    // Contents of the error (JSON Format)
                    message: 'Joining Date should be filled',
                }
            }
        }
        return null;
    }
}


export const noNegativeTimeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const days = control.get('day').value;
    const hours = control.get('hour').value;
    const minutes = control.get('minute').value;
    return days >= 0 && hours >= 0 && minutes >= 0 ? null : { 'negativeTimeValue': true };
};


export const atLeastOneFieldValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const days = control.get('day').value;
    const hours = control.get('hour').value;
    const minutes = control.get('minute').value;
    return days || hours || minutes ? null : { 'atLeastOneRequired': true };

};

};

//? Customized to check for ONLY ONE field each time
// Custom validator for checking if the name contains only whitespace
export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    if((control.value || '').length == 0) return null;
    const ContainsWhiteSpaceOnly = (control.value || '').trim().length === 0;
    return ContainsWhiteSpaceOnly ? { 'ContainsWhiteSpaceOnly': true } : null;
}

