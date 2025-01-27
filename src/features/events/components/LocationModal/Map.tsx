import 'leaflet/dist/leaflet.css';
import { Close } from '@mui/icons-material';
import Fuse from 'fuse.js';
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinLocation } from 'utils/types/zetkin';
import { icon, latLng, latLngBounds, Map as MapType } from 'leaflet';

const selectedIcon = icon({
  iconAnchor: [12, 32],
  iconSize: [25, 32],
  iconUrl: '/selectedMarker.png',
});

const basicIcon = icon({
  iconAnchor: [12, 32],
  iconSize: [25, 32],
  iconUrl: '/basicMarker.png',
});

interface MapProps {
  locations: ZetkinLocation[];
  locationId?: number;
  onMapClose: () => void;
  onSelectLocation: (location: ZetkinLocation) => void;
}

const MapProvider = ({
  children,
}: {
  children: (map: MapType) => JSX.Element;
}) => {
  const map = useMap();
  return children(map);
};

const Map: FC<MapProps> = ({
  locations,
  locationId,
  onMapClose,
  onSelectLocation,
}) => {
  const messages = useMessages(messageIds);
  const [searchString, setSearchString] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(
    locationId || undefined
  );

  const bounds = latLngBounds(
    locations.map((location) => [location.lat, location.lng])
  );

  const fuse = new Fuse(locations, {
    keys: ['title'],
    threshold: 0.4,
  });

  const filteredLocations = searchString
    ? fuse.search(searchString).map((fuseResult) => fuseResult.item)
    : locations;

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId
  );

  return (
    <MapContainer
      bounds={
        selectedLocation
          ? latLngBounds([[selectedLocation.lat, selectedLocation.lng]])
          : bounds
      }
      style={{
        height: '80vh',
        width: '100%',
      }}
    >
      <MapProvider>
        {(map) => (
          <>
            <Box
              sx={{
                bottom: selectedLocation ? 1 : undefined,
                display: 'flex',
                justifyContent: 'flex-end',
                justifySelf: 'flex-end',
                margin: 2,
                position: 'absolute',
                right: 1,
                top: 1,
                width: '30%',
                zIndex: 1000,
              }}
            >
              {!selectedLocation && (
                <Autocomplete
                  disableClearable
                  fullWidth
                  onChange={(ev, value) => {
                    const location = locations.find(
                      (location) => location.title === value
                    );
                    if (!location?.lat || !location?.lng) {
                      return;
                    }
                    map.setView(latLng(location.lat, location.lng), 17);
                  }}
                  onInputChange={(ev, value) => {
                    setSearchString(value || '');
                    setSelectedLocationId(
                      locations.find((location) => location.title === value)
                        ?.id || undefined
                    );
                  }}
                  options={locations.map((location) => location.title)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={messages.locationModal.searchBox()}
                      onChange={(ev) => setSearchString(ev.target.value)}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '5px',
                      }}
                    />
                  )}
                />
              )}
              {selectedLocation && (
                <Box
                  padding={2}
                  sx={{
                    backgroundColor: 'white',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h5">
                      {selectedLocation?.title}
                    </Typography>
                    <Close
                      color="secondary"
                      onClick={() => {
                        setSearchString('');
                        setSelectedLocationId(undefined);
                      }}
                      sx={{
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                  {selectedLocation?.info_text && (
                    <Typography color="secondary">
                      {selectedLocation.info_text}
                    </Typography>
                  )}
                  <Box display="flex" justifyContent="flex-end" paddingTop={2}>
                    <Button
                      onClick={() => {
                        onSelectLocation(selectedLocation);
                        onMapClose();
                      }}
                      variant="contained"
                    >
                      {messages.locationModal.useLocation()}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredLocations.map((location) => {
              return (
                <Marker
                  key={location.id}
                  eventHandlers={{
                    click: (evt) => {
                      map.setView(evt.latlng, 17);
                      setSelectedLocationId(location.id);
                    },
                  }}
                  icon={
                    selectedLocationId === location.id
                      ? selectedIcon
                      : basicIcon
                  }
                  position={[location.lat, location.lng]}
                />
              );
            })}
          </>
        )}
      </MapProvider>
    </MapContainer>
  );
};

export default Map;
