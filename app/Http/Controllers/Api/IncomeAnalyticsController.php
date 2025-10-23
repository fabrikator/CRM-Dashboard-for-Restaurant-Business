<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IncomeAnalyticsController extends Controller
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
            ->select(
                'stat_date',
                'stat_hour',
                'sales_amount',
                'income_amount',
                'customers_count',
                'average_paid_amount',
                'platform_data'
            )
            ->orderBy('stat_date')
            ->orderBy('stat_hour');

        if ($start && $end) {
            $query->whereBetween('stat_date', [$start->toDateString(), $end->toDateString()]);
        }

        $rows = $query->get();

        if ($rows->isEmpty()) {
            return response()->json([]);
        }

        // --- Преобразуем platform_data ---
        $result = $rows->map(function ($row) {
            return [
                'date' => $row->stat_date,
                'hour' => sprintf('%02d:00', (int)$row->stat_hour),
                'income_amount' => (float)$row->income_amount,
                'platforms' => collect(json_decode($row->platform_data, true) ?? [])->map(function ($p) {
                    return [
                        'platformType' => $p['platformType'] ?? null,
                        'incomeAmount' => (float)($p['incomeAmount'] ?? 0),
                    ];
                })->toArray(),
            ];
        });

        return response()->json($result);
    }
}
