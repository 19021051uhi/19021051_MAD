import { TestBed } from '@angular/core/testing';

import { RoomchatService } from './roomchat.service';

describe('RoomchatService', () => {
  let service: RoomchatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomchatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
