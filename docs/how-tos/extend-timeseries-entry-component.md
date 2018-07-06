# How to extend a timeseries entry component

This tutorial gives a stepwise instruction on how extend a timeseries entry component with a new html-template. This tutorial can be used as a follow up of [Integrate a D3 timeseries component](./integrate-a-d3-timeseries-component.html).

## Step 1: Preparation to add new components

- add `scss` support
  - adjust in `.angular-cli.json` the parameter `defaults.styleExt` from `css` to `scss`

- restucture of the view to have two other divs beside the diagram
  - change `app.component.html` to 
        ```html
        <div class="diagram">
            <n52-d3-timeseries-graph [datasetIds]="datasetIdsMultiple" [selectedDatasetIds]="selectedIds" [datasetOptions]="datasetOptionsMultiple" [timeInterval]="timespan" (onTimespanChanged)="timespanChanged($event)" [graphOptions]="diagramOptionsD3"></n52-d3-timeseries-graph>
        </div>
        <div class="bottom">
            <div class="left">
                <!-- here comes the common timeseries entry component -->
            </div>
            <div class="right">
                <!-- here comes the extended timeseries entry component -->
            </div>
        </div>
        ```
  - rename `app.component.css` to `app.component.scss` and adjust it to
        ```scss
        :host {
            .diagram {
                height: 500px;
                flex: 1;
            }
            .bottom {
                display: flex;
                flex-direction: row;
                .left,
                .right {
                    width: 50%;
                }
            }
        }
        ```
  - adjust the import of the styles in `app.component.ts` to `app.component.scss`

## Step 2: Add existing timeseries entry component to app

- install `@helgoland/depiction` add `HelgolandDatasetlistModule` to import
  - do a
        ```bash
        npm i @helgoland/depiction
        ```
  - add `HelgolandDatasetlistModule` in `app.modul.ts` to the import list therefor you need to import it:
        ```typescript
        import { HelgolandDatasetlistModule } from '@helgoland/depiction';
        ```
  - please check if you use at least typescript v2.6 or greater, otherwise install it with: 
        ```bash
        npm i typescript@~2.6
        ```
- add `SettingsService` to provider
  - create an Injectable `ExtendedSettingsService` which will extend a `SettingsService` in your project and add the missing imports (`SettingsService`, `Settings` of `@helgoland/core` and `Injectable` of `@angular/core`)
        ```typescript
        @Injectable()
        export class ExtendedSettingsService extends SettingsService<Settings> {
            constructor() {
                super();
                this.setSettings({
                // TODO add settings here or load it from somewhere else...
                });
            }
        }
        ```
  - add this `ExtendedSettingsService` in the list of the providers 
        ```typescript
        {
            provide: SettingsService,
            useClass: ExtendedSettingsService
        }
        ```
- add `n52-timeseries-entry` to `app.component.html` (integrate this in the previous created div with the class `left`)
    ```html
    <div>Common timeseries entries</div>
    <div *ngFor="let id of datasetIdsMultiple">
        <n52-timeseries-entry [datasetId]="id" [selected]="isSelected(id)" [datasetOptions]="datasetOptionsMultiple.get(id)" [timeInterval]="timespan" (onSelectDataset)="selectDataset($event, id)"></n52-timeseries-entry>
    </div>
    ```
- add `selectDataset`-method to `AppComponent` class (handles the selection of a dataset triggered inside the timeseries-entry-component)
    ```typescript
    public selectDataset(selected: boolean, id: string) {
        if (selected) {
            this.selectedIds.push(id);
        } else {
            this.selectedIds.splice(this.selectedIds.findIndex((entry) => entry === id), 1);
        }
    }
    ```
- add `isSelected`-method to `AppComponent` class (informs the timeseries-entry-component, if the dataset is selected)
    ```typescript
    public isSelected(id: string) {
        return this.selectedIds.indexOf(id) > -1;
    }
    ```

- with a `ng serve` you should see now the diagram and the listed timeseries entries, by clicking an entry you can highligh it in the diagram

## Step 3: Extend timeseries entry with new template

- add angular-material in version 5 (see also the [here](https://v5.material.angular.io/guide/getting-started))
  - install
        ```bash
        npm i @angular/cdk@^5.0.0 @angular/material@^5.0.0
        ```
  - adjust `app.module.ts` with `MatCardModule` and `MatButtonModule` in the import list and import them from `@angular/material`
  - add a style sheet to `styles.scss`
        ```css
        @import "~@angular/material/prebuilt-themes/indigo-pink.css";
        ```
- create new component `ExtendedTimeseriesEntryComponent` - this will generate a component with a basic template an style sheet. The component is also added to the `app.module.ts` to the `declarations` list
    ```bash
    ng generate component extended-timeseries
    ```
  - adjust `extended-timeseries.component.html` to 
        ```html
        <div style="padding: 5px;">
            <mat-card class="example-card">
                <mat-card-header>
                    <div mat-card-avatar [ngStyle]="{'background-color': datasetOptions.color}" (click)="changeColor();"></div>
                    <mat-card-title>{{phenomenonLabel}} - {{uom}}</mat-card-title>
                    <mat-card-subtitle>{{platformLabel}}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-actions>
                    <button mat-button (click)="toggleSelection()">Highlight</button>
                </mat-card-actions>
            </mat-card>
        </div>
        ```
  - adjust `extended-timeseries.component.ts`
    ```typescript
    export class ExtendedTimeseriesComponent extends TimeseriesEntryComponent {
        public changeColor() {
            this.datasetOptions.color = this.color.getColor();
            this.onUpdateOptions.emit(this.datasetOptions);
        }
    }
    ```

## Step 4: Add new timeseries entry component to app

- add new component `app-extended-timeseries` to `app.component.html` (integrate this in the previous created div with the class `right`)
    ```html
    <div>Extended timeseries entries</div>
    <div *ngFor="let id of datasetIdsMultiple">
        <app-extended-timeseries [datasetId]="id" [selected]="isSelected(id)" [datasetOptions]="datasetOptionsMultiple.get(id)" [timeInterval]="timespan" (onSelectDataset)="selectDataset($event, id)" (onUpdateOptions)="updateOptions($event, id)">
        </app-extended-timeseries>
    </div>
    ```
- add `updateOptions`-method to AppComponent class (this method is bound with the `app-extended-timeseries` component and reacts on dataset option changes)
    ```typescript
    public updateOptions(option: DatasetOptions, id: string) {
        this.datasetOptionsMultiple.set(id, option);
    }
    ```
