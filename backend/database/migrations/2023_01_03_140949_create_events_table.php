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
        Schema::create('events', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('organizer_id')->unsigned();
            $table->integer('client_id')->unsigned();
            $table->enum('status', ['requested', 'waiting-approval', 'requested-actions', 'finished', 'cancelled']);
            $table->string('type');
            $table->integer('number_of_people');
            $table->enum('food_type', ['menu', 'catering']);
            $table->boolean('needs_hotel');
            $table->string('place')->nullable();
            $table->dateTime('date')->nullable();
            $table->float('price_per_person')->nullable();
            $table->float('price_for_food')->nullable();
            $table->float('price_for_hotel')->nullable();
            $table->text('menu_info')->nullable();
            $table->text('place_google_maps_link')->nullable();
            $table->text('place_website_link')->nullable();
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
        Schema::dropIfExists('events');
    }
};
