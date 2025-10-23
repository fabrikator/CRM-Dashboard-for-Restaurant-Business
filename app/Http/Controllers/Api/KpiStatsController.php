<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class KpiStatsController extends Controller
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

        // --- Базовый запрос ---
        $query = DB::table('sales_analytics');

        if ($start && $end) {
            $query->whereBetween('stat_date', [
                $start->toDateString(),
                $end->toDateString()
            ]);
        }

        // --- Получаем агрегаты ---
        $totals = $query
            ->selectRaw('
                SUM(sales_amount) as total_sales,
                SUM(income_amount) as total_income,
                SUM(customers_count) as total_customers,
                AVG(average_paid_amount) as avg_payment
            ')
            ->first();

        return response()->json([
            'sales' => round($totals->total_sales ?? 0, 2),
            'income' => round($totals->total_income ?? 0, 2),
            'customers' => (int)($totals->total_customers ?? 0),
            'avg_payment' => round($totals->avg_payment ?? 0, 2),
        ]);
    }
}
