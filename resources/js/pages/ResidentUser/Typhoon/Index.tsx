import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Calendar, CloudRainWind, Droplets, MapPin, Wind } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

const typhoonIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const userLocationIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    className: 'user-location-marker',
});

interface Typhoon {
    name: string;
    lat: number;
    lon: number;
    windSpeed: number;
    pressure: number;
    direction: string;
    category: string;
    affectedAreas: string;
    lastUpdate: string;
}

interface DailyForecast {
    date: string;
    temp: number;
    tempMin: number;
    tempMax: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    pop: number;
}

interface UserLocation {
    lat: number;
    lon: number;
    city: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Typhoon Monitor', href: '/residentuset/typhoon-monitoring' }];

function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position, 11);
    }, [position, map]);
    return null;
}

export default function Index() {
    const [typhoons, setTyphoons] = useState<Typhoon[]>([]);
    const [forecast, setForecast] = useState<DailyForecast[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationError, setLocationError] = useState<string>('');

    const getUserLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    try {
                        const response = await fetch(
                            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY || ''}`,
                        );
                        const data = await response.json();
                        const city = data[0]?.name || 'Your Location';
                        setUserLocation({ lat, lon, city });
                        setLocationError('');
                    } catch {
                        setUserLocation({ lat, lon, city: 'Your Location' });
                    }
                },
                () => {
                    setLocationError('Unable to get your location. Using default location.');
                    setUserLocation({ lat: 14.676, lon: 121.0437, city: 'Quezon City' });
                },
            );
        } else {
            setLocationError('Geolocation not supported. Using default location.');
            setUserLocation({ lat: 14.676, lon: 121.0437, city: 'Quezon City' });
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const typhoonRes = await fetch('/typhoon/data');
            const typhoonData = await typhoonRes.json();
            setTyphoons(typhoonData);

            if (userLocation) {
                const forecastRes = await fetch(`/typhoon/forecast?lat=${userLocation.lat}&lon=${userLocation.lon}`);
                const forecastData = await forecastRes.json();
                setForecast(forecastData);
            } else {
                const forecastRes = await fetch('/typhoon/forecast');
                const forecastData = await forecastRes.json();
                setForecast(forecastData);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, [userLocation]);

    useEffect(() => {
        getUserLocation();
    }, []);

    useEffect(() => {
        if (userLocation) {
            fetchData();
            const interval = setInterval(fetchData, 10 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [userLocation, fetchData]);

    const mapCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lon] : [12.8797, 121.774];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Typhoon Monitor" />
            <div className="flex h-full flex-1 gap-4 overflow-x-auto rounded-xl p-4">
                {/* Sidebar */}
                <div className="w-80 overflow-y-auto bg-white p-4 shadow-lg dark:bg-gray-900">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <CloudRainWind className="mr-2" /> Typhoon Monitoring
                    </h2>

                    {userLocation && (
                        <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{userLocation.city}</span>
                            </div>
                        </div>
                    )}

                    {locationError && (
                        <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/20">{locationError}</div>
                    )}

                    <Button onClick={fetchData} disabled={loading} className="mb-4 w-full">
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>

                    {/* Active Typhoons */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-sm font-semibold text-gray-600 uppercase">Active Typhoons</h3>
                        {typhoons.length === 0 ? (
                            <p className="text-sm text-gray-500">No active typhoons detected.</p>
                        ) : (
                            typhoons.map((typhoon, index) => (
                                <Card key={index} className="mb-4">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">{typhoon.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-1 text-sm">
                                        <p>
                                            <strong>Category:</strong> {typhoon.category}
                                        </p>
                                        <p>
                                            <strong>Wind Speed:</strong> {typhoon.windSpeed} km/h
                                        </p>
                                        <p>
                                            <strong>Pressure:</strong> {typhoon.pressure} hPa
                                        </p>
                                        <p>
                                            <strong>Direction:</strong> {typhoon.direction}
                                        </p>
                                        <p>
                                            <strong>Affected Areas:</strong> {typhoon.affectedAreas}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <strong>Last Update:</strong> {new Date(typhoon.lastUpdate).toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* 7-Day Forecast */}
                    <div>
                        <h3 className="mb-3 flex items-center text-sm font-semibold text-gray-600 uppercase">
                            <Calendar className="mr-2 h-4 w-4" /> 7-Day Forecast
                        </h3>
                        {forecast.length === 0 ? (
                            <p className="text-sm text-gray-500">Loading forecast...</p>
                        ) : (
                            <div className="space-y-2">
                                {forecast.map((day, index) => (
                                    <Card key={index} className="p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                                    alt={day.description}
                                                    className="h-10 w-10"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium">{index === 0 ? 'Today' : day.date}</p>
                                                    <p className="text-xs text-gray-600 capitalize dark:text-gray-400">{day.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">{day.temp}°C</p>
                                                <p className="text-xs text-gray-500">
                                                    {day.tempMin}° / {day.tempMax}°
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-between border-t pt-2 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Droplets className="h-3 w-3" /> {day.pop}%
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Wind className="h-3 w-3" /> {day.windSpeed} km/h
                                            </span>
                                            <span>💦 {day.humidity}%</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Map */}
                <div className="h-full flex-1">
                    <MapContainer center={mapCenter} zoom={6} className="h-full w-full rounded-lg">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {userLocation && <RecenterMap position={[userLocation.lat, userLocation.lon]} />}
                        {userLocation && (
                            <Marker position={[userLocation.lat, userLocation.lon]} icon={userLocationIcon}>
                                <Popup>
                                    <strong>📍 {userLocation.city}</strong>
                                    <br />
                                    Your Current Location
                                </Popup>
                            </Marker>
                        )}
                        {typhoons.map((typhoon, index) => (
                            <Marker key={index} position={[typhoon.lat, typhoon.lon]} icon={typhoonIcon}>
                                <Popup>
                                    <strong>{typhoon.name}</strong>
                                    <br />
                                    Wind: {typhoon.windSpeed} km/h
                                    <br />
                                    Pressure: {typhoon.pressure} hPa
                                    <br />
                                    Direction: {typhoon.direction}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </AppLayout>
    );
}
