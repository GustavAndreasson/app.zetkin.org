import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  eventLoad,
  eventLoaded,
  eventsLoad,
  eventsLoaded,
  eventUpdate,
  eventUpdated,
  locationsLoad,
  locationsLoaded,
  participantsLoad,
  participantsLoaded,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinLocation,
} from 'utils/types/zetkin';

export type ZetkinEventPatchBody = Partial<
  Omit<
    ZetkinEvent,
    'id' | 'activity' | 'campaign' | 'location' | 'organization'
  >
> & {
  activity_id?: number;
  campaign_id?: number;
  location_id?: number;
  organization_id?: number;
};

export default class EventsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  getAllEvents(orgId: number): IFuture<ZetkinEvent[]> {
    const state = this._store.getState();

    return loadListIfNecessary(state.events.eventList, this._store, {
      actionOnLoad: () => eventsLoad(),
      actionOnSuccess: (events) => eventsLoaded(events),
      loader: () =>
        this._apiClient.get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`),
    });
  }

  getEvent(orgId: number, id: number): IFuture<ZetkinEvent> {
    const state = this._store.getState();
    const item = state.events.eventList.items.find((item) => item.id == id);

    if (!item || shouldLoad(item)) {
      this._store.dispatch(eventLoad(id));
      const promise = this._apiClient
        .get<ZetkinEvent>(`/api/orgs/${orgId}/actions/${id}`)
        .then((event) => {
          this._store.dispatch(eventLoaded(event));
          return event;
        });
      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(item);
    }
  }

  getEventParticipants(
    orgId: number,
    eventId: number
  ): IFuture<ZetkinEventParticipant[]> {
    const state = this._store.getState();
    const list = state.events.participantsByEventId[eventId];

    return loadListIfNecessary(list, this._store, {
      actionOnLoad: () => participantsLoad(eventId),
      actionOnSuccess: (participants) =>
        participantsLoaded([eventId, participants]),
      loader: () =>
        this._apiClient.get<ZetkinEventParticipant[]>(
          `/api/orgs/${orgId}/actions/${eventId}/participants`
        ),
    });
  }

  getLocations(orgId: number): IFuture<ZetkinLocation[]> {
    const state = this._store.getState();
    const locationsList = state.events.locationList;

    return loadListIfNecessary(locationsList, this._store, {
      actionOnLoad: () => locationsLoad(),
      actionOnSuccess: (data) => locationsLoaded(data),
      loader: () =>
        this._apiClient.get<ZetkinLocation[]>(`/api/orgs/${orgId}/locations`),
    });
  }

  updateEvent(orgId: number, eventId: number, data: ZetkinEventPatchBody) {
    this._store.dispatch(eventUpdate([eventId, Object.keys(data)]));
    this._apiClient
      .patch<ZetkinEvent>(`/api/orgs/${orgId}/actions/${eventId}`, data)
      .then((event) => {
        this._store.dispatch(eventUpdated(event));
      });
  }
}
