import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'loader-cmp',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() loadingMessage: string;

  constructor() {
  }

  ngOnInit() {
  }

}
