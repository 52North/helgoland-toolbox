// @ts-nocheck
import { AbstractSWEIdentifiable } from '../swe/AbstractSWEIdentifiable';
import { Axis } from './Axis';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * A general spatial Cartesian Reference Frame where the axes and origin will be
 * defined textually relative to a physical component.
 */
export class SpatialFrame extends AbstractSWEIdentifiable {
  /**
   * A textual description of the origin of the reference frame relative to the
   * physical device (e.g. "the origin is at the point of attachment of the
   * sensor to the platform").
   */
  @DisplayName('Origin')
  origin: string;
  /**
   * Axis with name attribute and a textual description of the relationship of
   * the axis to the physical device; the order of the axes listed determines
   * their relationship according to the right-handed rule (e.g. axis 1 cross
   * axis 2 = axis 3).
   */
  @DisplayName('Axis')
  axis: Axis[];

  override toString() {
    return super.toString('Spatial frame');
  }
}
