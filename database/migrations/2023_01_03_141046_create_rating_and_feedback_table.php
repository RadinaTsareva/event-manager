<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rating_and_feedback', function (Blueprint $table) {
            $table->id();
            $table->integer('event_id');
            $table->float('rating_for_client');
            $table->text('feedback_for_client');
            $table->float('rating_for_organiser');
            $table->text('feedback_for_organiser');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rating_and_feedback');
    }
};
