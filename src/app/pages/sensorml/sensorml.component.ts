import { Component } from '@angular/core';
import { AbstractProcess, SensorMLXmlService } from '@helgoland/sensorml';

@Component({
  selector: 'n52-sensorml',
  templateUrl: './sensorml.component.html',
  styleUrls: ['./sensorml.component.css'],
  imports: [],
})
export class SensormlComponent {
  readerResult!: string;
  error!: string;
  description!: AbstractProcess;

  changeListener($event: any): void {
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      try {
        console.log(e);
        console.log(myReader.result);
        this.readerResult = myReader.result as string;
        this.description = new SensorMLXmlService().deserialize(
          this.readerResult,
        );
      } catch (error: any) {
        this.error = error.message;
      }
    };

    myReader.readAsText(file);
  }

  openInEditor(): void {
    console.log(this.description);
  }
}
