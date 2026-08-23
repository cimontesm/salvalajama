<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('establishment_id')->constrained('establishments')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category');
            $table->decimal('original_price', 8, 2);
            $table->decimal('discounted_price', 8, 2);
            $table->integer('quantity_total');
            $table->integer('quantity_available');
            $table->decimal('estimated_weight_kg', 6, 2)->default(0);
            $table->dateTime('pickup_start');
            $table->dateTime('pickup_end');
            $table->dateTime('expires_at')->nullable();
            $table->string('image_url')->nullable();
            $table->enum('status', ['activo', 'agotado', 'vencido', 'inactivo'])->default('activo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
