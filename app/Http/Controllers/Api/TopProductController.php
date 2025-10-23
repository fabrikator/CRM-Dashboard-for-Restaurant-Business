<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TopProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TopProductController extends Controller
{
    public function index(Request $request)
    {
        $range = $request->get('range') ?? 'all';
        $from  = $request->get('from');
        $to    = $request->get('to');

        $today = Carbon::today();
        $start = null;
        $end   = null;

        // === Определяем диапазон ===
        if ($from && $to) {
            $start = Carbon::parse($from);
            $end   = Carbon::parse($to);
        } else {
            switch ($range) {
                case 'yesterday':
                    $start = $today->clone()->subDay();
                    $end   = $today->clone()->subDay();
                    break;

                case '7days':
                    $start = $today->clone()->subDays(6);
                    $end   = $today;
                    break;

                case 'month':
                    $start = $today->clone()->startOfMonth();
                    $end   = $today;
                    break;

                case 'all':
                    // Без ограничений — все данные
                    break;

                case 'today':
                default:
                    $start = $today;
                    $end   = $today;
                    break;
            }
        }

        $q = TopProduct::query();

        if ($start && $end) {
            $q->whereBetween('stat_date', [$start->toDateString(), $end->toDateString()]);
        }

        // === Проверяем, один день или диапазон ===
        $singleDay = false;
        if ($start && $end) {
            $singleDay = $start->toDateString() === $end->toDateString();
        }

        // === Один день (без суммирования) ===
        if ($singleDay) {
            $data = $q->select(
                'product_id',
                // Убираем эмодзи из начала строки
                DB::raw('REGEXP_REPLACE(name, "^[^a-zA-ZА-Яа-я0-9]+", "") as name'),
                'small_photo_url',
                DB::raw('sold_quantity as sold'),
                DB::raw('total_price as revenue')
            )
                ->orderByDesc('sold')
                ->limit(10)
                ->get();

            return response()->json($data);
        }

        // === Период (группировка и суммирование) ===
        $data = $q->select(
            DB::raw('MAX(product_id) as product_id'),
            // Группируем по названию без эмодзи
            DB::raw('REGEXP_REPLACE(name, "^[^a-zA-ZА-Яа-я0-9]+", "") as clean_name'),
            DB::raw('MAX(small_photo_url) as small_photo_url'),
            DB::raw('SUM(sold_quantity) as sold'),
            DB::raw('SUM(total_price) as revenue')
        )
            ->groupBy('clean_name')
            ->orderByDesc('sold')
            ->limit(10)
            ->get();

        // Переименуем ключ clean_name → name для фронта
        $data->transform(function ($item) {
            $item->name = $item->clean_name;
            unset($item->clean_name);
            return $item;
        });

        return response()->json($data);
    }
}
