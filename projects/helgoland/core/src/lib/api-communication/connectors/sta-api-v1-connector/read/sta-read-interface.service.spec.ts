import { TranslateTestingModule } from "../../../../../../../../testing/translate.testing.module";
import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { HttpService } from "../../../../dataset-api/http.service";
import { InternalIdHandler } from "../../../../dataset-api/internal-id-handler.service";
import { SplittedDataDatasetApiInterface } from "../../../../dataset-api/splitted-data-api-interface.service";
import { StaDeleteInterfaceService } from "../delete/sta-delete-interface.service";
import { StaInsertInterfaceService } from "../insert/sta-insert-interface.service";
import { StaReadInterfaceService } from "./sta-read-interface.service";

const staUrl = "http://docker.srv.int.52north.org:8081/sta/";
const fluggs = "https://fluggs.wupperverband.de/sws5/api/";

describe("StaImplInterfaceService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      TranslateTestingModule
    ],
    providers: [
      HttpService,
      StaReadInterfaceService,
      StaDeleteInterfaceService,
      StaInsertInterfaceService,
      SplittedDataDatasetApiInterface,
      InternalIdHandler
    ]
  }));

  it("should be created", () => {
    const service: StaReadInterfaceService = TestBed.inject(StaReadInterfaceService);
    expect(service).toBeTruthy();
  });

  it("should fetch things", () => {
    const read: StaReadInterfaceService = TestBed.inject(StaReadInterfaceService);
    expect(read).toBeTruthy();
  });
});
