import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HalLink } from '../types/hal-link';
import { HalIdentifier } from '../types/hal-identifier';
import { environment } from '@env';
import { PerformanceDateVenueCoverageResult } from '../types/performance-date-venue-coverage-result';
import { Identifier } from '../types/identifier';
import * as $ from 'jquery';
import { PlaylistResult } from '../types/playlist-result';

@Injectable({
  providedIn: 'root'
})
export class IdentifierService {
  constructor(private http: HttpClient) { }

  loadLink(halLink: HalLink): Observable<HalIdentifier> {
    return this.http.get<HalIdentifier>(halLink.href);
  }

  public find(id: number): Observable<Identifier> {
    return this.http.get<Identifier>(`${environment.apiUrl}/internet-archive/identifier/${id}`);
  }

  public query(param: object) {
    return this.http.get<HalIdentifier>(`${environment.apiUrl}/internet-archive/identifier?` + $.param(param));
  }

  public findByCreatorAndPerformanceDate(creator: string, performanceDate: string) {
    const params = {
      filter: [
        {
          type: 'innerJoin',
          field: 'creator',
          alias: 'creator'
        },
        {
          type: 'eq',
          field: 'name',
          alias: 'creator',
          value: creator
        },
        {
          type: 'eq',
          field: 'performanceDate',
          value: performanceDate
        }
      ]
    };

    return this.http.get<HalIdentifier>(`${environment.apiUrl}/internet-archive/identifier?` + $.param(params));
  }

  findByYear(creatorId: number, year: number): Observable<PerformanceDateVenueCoverageResult> {
    return this.http.get<PerformanceDateVenueCoverageResult>(
      `${environment.apiUrl}/internet-archive/identifier-performance-date-by-year/${creatorId}/${year}`
    );
  }

  getPlaylist(identifier: Identifier): Observable<PlaylistResult> {
    const shortCircuit: PlaylistResult = {result: []};
    return of(shortCircuit);
    return this.http.get<PlaylistResult>(
      `${environment.apiUrl}/internet-archive/get-playlist/${identifier.archiveIdentifier}`
    );
  }
}
