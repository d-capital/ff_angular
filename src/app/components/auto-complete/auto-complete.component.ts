import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'auto-complete',
  templateUrl: 'auto-complete.component.html',
  styleUrls: ['auto-complete.component.css'],
})
export class AutoCompleteComponent implements OnInit {
  @Input() controlName: FormControl;
  @Input() options;
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.controlName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}