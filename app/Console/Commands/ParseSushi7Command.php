<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class ParseSushi7Command extends Command
{
    protected $signature = 'parser:sushi7';
    protected $description = 'Ежедневная синхронизация данных';

    public function handle()
    {
        $this->info('Запуск ежедневной синхронизации...');

        /*$today = Carbon::now('Europe/Tallinn')->toDateString();
        $from = Carbon::now('Europe/Tallinn')->startOfDay()->format('Y-m-d H:i');
        $to = Carbon::now('Europe/Tallinn')->endOfDay()->format('Y-m-d H:i');*/

        // --- вчерашний день ---
        $today = Carbon::now('Europe/Tallinn')->subDay()->toDateString();
        $from  = Carbon::now('Europe/Tallinn')->subDay()->startOfDay()->format('Y-m-d H:i');
        $to    = Carbon::now('Europe/Tallinn')->subDay()->endOfDay()->format('Y-m-d H:i');

        // --- Проверка, выполнялась ли синхронизация сегодня ---
        $exists = DB::table('top_products')->where('stat_date', $today)->exists()
            || DB::table('payment_methods_stats')->where('stat_date', $today)->exists()
            || DB::table('delivery_methods_stats')->where('stat_date', $today)->exists();

        if ($exists) {
            $this->warn("Данные за {$today} уже синхронизированы. Повтор не требуется.");
            return Command::SUCCESS;
        }

        // --- массив проектов ---
        $projects = [
            
        ];

        foreach ($projects as $project) {
            $this->info("Синхронизация проекта: {$project['name']} ({$today})");

            // --- Авторизация ---
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Origin' => $project['origin'],
                'Referer' => $project['referer'],
            ])->withBody(json_encode([
                'username' => trim($project['username']),
                'password' => trim($project['password']),
            ]), 'application/json')->post('https://api-demo.jitmeal.com/v1/access-tokens');

            $json = $response->json();
            $token = $json['accessToken'] ?? null;

            if (!$token) {
                $this->error("Не удалось авторизоваться для {$project['name']}");
                continue;
            }

            $this->info("Авторизация успешна для {$project['name']}");

            // --- Топ товаров ---
            $this->syncTopProducts($project['name'], $token, $today, $from, $to);
            // --- Способы оплаты и доставки ---
            $this->syncSecondPart($project['name'], $token, $today, $from, $to);
            // --- Почасовая аналитика ---
            $this->syncFirstPart($project['name'], $token, $today, $from, $to);
        }

        $this->info('Все проекты синхронизированы успешно');
        return Command::SUCCESS;
    }

    /**
     * --- Топ товаров ---
     */
    protected function syncTopProducts($projectName, $token, $today, $from, $to)
    {
        $this->info("{$projectName}: получаем топ товаров...");

        $response = Http::withToken($token)
            ->acceptJson()
            ->get('https://api-demo.jitmeal.com/v1/analytics/topProductsOptionsNew', [
                'filter.created.from'   => $from,
                'filter.created.to'     => $to,
                'filter.platformTypes'  => ['Wolt', 'Shop', 'Pos', 'Bolt'],
            ]);

        $topProducts = $response->json();

        if (empty($topProducts)) {
            $this->warn("Нет данных по топ товарам для {$projectName}");
            return;
        }

        foreach ($topProducts as $item) {
            $product = $item['product'] ?? [];
            if (empty($product)) continue;

            $name = json_decode($product['name'] ?? '{}', true);
            DB::table('top_products')->updateOrInsert(
                [
                    'product_id' => $product['id'],
                    'stat_date' => $today,
                    'source' => $projectName,
                ],
                [
                    'name' => $name['ru'] ?? null,
                    'small_photo_url' => $product['smallPhotoUrl'] ?? null,
                    'price' => $product['price'] ?? 0,
                    'total_price' => $product['totalPrice'] ?? 0,
                    'tax_id' => $product['taxId'] ?? null,
                    'tax_name' => $product['taxName'] ?? null,
                    'sold_quantity' => $item['soldQuantity'] ?? 0,
                ]
            );
        }

        $this->info("Топ товаров обновлён ({$projectName}) — " . count($topProducts));
    }

    /**
     * --- SecondPart (оплаты и доставки) ---
     */
    protected function syncSecondPart($projectName, $token, $today, $from, $to)
    {
        $this->info("{$projectName}: получаем способы оплаты и доставки...");

        $response = Http::withToken($token)
            ->acceptJson()
            ->get('https://api-demo.jitmeal.com/v1/analytics/secondPart', [
                'filter.created.from'   => $from,
                'filter.created.to'     => $to,
                'filter.platformTypes'  => ['Wolt', 'Shop', 'Pos', 'Bolt'],
            ]);

        $data = $response->json();

        if (empty($data)) {
            $this->warn("Нет данных secondPart для {$projectName}");
            return;
        }

        // --- Доставка ---
        if (!empty($data['orderTypeAnalytics'])) {
            foreach ($data['orderTypeAnalytics'] as $item) {
                DB::table('delivery_methods_stats')->updateOrInsert(
                    [
                        'stat_date' => $today,
                        'order_type' => $item['orderType'] ?? 'Unknown',
                        'source' => $projectName,
                    ],
                    [
                        'amount' => $item['amount'] ?? 0,
                        'share_percentage' => $item['sharePercentage'] ?? 0,
                        'platform_data' => json_encode($item['platformOrderTypeAnalytics'] ?? []),
                    ]
                );
            }
            $this->info("{$projectName}: обновлены способы доставки (" . count($data['orderTypeAnalytics']) . ")");
        }

        // --- Оплата ---
        if (!empty($data['paymentMethodAnalytics'])) {
            foreach ($data['paymentMethodAnalytics'] as $item) {
                DB::table('payment_methods_stats')->updateOrInsert(
                    [
                        'stat_date' => $today,
                        'payment_method_name' => $item['paymentMethodName'] ?? 'Unknown',
                        'source' => $projectName,
                    ],
                    [
                        'amount' => $item['amount'] ?? 0,
                        'share_percentage' => $item['sharePercentage'] ?? 0,
                        'platform_data' => json_encode($item['platformPaymentMethodAnalytics'] ?? []),
                    ]
                );
            }
            $this->info("{$projectName}: обновлены способы оплаты (" . count($data['paymentMethodAnalytics']) . ")");
        }
    }

    /**
     * --- FirstPart (продажи по часам) ---
     */
    protected function syncFirstPart($projectName, $token, $today, $from, $to)
    {
        $this->info("{$projectName}: получаем почасовую аналитику...");

        $resp3 = Http::withToken($token)
            ->acceptJson()
            ->get('https://api-demo.jitmeal.com/v1/analytics/firstPart', [
                'filter.created.from'   => $from,
                'filter.created.to'     => $to,
                'filter.platformTypes'  => ['Wolt', 'Shop', 'Pos', 'Bolt'],
            ]);

        $json = $resp3->json();

        if (empty($json['totalAnalytics'])) {
            $this->warn("Нет данных по продажам (firstPart) для {$projectName}");
            return;
        }

        foreach ($json['totalAnalytics'] as $item) {
            $hour = Carbon::parse($item['date'])->format('H');

            DB::table('sales_analytics')->updateOrInsert(
                [
                    'stat_date' => $today,
                    'stat_hour' => $hour,
                    'source' => $projectName,
                ],
                [
                    'sales_amount' => $item['salesAmount'] ?? 0,
                    'income_amount' => $item['incomeAmount'] ?? 0,
                    'customers_count' => $item['customersCount'] ?? 0,
                    'average_paid_amount' => $item['averagePaidAmount'] ?? 0,
                    'platform_data' => json_encode($item['platformAnalytics'] ?? []),
                ]
            );
        }

        $this->info("{$projectName}: почасовая аналитика обновлена (" . count($json['totalAnalytics']) . ")");
    }
}

