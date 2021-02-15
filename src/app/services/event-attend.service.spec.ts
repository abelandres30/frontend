import { TestBed } from '@angular/core/testing';

import { EventAttendService } from './event-attend.service';

describe('EventAttendService', () => {
  let service: EventAttendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventAttendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
