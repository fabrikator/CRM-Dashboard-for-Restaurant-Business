<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopProduct extends Model
{
    protected $table = 'top_products';

    protected $fillable = [
        'stat_date',
        'product_id',
        'name',
        'small_photo_url',
        'price',
        'total_price',
        'tax_id',
        'tax_name',
        'sold_quantity',
    ];

    // Laravel по умолчанию ждёт created_at и updated_at поэтому отключаем timestamps
    public $timestamps = false;
}
