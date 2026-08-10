import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn } from '@angular/router';
import { truncate } from 'fs';
import { NzMessageService } from 'ng-zorro-antd/message';

export const AdminDashboardMatch: CanMatchFn = () => {
  const DataAccessLevel = Number(sessionStorage.getItem('__DataAccessLevel__')); // Convert to number
  return DataAccessLevel !== 1; // Return boolean directly
};

export const UserDashboardMatch: CanMatchFn = () => {
  const DataAccessLevel = Number(sessionStorage.getItem('__DataAccessLevel__')); // Convert to number
  return DataAccessLevel === 1; // Return boolean directly
};

export const CustomerAddGuard: CanActivateFn = () => {
  const customerID = sessionStorage.getItem('__customerID__');

  // Handle cases where the value is null, "null", or empty string
  const isCustomerIDValid = customerID && customerID !== 'null' && customerID.trim() !== '' && customerID !==null && customerID !=='NULL';

  return !isCustomerIDValid; // Allow access only if ID is not valid
};
/* export const CustomerProfileMatch: CanMatchFn = () => {
  const customerID = sessionStorage.getItem('__customerID__');
  const DataAccessLevel = sessionStorage.getItem('__DataAccessLevel__');

  // Grant access if admin OR (normal user with a valid customerID)
  return DataAccessLevel === '3' || (DataAccessLevel === '1' && customerID !== null && customerID !== '');
};
 */

export const CustomerProfileMatch: CanMatchFn = () => {
  const message = inject(NzMessageService);

  const customerID = sessionStorage.getItem('__customerID__');
  const DataAccessLevel = sessionStorage.getItem('__DataAccessLevel__');

  // Admin always has access
  if (DataAccessLevel === '3') {
    return true;
  }

  // Normal user without customer ID — show message and block access
  if (DataAccessLevel === '1' && (customerID === 'null' || customerID === '')) {
    message.warning('Please first add your personal information.');
    return false;
  }
  else{
    return true;

  }

}