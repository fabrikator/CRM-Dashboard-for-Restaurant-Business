<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentStatsController extends Controller
{
    public function index(Request $request)
    {
        $range = $request->get('range', 'today');
        $from  = $request->get('from');
        $to    = $request->get('to');

        $today = Carbon::today();
        $start = null;
        $end   = null;

        // --- Определяем диапазон дат ---
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

        // --- Запрос ---
        $query = DB::table('payment_methods_stats')
            ->select('stat_date', 'payment_method_name', 'amount', 'share_percentage', 'platform_data')
            ->orderBy('stat_date');

        if ($start && $end) {
            $query->whereBetween('stat_date', [$start->toDateString(), $end->toDateString()]);
        }

        $rows = $query->get();

        if ($rows->isEmpty()) {
            return response()->json([]);
        }

        // --- Формируем структуру, которая содержит и общие суммы, и платформенные данные ---
        $result = [];

        foreach ($rows as $row) {
            $method = $row->payment_method_name;

            if (!isset($result[$method])) {
                $result[$method] = [
                    'payment_method_name' => $method,
                    'amount' => 0,
                    'share_percentage' => 0,
                    'platform_data' => [
                        'Shop' => 0,
                        'Wolt' => 0,
                        'Pos'  => 0,
                        'Bolt' => 0,
                    ],
                ];
            }

            $result[$method]['amount'] += (float)$row->amount;
            $result[$method]['share_percentage'] += (float)$row->share_percentage;

            $platforms = json_decode($row->platform_data, true) ?? [];
            foreach ($platforms as $p) {
                $type = $p['platformType'] ?? null;
                $amt = (float)($p['amount'] ?? 0);

                if ($type && isset($result[$method]['platform_data'][$type])) {
                    $result[$method]['platform_data'][$type] += $amt;
                }
            }
        }

        // --- Приводим итог ---
        $final = array_values(array_map(function ($item) {
            // усреднение процента
            $item['share_percentage'] = round($item['share_percentage'], 2);
            return $item;
        }, $result));

        return response()->json($final);
    }
}
