import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  interval,
  fromEvent,
  merge,
  Observable,
  from,
  combineLatest,
} from 'rxjs';
import {
  scan,
  startWith,
  takeUntil,
  mapTo,
  tap,
  switchMap,
  switchMapTo,
  repeat,
  shareReplay,
} from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  time: number = 0;

  timeMS = {
    timeMM: '00',
    timeSS: '00',
  };

  @ViewChild('start', { static: true }) start!: ElementRef;
  @ViewChild('stop', { static: true }) stop!: ElementRef;
  @ViewChild('wait', { static: true }) wait!: ElementRef;
  @ViewChild('reset', { static: true }) reset!: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    const start$ = fromEvent(this.start.nativeElement, 'click');
    const stop$ = fromEvent(this.stop.nativeElement, 'click');
    const reset$ = fromEvent(this.reset.nativeElement, 'click');

    const interval$: any = interval(10);
    const init = 0;

    start$
      .pipe(
        switchMapTo(interval$),
        startWith(init),
        scan((val: any) => val + 1),
        takeUntil(stop$ || reset$),
        repeat()
      )
      .subscribe(
        (val) => (
          (this.timeMS.timeMM = String(val % 100).padStart(2, '0')),
          (this.timeMS.timeSS = String(Math.floor(val / 100)).padStart(2, '0'))
        ),
        (err) => console.log(err),
        () => (this.time = 0)
      );
  }

  ngOnInit(): void {}
}
