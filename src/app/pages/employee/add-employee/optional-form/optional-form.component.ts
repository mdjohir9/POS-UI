import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-optional-form',
  templateUrl: './optional-form.component.html',
  styleUrl: './optional-form.component.css'
})
export class OptionalFormComponent {
  avatarUrl: string = "assets/images/avatars/thumbs.png";
  avatarCoverUrl: string = "assets/images/profile-cover.png";
  profileImage: string | null = null; // To store the preview URL for the profile image

  constructor(private msg: NzMessageService) {}

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
  handleChange(info: { file: NzUploadFile }): void {
    this.getBase64(info.file.originFileObj, (img: string) => {
        this.avatarUrl = img;
        localStorage.setItem('avatar', img); // Store the avatar in localStorage
    });
  }



  MaritalStatus = [
    {label: '----Select----', value: 'Married'},
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Widow', value: 'Widow' },
    { label: 'Divorced', value: 'Divorced' },
  ];

  selectedValue = 'Married';


  BloodGroup = [
    {label: '----Select----', value: '0'},
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];
  selectedBlood='0';

  Religion = [
    {label: '----Select----', value: '0'},
    { label: 'Islam', value: 'Islam' },
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Boddho', value: 'Boddho' },
    { label: 'Christan', value: 'Christan' },
    { label: 'others', value: 'others' },

  ];
  SelectedReligion='0';

  Gender = [
    {label: '----Select----', value: '0'},
    { label: 'Male', value: 'Male' },
    { label: 'FeMale', value: 'FeMale' },
    { label: 'Others', value: 'Others' },

  ];
  SelectedGender='0';
  Nationality = [
    {label: '----Select----', value: '0'},
    { label: 'Bngladesh', value: 'Bngladesh' },
    { label: 'India', value: 'India' },
    { label: 'Qatar', value: 'Qatar' },
    { label: 'Nepal', value: 'Nepal' },

  ];
  SelectedNationality='0';
  
}
