import { Identifiable } from './identifiable';

export interface Parameter extends Identifiable {
  id: string;
  label: string;
}
