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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('max_count_blacklists_in')->default(4);
            $table->enum('gender', ['female', 'male', 'none'])->default('none');
            $table->boolean('blocked')->default(false);
            $table->enum('role', ['client', 'organizer', 'admin']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('max_count_blacklists_in');
            $table->dropColumn('gender');
            $table->dropColumn('blocked');
            $table->dropColumn('role');
        });
    }
};
