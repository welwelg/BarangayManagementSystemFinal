# Stage 1: Build React/Inertia Assets
FROM node:20 as frontend
WORKDIR /app
COPY package*.json vite.config.js ./
RUN npm ci
COPY resources/ ./resources/
COPY public/ ./public/
RUN npm run build

# Stage 2: Setup PHP-FPM
FROM php:8.2-fpm
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip curl libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel files
COPY . .

# Copy built assets from Stage 1
COPY --from=frontend /app/public/build ./public/build

# Permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Install PHP packages
RUN composer install --optimize-autoloader --no-dev

EXPOSE 9000
CMD ["php-fpm"]
