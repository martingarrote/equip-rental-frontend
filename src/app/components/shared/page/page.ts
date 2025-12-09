import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Menu} from '../menu/menu';

@Component({
  selector: 'app-page',
  imports: [RouterOutlet, Menu],
  templateUrl: './page.html',
  styleUrl: './page.css',
})
export class PageComponent {

}
