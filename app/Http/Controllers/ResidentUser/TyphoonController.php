<?php
namespace App\Http\Controllers\ResidentUser;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TyphoonController extends Controller
{
    public function index()
    {
        return Inertia::render('ResidentUser/Typhoon/Index');
    }

    public function fetchTyphoonData()
    {
        return Cache::remember('typhoon_data', now()->addMinutes(10), function () {
            $apiKey = env('OPENWEATHER_API_KEY');

            $philippineBounds = [
                'minLat' => 5,
                'maxLat' => 21,
                'minLon' => 115,
                'maxLon' => 130,
            ];

            $typhoons = [];

                            // Check current weather conditions in PH for storm activity
            $lat = 12.8797; // PH Center
            $lon = 121.7740;

            try {
                // Using FREE Current Weather API
                $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                    'lat'   => $lat,
                    'lon'   => $lon,
                    'appid' => $apiKey,
                    'units' => 'metric',
                ]);

                if ($response->successful()) {
                    $data      = $response->json();
                    $windSpeed = ($data['wind']['speed'] ?? 0) * 3.6; // m/s to km/h

                    // If strong winds detected (potential storm)
                    if ($windSpeed > 60) {
                        $typhoons[] = [
                            'name'          => 'Weather System Detected',
                            'lat'           => $lat,
                            'lon'           => $lon,
                            'windSpeed'     => round($windSpeed, 1),
                            'pressure'      => $data['main']['pressure'] ?? 0,
                            'direction'     => $this->getWindDirection($data['wind']['deg'] ?? 0),
                            'category'      => $this->categorizeTyphoon($windSpeed),
                            'affectedAreas' => 'Central Philippines',
                            'lastUpdate'    => now()->toISOString(),
                        ];
                    }
                }
            } catch (\Exception $e) {
                Log::error('Typhoon fetch error: ' . $e->getMessage());
            }

            return $typhoons;
        });
    }

    public function fetchWeeklyForecast()
    {
                                        // Get user's coordinates from request
        $lat = request('lat', 14.6760); // Default: Quezon City
        $lon = request('lon', 121.0437);

        $cacheKey = "weekly_forecast_{$lat}_{$lon}";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($lat, $lon) {
            $apiKey = env('OPENWEATHER_API_KEY');

            try {
                // FREE 5-Day/3-Hour Forecast API
                $response = Http::get("https://api.openweathermap.org/data/2.5/forecast", [
                    'lat'   => $lat,
                    'lon'   => $lon,
                    'appid' => $apiKey,
                    'units' => 'metric',
                    'cnt'   => 40, // 5 days worth
                ]);

                if ($response->successful()) {
                    $data         = $response->json();
                    $forecastList = $data['list'] ?? [];

                    // Group by day and calculate daily averages
                    $dailyData = [];

                    foreach ($forecastList as $item) {
                        $date = date('Y-m-d', $item['dt']);

                        if (! isset($dailyData[$date])) {
                            $dailyData[$date] = [
                                'temps'     => [],
                                'humidity'  => [],
                                'windSpeed' => [],
                                'weather'   => $item['weather'][0] ?? [],
                                'pop'       => [],
                                'dt'        => $item['dt'],
                            ];
                        }

                        $dailyData[$date]['temps'][]     = $item['main']['temp'];
                        $dailyData[$date]['humidity'][]  = $item['main']['humidity'];
                        $dailyData[$date]['windSpeed'][] = $item['wind']['speed'];
                        $dailyData[$date]['pop'][]       = ($item['pop'] ?? 0);
                    }

                    // Convert to final format
                    $forecast = [];
                    foreach (array_slice($dailyData, 0, 7) as $date => $dayData) {
                        $temps      = $dayData['temps'];
                        $forecast[] = [
                            'date'        => date('M d, Y', $dayData['dt']),
                            'temp'        => round(array_sum($temps) / count($temps)),
                            'tempMin'     => round(min($temps)),
                            'tempMax'     => round(max($temps)),
                            'humidity'    => round(array_sum($dayData['humidity']) / count($dayData['humidity'])),
                            'windSpeed'   => round((array_sum($dayData['windSpeed']) / count($dayData['windSpeed'])) * 3.6, 1),
                            'description' => $dayData['weather']['description'] ?? 'N/A',
                            'icon'        => $dayData['weather']['icon'] ?? '01d',
                            'pop'         => round((array_sum($dayData['pop']) / count($dayData['pop'])) * 100),
                        ];
                    }

                    return $forecast;
                }
            } catch (\Exception $e) {
                Log::error('Forecast fetch error: ' . $e->getMessage());
                return [];
            }

            return [];
        });
    }

    private function getWindDirection($degrees)
    {
        $directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        $index = round($degrees / 22.5) % 16;
        return $directions[$index];
    }

    private function categorizeTyphoon($windSpeed)
    {
        if ($windSpeed < 62) {
            return 'Tropical Depression';
        }

        if ($windSpeed < 88) {
            return 'Tropical Storm';
        }

        if ($windSpeed < 118) {
            return 'Severe Tropical Storm';
        }

        return 'Typhoon';
    }
}
