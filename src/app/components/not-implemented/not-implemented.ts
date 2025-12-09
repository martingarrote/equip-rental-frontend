import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-implemented',
  templateUrl: './not-implemented.html',
  styleUrls: ['./not-implemented.css'],
})
export class NotImplementedComponent {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
