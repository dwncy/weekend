// One map link per plan. Google Maps' "Maps URLs" API takes an origin, a
// destination and up to nine waypoints, so a whole plan opens as a single route
// in plan order instead of one pin per stop. The stop's place is the only
// geocodable fact the content has (the body's "Area: North — JIExpo Kemayoran"),
// so it is used as the query, with "Jakarta" added for context.

export interface MapStop {
  name: string;
  place?: string;
}

/** origin + 9 waypoints + destination — the Maps URLs API limit. */
export const MAX_MAP_STOPS = 11;

/**
 * Maps query for one stop. A place like "Ancol / Pasar Seni / beach area" lists
 * alternatives, so only the first is used: the rest would make the query
 * ungeocodable.
 */
function placeQuery(stop: MapStop): string {
  const query = (stop.place ?? stop.name).split('/')[0].trim();
  if (!query) return '';
  return /jakarta/i.test(query) ? query : `${query}, Jakarta, Indonesia`;
}

/**
 * One Maps link covering every stop of a plan, in plan order. Stops beyond the
 * API limit are dropped; callers warn about that with `MAX_MAP_STOPS`.
 */
export function allStopsMapUrl(stops: MapStop[]): string | undefined {
  const places = stops
    .map(placeQuery)
    .filter((place) => place.length > 0)
    .slice(0, MAX_MAP_STOPS);

  if (!places.length) return undefined;
  if (places.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(places[0])}`;
  }

  const origin = places[0];
  const destination = places[places.length - 1];
  const waypoints = places.slice(1, -1);
  // `|` stays literal: that is the separator the Maps URLs API documents.
  const query = [
    'api=1',
    `origin=${encodeURIComponent(origin)}`,
    ...(waypoints.length ? [`waypoints=${waypoints.map(encodeURIComponent).join('|')}`] : []),
    `destination=${encodeURIComponent(destination)}`,
  ].join('&');

  return `https://www.google.com/maps/dir/?${query}`;
}
