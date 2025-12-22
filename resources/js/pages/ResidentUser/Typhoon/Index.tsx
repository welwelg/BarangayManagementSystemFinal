import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, CloudRainWind, Droplets, MapPin, Wind, Menu, X } from 'lucide-react';
import proj4 from 'proj4';
import { useCallback, useEffect, useState } from 'react';

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
    path?: [number, number][];
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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Typhoon Monitor', href: '/residentuser/typhoon-monitoring' }];

const projection = proj4('EPSG:4326', 'EPSG:3857');

const latLonToPixel = (lat: number, lon: number, mapCenter: [number, number], zoom: number, mapWidth: number = 800, mapHeight: number = 600) => {
    const [centerX, centerY] = projection.forward(mapCenter);
    const [x, y] = projection.forward([lon, lat]);
    const scale = (Math.pow(2, zoom) * 256) / (2 * Math.PI * 6378137);
    const pixelX = (x - centerX) * scale + mapWidth / 2;
    const pixelY = (centerY - y) * scale + mapHeight / 2;
    return {
        left: `${(pixelX / mapWidth) * 100}%`,
        top: `${(pixelY / mapHeight) * 100}%`,
    };
};

export default function Index() {
    const [typhoons, setTyphoons] = useState<Typhoon[]>([]);
    const [forecast, setForecast] = useState<DailyForecast[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [locationError, setLocationError] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getUserLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    try {
                        const response = await fetch(
                            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${
                                import.meta.env.VITE_OPENWEATHER_API_KEY || ''
                            }`,
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

    const mapCenter: [number, number] = [10.833, 126.65];
    const zoom = 5;
    const mapWidth = 800;
    const mapHeight = 600;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Typhoon Monitor" />

            <div className="flex h-full flex-1 flex-col gap-4 p-2 sm:p-4 md:flex-row">
                {/* Mobile Toggle Button */}
                <Button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden"
                    size="icon"
                >
                    {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>

                {/* SIDEBAR */}
                <div
                    className={`
                        fixed inset-y-0 left-0 z-40 w-full transform overflow-y-auto bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900
                        sm:w-96
                        md:static md:w-80 md:translate-x-0
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}
                >
                    <div className="mb-4 flex items-center justify-between md:block">
                        <h2 className="flex items-center text-lg font-bold sm:text-xl">
                            <CloudRainWind className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Typhoon Monitoring
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {userLocation && (
                        <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600" />
                                <span className="truncate font-medium">{userLocation.city}</span>
                            </div>
                        </div>
                    )}

                    {locationError && (
                        <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/20">
                            {locationError}
                        </div>
                    )}

                    <Button onClick={fetchData} disabled={loading} className="mb-4 w-full text-sm sm:text-base">
                        {loading ? 'Refreshing...' : 'Refresh Data'}
                    </Button>

                    {/* ACTIVE TYPHOONS */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-xs font-semibold uppercase text-gray-600 sm:text-sm">Active Typhoons</h3>

                        {typhoons.length === 0 ? (
                            <p className="text-sm text-gray-500">No active typhoons detected.</p>
                        ) : (
                            typhoons.map((typhoon, index) => (
                                <Card key={index} className="mb-4">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm sm:text-base">{typhoon.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-1 text-xs sm:text-sm">
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

                    {/* FORECAST */}
                    <div>
                        <h3 className="mb-3 flex items-center text-xs font-semibold uppercase text-gray-600 sm:text-sm">
                            <Calendar className="mr-2 h-4 w-4" /> 7-Day Forecast
                        </h3>

                        {forecast.length === 0 ? (
                            <p className="text-sm text-gray-500">Loading forecast...</p>
                        ) : (
                            <div className="space-y-2">
                                {forecast.map((day, index) => (
                                    <Card key={index} className="p-2 sm:p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <img
                                                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                                    alt={day.description}
                                                    className="h-8 w-8 sm:h-10 sm:w-10"
                                                />
                                                <div>
                                                    <p className="text-xs font-medium sm:text-sm">
                                                        {index === 0 ? 'Today' : day.date}
                                                    </p>
                                                    <p className="text-xs capitalize text-gray-600 dark:text-gray-400">
                                                        {day.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold sm:text-lg">{day.temp}°C</p>
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

                {/* Overlay for mobile when sidebar is open */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* MAP AREA – WINDY EMBED */}
                <div className="relative h-[400px] flex-1 sm:h-[500px] md:h-full">
                    {/* SVG for Typhoon Paths */}
                    <svg className="pointer-events-none absolute inset-0 z-5">
                        {typhoons.map((typhoon, index) => {
                            if (!typhoon.path || typhoon.path.length === 0) return null;

                            const pathCoords = typhoon.path
                                .map(([lon, lat]) => {
                                    const pixel = latLonToPixel(lat, lon, mapCenter, zoom, mapWidth, mapHeight);

                                    const x = (parseFloat(pixel.left) / 100) * mapWidth;
                                    const y = (parseFloat(pixel.top) / 100) * mapHeight;
                                    return `${x},${y}`;
                                })
                                .join(' L ');
                            return <path key={index} d={`M ${pathCoords}`} />;
                        })}
                    </svg>

                    {/* Windy Iframe */}
                    <iframe
                        src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=10.833&lon=126.65&detailLat=14.675711181847326&detailLon=121.23046830296518&detail=true&pressure=true"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        className="rounded-lg"
                        title="Windy Weather Map"
                        allow="geolocation"
                    ></iframe>

                    {/* OVERLAY – USER LOCATION */}
                    {userLocation && (
                        <div
                            className="pointer-events-none absolute z-10 animate-pulse text-xl sm:text-2xl"
                            style={latLonToPixel(userLocation.lat, userLocation.lon, mapCenter, zoom, mapWidth, mapHeight)}
                            title={`📍 ${userLocation.city} - Your Current Location`}
                        >
                            📍
                        </div>
                    )}

                    {/* OVERLAY – TYPHOONS */}
                    {typhoons.map((typhoon, index) => (
                        <div
                            key={index}
                            className="pointer-events-none absolute z-10 animate-spin text-xl sm:text-2xl"
                            style={latLonToPixel(typhoon.lat, typhoon.lon, mapCenter, zoom, mapWidth, mapHeight)}
                            title={`${typhoon.name} - Wind: ${typhoon.windSpeed} km/h, Direction: ${typhoon.direction}`}
                        >
                            🌪️
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
