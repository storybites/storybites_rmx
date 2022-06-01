/* eslint-disable react/jsx-pascal-case */
import { useEffect, useRef } from "react";
import {
  MapContainer as _MapContainer,
  Marker,
  Popup,
  TileLayer as _TileLayer,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import { usePosition } from "use-position";
import lottie from "lottie-web";
import loadingMap from "../../assets/lottie/finding_location.json";

function TileLayer() {
  const map = useMapEvents({
    // moveend: function (a) {
    //     console.log(map.getBounds());
    // },
  });

  // useEffect(() => {
  //     if (map && selectedStory) {
  //         map.flyTo({ lat: selectedStory.lat, lng: selectedStory.long });
  //     }
  // }, [selectedStory]);

  return (
    <_TileLayer
      // attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}
const MapContainer = () => {
  const loadingMapContainer = useRef<any>(null);
  const { latitude, longitude } = usePosition(false);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: loadingMapContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: loadingMap,
    });
  }, []);

  return (
    <>
      {(!latitude || !longitude) && (
        <div className="w-3/4 h-full flex justify-center items-center ml-" style={{marginLeft: "25%"}}>
          <div className="w-2/5 h-2/5" ref={loadingMapContainer}></div>
        </div>
      )}
      {latitude && longitude && (
        <_MapContainer
          center={[latitude, longitude]}
          zoom={15}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer />
          {[].map((story: any) => {
            return (
              <Marker position={[story.lat, story.long]} key={story.id}>
                <Popup>
                  {story.title}
                  <br />
                  {story.summary ?? null}
                </Popup>
              </Marker>
            );
          })}
          <ZoomControl position="bottomright" />
        </_MapContainer>
      )}
    </>
  );
};

export default MapContainer;
