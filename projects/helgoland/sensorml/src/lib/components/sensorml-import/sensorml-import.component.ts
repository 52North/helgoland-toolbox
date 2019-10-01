import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractProcess } from '../../model/sml';
import { EditorService } from '../../services/EditorService';
import { SensorMLXmlService } from '../../services/SensorMLXmlService';

@Component({
  selector: 'n52-sensorml-import',
  templateUrl: './sensorml-import.component.html',
  styleUrls: ['./sensorml-import.component.css']
})
export class SensormlImportComponent implements OnInit, OnChanges {

  public description: AbstractProcess;
  public error: string;

  @Input()
  public readerResult: string | ArrayBuffer;

  constructor(
    private editorService: EditorService
    ) { }

  ngOnInit() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.readerResult) {
      console.log(changes);
      // this.description = new SensorMLXmlService().deserialize(myReader.result);
    }
  }



  // public openInEditor(): void {
  //   console.log(this.description);
  //   this.editorService.openEditorWithDescription(this.description);
  // }

}
