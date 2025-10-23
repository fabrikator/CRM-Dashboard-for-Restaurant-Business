<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AveragePaymentAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $range = $request->get('range', 'today');
        $from  = $request->get('from');
        $to    = $request->get('to');

        $today = Carbon::today();
        $start = null;
        $end   = null;

        // --- Определяем диапазон ---
        if ($from && $to) {
            $start = Carbon::parse($from)->startOfDay();
            $end   = Carbon::parse($to)->endOfDay();
        } else {
            switch ($range) {
                case 'yesterday':
                    $start = $today->copy()->subDay();
                    $end   = $today->copy()->subDay();
                    break;
                case '7days':
                    $start = $today->copy()->subDays(6);
                    $end   = $today;
                    break;
                case 'month':
                    $start = $today->copy()->startOfMonth();
                    $end   = $today;
                    break;
                case 'all':
                    $start = null;
                    $end   = null;
                    break;
                case 'today':
                default:
                    $start = $today;
                    $end   = $today;
                    break;
            }
        }

        // --- Получаем данные без группировок и суммирования ---
        $query = DB::table('sales_analytics')
            ->select('stat_date', 'stat_hour', 'platform_data')
            ->orderBy('stat_date')
            ->orderBy('stat_hour');

        if ($start && $end) {
            $query->whereBetween('stat_date', [$start->toDateString(), $end->toDateString()]);
        }

        $rows = $query->get();

        if ($rows->isEmpty()) {
            return response()->json([]);
        }

        // --- Преобразуем platform_data из JSON ---
        $result = $rows->map(function ($row) {
            $platforms = json_decode($row->platform_data, true) ?? [];

            // Для каждой платформы берём averagePaidAmount
            return [
                'date' => $row->stat_date,
                'hour' => sprintf('%02d:00', (int)$row->stat_hour),
                'platforms' => collect($platforms)->map(function ($p) {
                    return [
                        'platformType' => $p['platformType'] ?? null,
                        'averagePaidAmount' => isset($p['averagePaidAmount'])
                            ? (float)$p['averagePaidAmount']
                            : 0,
                    ];
                })->filter(fn($p) => $p['platformType'])->values()->toArray(),
            ];
        });

        return response()->json($result);
    }
}