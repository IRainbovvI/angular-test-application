import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  interval,
  fromEvent,
  merge,
  Observable,
  from,
  combineLatest,
  of,
  BehaviorSubject,
  timer,
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
  filter,
  map,
  take,
  bufferTime,
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
    const pause$ = fromEvent(this.wait.nativeElement, 'click');

    const interval$: any = interval(10);
    const init = 0;
    const isActive$ = new BehaviorSubject(true);

    const mainObs$ = start$.pipe(
      switchMapTo(interval$),
      startWith(init),
      scan((val) => (isActive$.getValue() === true ? (this.time += 1) : null)),
      takeUntil(stop$),
      repeat()
    );

    start$.pipe(mapTo(isActive$)).subscribe(() => isActive$.next(true));
    pause$
      .pipe(
        bufferTime(500),
        filter((val) => val.length > 1),
        mapTo(isActive$)
      )
      .subscribe(() => isActive$.next(false));
    stop$.subscribe(
      () => (
        (this.time = 0),
        (this.timeMS.timeMM = String(this.time % 100).padStart(2, '0')),
        (this.timeMS.timeSS = String(Math.floor(this.time / 100)).padStart(
          2,
          '0'
        ))
      )
    );

    combineLatest(mainObs$, isActive$)
      .pipe(
        filter((val: any) => val[1]),
        map((val: any) => val[0])
      )
      .subscribe(
        (val) => (
          (this.timeMS.timeMM = String(this.time % 100).padStart(2, '0')),
          (this.timeMS.timeSS = String(Math.floor(this.time / 100)).padStart(
            2,
            '0'
          ))
        )
      );

    reset$.subscribe(() => (this.time = 0));
  }

  ngOnInit(): void {}
}
