<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Планировщик задач.
     */
    protected function schedule(Schedule $schedule)
    {
        // Ежедневно в 23:00 по Талину запускать синхронизацию данных с api-demo.jitmeal.com
        $schedule->command('parser:sushi7')
            ->dailyAt('23:00')
            ->timezone('Europe/Tallinn')
            ->withoutOverlapping(); // не запустится второй раз, если первый еще идёт
    }

    /**
     * Регистрация консольных команд.
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
    }
}
