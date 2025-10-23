<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TopProductController;
use App\Http\Controllers\Api\DeliveryStatsController;
use App\Http\Controllers\Api\PaymentStatsController;
use App\Http\Controllers\Api\SalesAnalyticsController;
use App\Http\Controllers\Api\KpiStatsController;
use App\Http\Controllers\Api\IncomeAnalyticsController;
use App\Http\Controllers\Api\CustomersAnalyticsController;
use App\Http\Controllers\Api\AveragePaymentAnalyticsController;

Route::get('/top-products', [TopProductController::class, 'index']);
Route::get('/delivery-stats', [DeliveryStatsController::class, 'index']);
Route::get('/payment-stats', [PaymentStatsController::class, 'index']);
Route::get('/sales-analytics', [SalesAnalyticsController::class, 'index']);
Route::get('/kpi-stats', [KpiStatsController::class, 'index']);
Route::get('/income-analytics', [IncomeAnalyticsController::class, 'index']);
Route::get('/customers-analytics', [CustomersAnalyticsController::class, 'index']);
Route::get('/average-payment-analytics', [AveragePaymentAnalyticsController::class, 'index']);

