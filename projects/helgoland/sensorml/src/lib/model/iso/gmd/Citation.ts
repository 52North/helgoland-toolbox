// @ts-nocheck
import { DisplayName } from '../../../common/decorators/DisplayName';
import { Identifier } from './Identifier';
import { IsoDate } from './IsoDate';
import { PresentationForm } from './PresentationForm';
import { ResponsibleParty } from './ResponsibleParty';
import { Series } from './Series';

export class Citation {
  @DisplayName('Title')
  title: string;

  @DisplayName('Alternative title')
  alternateTitle: string[];

  @DisplayName('Date')
  date: IsoDate;

  @DisplayName('Edition')
  edition: string;

  @DisplayName('Edition date')
  editionDate: Date;

  @DisplayName('Identifier')
  identifier: Identifier;

  @DisplayName('Cited responsible party')
  citedResponsibleParty: ResponsibleParty[];

  @DisplayName('Presentation form')
  presentationForm: PresentationForm[];

  @DisplayName('Series')
  series: Series;

  @DisplayName('Other citation details')
  otherCitationDetais: string;

  @DisplayName('Collective title')
  collectiveTitle: string;

  @DisplayName('ISBN')
  isbn: string;

  @DisplayName('ISSN')
  issn: string;

  toString() {
    return 'Citation';
  }
}
