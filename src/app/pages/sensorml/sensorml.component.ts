import { Component, OnInit } from '@angular/core';
import { AbstractProcess, SensorMLXmlService } from '@helgoland/sensorml';

@Component({
  selector: 'n52-sensorml',
  templateUrl: './sensorml.component.html',
  styleUrls: ['./sensorml.component.css']
})
export class SensormlComponent implements OnInit {

  public readerResult: string | ArrayBuffer;
  public error: string;
  public description: AbstractProcess;

  constructor() { }

  ngOnInit() { }

  public changeListener($event): void {
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();

    this.error = null;
    this.readerResult = null;
    this.description = null;


    myReader.onloadend = (e) => {
      try {
        console.log(e);
        console.log(myReader.result);
        this.readerResult = myReader.result;
        this.description = new SensorMLXmlService().deserialize(myReader.result);
      } catch (error) {
        this.error = error.message;
      }
    };

    myReader.readAsText(file);
  }

  public openInEditor(): void {
    console.log(this.description);
  }

}
