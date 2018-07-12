import {Component, OnInit, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  options = {
    theme: 'vs-dark',
    language: 'javascript'
  };
  code = `function hello() {
	 alert('Hello world!');
  }`;
  _editor: any;

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  onInit(editor) {
    this._editor = editor;
    const line = this._editor.getPosition();
    console.log(line);
  }
}
