CREATE table tournament_types (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  tournament_type_code varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  tournament_type_display_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  
  PRIMARY KEY (id),
  CONSTRAINT tournament_type_code UNIQUE (tournament_type_code)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tournaments (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  tournament_type_id bigint unsigned NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  description TEXT COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL,
  format varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  registration_status varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  spreadsheet_link varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  edition varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  game_duration varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  tournament_status varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  admins JSON,
  
  PRIMARY KEY (id),
  KEY tournaments_tournament_type_id_foreign (tournament_type_id),
  
  CONSTRAINT unique_tournament_type_id_edition UNIQUE (tournament_type_id, edition),
  CONSTRAINT tournaments_tournament_type_id_foreign FOREIGN KEY (tournament_type_id) REFERENCES tournament_types (id)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tournament_schedules (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  tournament_id bigint unsigned NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  usa_player_id bigint unsigned NOT NULL,
  ussr_player_id bigint unsigned NOT NULL,
  game_code varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  game_due_date date NOT NULL,
  
  PRIMARY KEY (id),
  KEY tournament_schedule_tournament_id_foreign (tournament_id),
  KEY tournament_schedule_usa_player_id_foreign (usa_player_id),
  KEY tournament_schedule_ussr_player_id_foreign (ussr_player_id),
  CONSTRAINT unique_tournament_id_game_code UNIQUE (tournament_id, game_code),
  CONSTRAINT tournaments_schedule_tournament_id_foreign FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
  CONSTRAINT tournament_schedule_usa_player_id_foreign FOREIGN KEY (usa_player_id) REFERENCES users (id),
  CONSTRAINT tournament_schedule_ussr_player_id_foreign FOREIGN KEY (ussr_player_id) REFERENCES users (id)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tournament_registrations (
	id bigint unsigned NOT NULL AUTO_INCREMENT,
	tournament_id bigint unsigned NOT NULL,
	created_at timestamp NULL DEFAULT NULL,
	updated_at timestamp NULL DEFAULT NULL,
	user_id bigint unsigned NOT NULL,
	on_waitlist boolean NOT NULL DEFAULT FALSE,

	PRIMARY KEY (id),
	KEY tournament_registrations_tournament_id_foreign (tournament_id),
  KEY tournament_registrations_user_id_foreign (user_id),
  CONSTRAINT unique_tournament_id_user_id UNIQUE (tournament_id, user_id),
  CONSTRAINT tournament_registrations_tournament_id_foreign FOREIGN KEY (tournament_id) REFERENCES tournaments (id),
  CONSTRAINT tournament_registrations_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;