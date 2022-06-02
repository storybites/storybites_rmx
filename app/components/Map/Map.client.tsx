/* eslint-disable react/jsx-pascal-case */
import { useEffect, useRef, useState } from "react";
import {
    MapContainer as _MapContainer,
    Marker as _Marker,
    Popup,
    TileLayer as _TileLayer,
    useMap,
    useMapEvents,
    ZoomControl,
} from "react-leaflet";
import { usePosition } from "use-position";
import lottie from "lottie-web";
import loadingMap from "../../assets/lottie/finding_location.json";
import type { Stories } from "@prisma/client";
import { useNavigate, useParams } from "@remix-run/react";
import type { LatLngBounds } from "leaflet";

function TileLayer({ onUpdateLocation }: { onUpdateLocation: (bounds: LatLngBounds) => void }) {
    const map = useMapEvents({
        moveend: function (a) {
            onUpdateLocation(map.getBounds());
        },
    });

    return (
        <_TileLayer
            // attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    );
}

interface IMarker {
    isOpen: boolean;
    story: Stories;
}

const Marker = ({ isOpen, story }: IMarker) => {
    const navigate = useNavigate();
    const map = useMap();

    const [ref, setRef] = useState<any>(null);
    useEffect(() => {
        if (ref) {
            if (isOpen) {
                ref.openPopup();
                map.flyTo({ lat: story.lat, lng: story.long }, 15);
            } else {
                ref.closePopup();
            }
        }
    }, [isOpen, ref]);

    return (
        <_Marker
            position={[story.lat, story.long]}
            key={story.id}
            eventHandlers={{
                click: () => {
                    navigate("/stories/" + story.id);
                },
            }}
            ref={(e) => setRef(e)}
        >
            <Popup>
                {story.title}
                <br />
                {story.summary ?? null}
            </Popup>
        </_Marker>
    );
};
const MapContainer = ({
    stories,
    onUpdateLocation,
}: {
    stories: Stories[];
    onUpdateLocation: (bounds: LatLngBounds) => void;
}) => {
    const loadingMapContainer = useRef<any>(null);
    const { latitude, longitude } = usePosition(false);
    const params = useParams();

    useEffect(() => {
        lottie.loadAnimation({
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
                <div className=" flex h-full w-full items-center justify-center">
                    <div className="hidden w-1/5 sm:block"></div>
                    <div className="h-full w-full sm:h-2/5 sm:w-2/5" ref={loadingMapContainer}></div>
                </div>
            )}
            {latitude && longitude && (
                <_MapContainer center={[latitude, longitude]} zoom={15} scrollWheelZoom={true} zoomControl={false}>
                    <TileLayer onUpdateLocation={onUpdateLocation} />
                    {stories.map((story) => {
                        return <Marker isOpen={params.story === story.id} key={story.id} story={story} />;
                    })}
                    <ZoomControl position="topright" />
                </_MapContainer>
            )}
        </>
    );
};

export default MapContainer;
