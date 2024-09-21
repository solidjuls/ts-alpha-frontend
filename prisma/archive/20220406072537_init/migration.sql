-- CreateTable
CREATE TABLE `countries` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `tld_code` VARCHAR(255) NOT NULL,
    `country_name` VARCHAR(255) NOT NULL,
    `icon` VARCHAR(255) NULL,

    INDEX `countries_country_name_index`(`country_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_results` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `usa_player_id` BIGINT UNSIGNED NOT NULL,
    `ussr_player_id` BIGINT UNSIGNED NOT NULL,
    `game_type` VARCHAR(255) NOT NULL,
    `game_code` VARCHAR(255) NOT NULL,
    `reported_at` TIMESTAMP(0) NOT NULL,
    `game_winner` VARCHAR(255) NOT NULL,
    `end_turn` INTEGER UNSIGNED NULL,
    `end_mode` VARCHAR(255) NULL,
    `game_date` TIMESTAMP(0) NOT NULL,
    `video1` VARCHAR(255) NULL,
    `video2` VARCHAR(255) NULL,
    `video3` VARCHAR(255) NULL,
    `reporter_id` BIGINT UNSIGNED NULL,

    INDEX `game_results_end_mode_index`(`end_mode`),
    INDEX `game_results_end_turn_index`(`end_turn`),
    INDEX `game_results_game_date_index`(`game_date`),
    INDEX `game_results_game_type_index`(`game_type`),
    INDEX `game_results_reported_at_index`(`reported_at`),
    INDEX `game_results_reporter_id_foreign`(`reporter_id`),
    INDEX `game_results_usa_player_id_foreign`(`usa_player_id`),
    INDEX `game_results_ussr_player_id_foreign`(`ussr_player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `password_resets_email_index`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `personal_access_tokens_token_unique`(`token`),
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type`, `tokenable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ratings_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `player_id` BIGINT UNSIGNED NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `game_code` VARCHAR(255) NOT NULL,
    `game_result_id` BIGINT UNSIGNED NOT NULL,
    `total_games` INTEGER NOT NULL DEFAULT 0,
    `friendly_games` INTEGER NOT NULL DEFAULT 0,
    `usa_victories` INTEGER NOT NULL DEFAULT 0,
    `usa_losses` INTEGER NOT NULL DEFAULT 0,
    `usa_ties` INTEGER NOT NULL DEFAULT 0,
    `ussr_victories` INTEGER NOT NULL DEFAULT 0,
    `ussr_losses` INTEGER NOT NULL DEFAULT 0,
    `ussr_ties` INTEGER NOT NULL DEFAULT 0,

    INDEX `ratings_history_game_result_id_foreign`(`game_result_id`),
    INDEX `ratings_history_player_id_created_at_index`(`player_id`, `created_at`),
    UNIQUE INDEX `ratings_history_player_id_game_result_id_unique`(`player_id`, `game_result_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_game_stats` (
    `player_id` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `rating` INTEGER NOT NULL DEFAULT 5000,
    `total_games` INTEGER NOT NULL DEFAULT 0,
    `friendly_games` INTEGER NOT NULL DEFAULT 0,
    `usa_victories` INTEGER NOT NULL DEFAULT 0,
    `usa_losses` INTEGER NOT NULL DEFAULT 0,
    `usa_ties` INTEGER NOT NULL DEFAULT 0,
    `ussr_victories` INTEGER NOT NULL DEFAULT 0,
    `ussr_losses` INTEGER NOT NULL DEFAULT 0,
    `ussr_ties` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `country_id` BIGINT UNSIGNED NULL,
    `first_name` VARCHAR(255) NULL,
    `last_name` VARCHAR(255) NULL,
    `last_login_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    INDEX `users_country_id_foreign`(`country_id`),
    INDEX `users_first_name_index`(`first_name`),
    INDEX `users_last_name_index`(`last_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_reporter_id_foreign` FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_usa_player_id_foreign` FOREIGN KEY (`usa_player_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `game_results` ADD CONSTRAINT `game_results_ussr_player_id_foreign` FOREIGN KEY (`ussr_player_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ratings_history` ADD CONSTRAINT `ratings_history_game_result_id_foreign` FOREIGN KEY (`game_result_id`) REFERENCES `game_results`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ratings_history` ADD CONSTRAINT `ratings_history_player_id_foreign` FOREIGN KEY (`player_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_game_stats` ADD CONSTRAINT `user_game_stats_player_id_foreign` FOREIGN KEY (`player_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_country_id_foreign` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
