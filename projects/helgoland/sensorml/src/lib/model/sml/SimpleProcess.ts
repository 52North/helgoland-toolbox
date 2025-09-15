// @ts-nocheck
import { DisplayName } from '../../common/decorators/DisplayName';
import { AbstractProcess } from './AbstractProcess';
import { ProcessMethod } from './ProcessMethod';
import { ProcessMethodProcess } from './ProcessMethodProcess';

export class SimpleProcess
  extends AbstractProcess
  implements ProcessMethodProcess
{
  @DisplayName('Method')
  method: ProcessMethod;

  // getter
  static SCHEMA(): string {
    return 'http://schemas.opengis.net/sensorML/2.0/simple_process.xsd';
  }

  static NAME(): string {
    return 'SimpleProcess';
  }

  override toString() {
    return 'Simple process';
  }
}
