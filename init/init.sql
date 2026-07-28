CREATE TABLE constants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code NVARCHAR(255),
    text NVARCHAR(500)
);

CREATE TABLE countries (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  tld_code varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  country_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  icon varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id),
  KEY countries_country_name_index (country_name)
) ENGINE=InnoDB AUTO_INCREMENT=253 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cities (
	id bigint unsigned NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL,
	latitude float NOT NULL,
	longitude float NOT NULL,
	province varchar(100) NULL,
	timeZoneId varchar(40) NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE RegionalFederations (
	id varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
	name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
	icon varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE users (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  name varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  email varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  email_verified_at timestamp NULL DEFAULT NULL,
  password varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  remember_token varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  role_id int DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  country_id bigint unsigned DEFAULT NULL,
  first_name varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  last_name varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  last_login_at timestamp NULL DEFAULT NULL,
  regional_federation_id varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  city_id bigint unsigned DEFAULT NULL,
  phone_number varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  preferred_gaming_platform varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  preferred_game_duration varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  timezone_id varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email),
  KEY users_country_id_foreign (country_id),
  KEY users_first_name_index (first_name),
  KEY users_last_name_index (last_name),
  KEY users_city_id_foreign (city_id),
  CONSTRAINT users_city_id_foreign FOREIGN KEY (city_id) REFERENCES cities (id),
  CONSTRAINT users_country_id_foreign FOREIGN KEY (country_id) REFERENCES countries (id)
) ENGINE=InnoDB AUTO_INCREMENT=1524 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE game_results (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  usa_player_id bigint unsigned NOT NULL,
  ussr_player_id bigint unsigned NOT NULL,
  usa_previous_rating int NOT NULL DEFAULT 0,
  ussr_previous_rating int NOT NULL DEFAULT 0,
  game_type varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  game_code varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  reported_at timestamp NOT NULL,
  game_winner varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  end_turn int unsigned DEFAULT NULL,
  end_mode varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  game_date timestamp NOT NULL,
  video1 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  video2 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  video3 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  reporter_id bigint unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  KEY game_results_end_mode_index (end_mode),
  KEY game_results_end_turn_index (end_turn),
  KEY game_results_game_date_index (game_date),
  KEY game_results_game_type_index (game_type),
  KEY game_results_reported_at_index (reported_at),
  KEY game_results_reporter_id_foreign (reporter_id),
  KEY game_results_usa_player_id_foreign (usa_player_id),
  KEY game_results_ussr_player_id_foreign (ussr_player_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ratings_history (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  player_id bigint unsigned NOT NULL,
  rating int NOT NULL DEFAULT 0,
  game_code varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  game_result_id bigint unsigned NOT NULL,
  total_games int NOT NULL DEFAULT 0,
  friendly_games int NOT NULL DEFAULT 0,
  usa_victories int NOT NULL DEFAULT 0,
  usa_losses int NOT NULL DEFAULT 0,
  usa_ties int NOT NULL DEFAULT 0,
  ussr_victories int NOT NULL DEFAULT 0,
  ussr_losses int NOT NULL DEFAULT 0,
  ussr_ties int NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY ratings_history_player_id_game_result_id_unique (player_id,game_result_id),
  KEY ratings_history_game_result_id_foreign (game_result_id),
  KEY ratings_history_player_id_created_at_index (player_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('1', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AC', 'Ascension Island', '🇦🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('2', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AD', 'Andorra', '🇦🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('3', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AE', 'United Arab Emirates', '🇦🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('4', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AF', 'Afghanistan', '🇦🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('5', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AG', 'Antigua and Barbuda', '🇦🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('6', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AI', 'Anguilla', '🇦🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('7', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AL', 'Albania', '🇦🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('8', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AM', 'Armenia', '🇦🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('9', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AO', 'Angola', '🇦🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('10', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AQ', 'Antarctica', '🇦🇶');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('11', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AR', 'Argentina', '🇦🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('12', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AS', 'American Samoa', '🇦🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('13', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AT', 'Austria', '🇦🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('14', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AU', 'Australia', '🇦🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('15', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AW', 'Aruba', '🇦🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('16', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AX', 'Åland Islands', '🇦🇽');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('17', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'AZ', 'Azerbaijan', '🇦🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('18', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BA', 'Bosnia and Herzegovina', '🇧🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('19', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BB', 'Barbados', '🇧🇧');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('20', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BD', 'Bangladesh', '🇧🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('21', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BE', 'Belgium', '🇧🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('22', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BF', 'Burkina Faso', '🇧🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('23', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BG', 'Bulgaria', '🇧🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('24', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BH', 'Bahrain', '🇧🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('25', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BI', 'Burundi', '🇧🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('26', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BJ', 'Benin', '🇧🇯');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('27', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BM', 'Bermuda', '🇧🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('28', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BN', 'Brunei', '🇧🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('29', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BO', 'Bolivia', '🇧🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('30', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BR', 'Brazil', '🇧🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('31', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BS', 'Bahamas', '🇧🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('32', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BT', 'Bhutan', '🇧🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('33', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BW', 'Botswana', '🇧🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('34', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BY', 'Belarus', '🇧🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('35', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BZ', 'Belize', '🇧🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('36', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'BZH', 'Brittany', '🏴󠁦󠁲󠁢󠁲󠁥󠁿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('37', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CA', 'Canada', '🇨🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('38', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CAT', 'Catalonia', '🇦🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('39', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CC', 'Cocos Islands', '🇨🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('40', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CD', 'Democratic Republic of Congo', '🇨🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('41', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CF', 'Central Africa', '🇨🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('42', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CG', 'Congo', '🇨🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('43', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CH', 'Switzerland', '🇨🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('44', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CI', 'Ivory Coast', '🇨🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('45', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CK', 'Cook Islands', '🇨🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('46', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CL', 'Chile', '🇨🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('47', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CM', 'Cameroon', '🇨🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('48', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CN', 'People''s Republic of China', '🇨🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('49', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CO', 'Colombia', '🇨🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('50', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CR', 'Costa Rica', '🇨🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('51', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CU', 'Cuba', '🇨🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('52', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CV', 'Cape Verde', '🇨🇻');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('53', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CW', 'Curaçao', '🇨🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('54', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CX', 'Christmas Islands', '🇨🇽');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('55', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CY', 'Cyprus', '🇨🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('56', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CYMRU', 'Wales', '🏴󠁧󠁢󠁷󠁬󠁳󠁿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('57', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'CZ', 'Czech Republic', '🇨🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('58', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'DE', 'Germany', '🇩🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('59', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'DJ', 'Djibouti', '🇩🇯');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('60', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'DK', 'Denmark', '🇩🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('61', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'DM', 'Dominica', '🇩🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('62', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'DO', 'Dominican Republic', '🇩🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('63', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'DZ', 'Algeria', '🇩🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('64', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'EC', 'Ecuador', '🇪🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('65', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'EE', 'Estonia', '🇪🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('66', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'EG', 'Egypt', '🇪🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('67', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ER', 'Eritrea', '🇪🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('68', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ES', 'Spain', '🇪🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('69', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ET', 'Ethiopia', '🇪🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('70', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'EUS', 'Basque Country', '🇵🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('71', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'FI', 'Finland', '🇫🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('72', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'FJ', 'Fiji', '🇫🇯');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('73', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'FK', 'Falkland Islands', '🇫🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('74', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'FM', 'Micronesia', '🇫🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('75', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'FO', 'Faroe Islands', '🇫🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('76', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'FR', 'France', '🇫🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('77', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'FRL', 'Friesland', '🏴󠁮󠁬󠁦󠁲󠁿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('78', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GA', 'Gabon', '🇬🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('79', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GAL', 'Galicia', '🏴󠁥󠁳󠁧󠁡󠁿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('80', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GD', 'Grenada', '🇬🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('81', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GE', 'Georgia', '🇬🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('82', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GF', 'French Guiana', '🇬🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('83', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GG', 'Guernsey', '🇬🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('84', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GH', 'Ghana', '🇬🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('85', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GI', 'Gibraltar', '🇬🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('86', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GL', 'Greenland', '🇬🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('87', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GM', 'Gambia', '🇬🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('88', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GN', 'Guinea', '🇬🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('89', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GP', 'Guadeloupe', '🇬🇵');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('90', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GQ', 'Equatorial Guinea', '🇬🇶');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('91', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GR', 'Greece', '🇬🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('92', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GS', 'South Georgia and South Sandwich Islands', '🇬🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('93', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GT', 'Guatemala', '🇬🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('94', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GU', 'Guam', '🇬🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('95', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GW', 'Guinea-Bissau', '🇬🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('96', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'GY', 'Guyana', '🇬🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('97', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'HK', 'Hong Kong', '🇭🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('98', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'HM', 'Heard Island and McDonald Islands', '🇭🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('99', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'HN', 'Honduras', '🇭🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('100', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'HR', 'Croatia', '🇭🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('101', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'HT', 'Haiti', '🇭🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('102', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'HU', 'Hungary', '🇭🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('103', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ID', 'Indonesia', '🇮🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('104', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IE', 'Ireland', '🇮🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('105', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IL', 'Israel', '🇮🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('106', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IM', 'Isle of Man', '🇮🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('107', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IN', 'India', '🇮🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('108', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IO', 'British Indian Ocean Territory', '🇮🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('109', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IQ', 'Iraq', '🇮🇶');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('110', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IR', 'Iran', '🇮🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('111', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IS', 'Iceland', '🇮🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('112', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'IT', 'Italy', '🇮🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('113', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'JE', 'Jersey', '🇯🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('114', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'JM', 'Jamaica', '🇯🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('115', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'JO', 'Jordan', '🇯🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('116', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'JP', 'Japan', '🇯🇵');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('117', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KE', 'Kenya', '🇰🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('118', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KG', 'Kyrgyzstan', '🇰🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('119', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KH', 'Cambodia', '🇰🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('120', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KI', 'Kiribati', '🇰🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('121', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KM', 'Comoros', '🇰🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('122', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KN', 'Saint Kitts and Nevis', '🇰🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('123', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KP', 'North Korea', '🇰🇵');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('124', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KR', 'South Korea', '🇰🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('125', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KRD', 'Kurdistan', '🏴󠁩󠁲󠀱󠀶󠁿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('126', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KW', 'Kuwait', '🇰🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('127', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KY', 'Cayman Islands (the)', '🇰🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('128', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'KZ', 'Kazakhstan', '🇰🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('129', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LA', 'Laos', '🇱🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('130', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LB', 'Lebanon', '🇱🇧');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('131', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LC', 'Saint Lucia', '🇱🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('132', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LI', 'Liechtenstein', '🇱🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('133', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LK', 'Sri Lanka', '🇱🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('134', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LR', 'Liberia', '🇱🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('135', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LS', 'Lesotho', '🇱🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('136', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LT', 'Lithuania', '🇱🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('137', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LU', 'Luxembourg', '🇱🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('138', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LV', 'Latvia', '🇱🇻');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('139', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'LY', 'Libya', '🇱🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('140', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MA', 'Morocco', '🇲🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('141', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MC', 'Monaco', '🇲🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('142', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MD', 'Moldova', '🇲🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('143', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ME', 'Montenegro', '🇲🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('144', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MG', 'Madagascar', '🇲🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('145', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MH', 'Marshall Islands', '🇲🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('146', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MK', 'North Macedonia', '🇲🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('147', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ML', 'Mali', '🇲🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('148', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MM', 'Myanmar', '🇲🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('149', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MN', 'Mongolia', '🇲🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('150', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MO', 'Macau', '🇲🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('151', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MP', 'Northern Mariana Islands', '🇲🇵');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('152', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MQ', 'Martinique', '🇲🇶');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('153', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MR', 'Mauritania', '🇲🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('154', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MS', 'Montserrat', '🇲🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('155', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MT', 'Malta', '🇲🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('156', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MU', 'Mauritius', '🇲🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('157', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MV', 'Maldives', '🇲🇻');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('158', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MW', 'Malawi', '🇲🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('159', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MX', 'Mexico', '🇲🇽');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('160', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MY', 'Malaysia', '🇲🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('161', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'MZ', 'Mozambique', '🇲🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('162', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NA', 'Namibia', '🇳🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('163', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NC', 'New Caledonia', '🇳🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('164', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NE', 'Niger', '🇳🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('165', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NF', 'Norfolk Island', '🇳🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('166', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NG', 'Nigeria', '🇳🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('167', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NI', 'Nicaragua', '🇳🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('168', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NL', 'Netherlands', '🇳🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('169', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NO', 'Norway', '🇳🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('170', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NP', 'Nepal', '🇳🇵');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('171', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NR', 'Nauru', '🇳🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('172', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NU', 'Niue', '🇳🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('173', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'NZ', 'New Zealand', '🇳🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('174', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'OM', 'Oman', '🇴🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('175', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PA', 'Panama', '🇵🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('176', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PE', 'Peru', '🇵🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('177', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PF', 'French Polynesia', '🇵🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('178', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PG', 'Papua New Guinea', '🇵🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('179', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PH', 'Philippines', '🇵🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('180', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PK', 'Pakistan', '🇵🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('181', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PL', 'Poland', '🇵🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('182', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PM', 'Saint Pierre and Miquelon', '🇵🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('183', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PN', 'Pitcairn Islands', '🇵🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('184', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PR', 'Puerto Rico', '🇵🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('185', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PS', 'Palestine', '🇵🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('186', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PT', 'Portugal', '🇵🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('187', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PW', 'Palau', '🇵🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('188', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'PY', 'Paraguay', '🇵🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('189', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'QA', 'Qatar', '🇶🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('190', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'QUEBEC', 'Quebec', '🇲🇶');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('191', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'RE', 'Reunion', '🇷🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('192', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'RO', 'Romania', '🇷🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('193', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'RS', 'Serbia', '🇷🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('194', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'RU', 'Russia', '🇷🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('195', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'RW', 'Rwanda', '🇷🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('196', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SA', 'Saudi Arabia', '🇸🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('197', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SB', 'Solomon Islands', '🇸🇧');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('198', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SC', 'Seychelles', '🇸🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('199', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SCOT', 'Scotland', '🏴󠁧󠁢󠁳󠁣󠁴󠁿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('200', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SD', 'Sudan', '🇸🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('201', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SE', 'Sweden', '🇸🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('202', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SG', 'Singapore', '🇸🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('203', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SH', 'Saint Helena', '🇸🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('204', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SI', 'Slovenia', '🇸🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('205', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SK', 'Slovakia', '🇸🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('206', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SL', 'Sierra Leone', '🇸🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('207', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SM', 'San Marino', '🇸🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('208', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SN', 'Senegal', '🇸🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('209', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SO', 'Somalia', '🇸🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('210', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SR', 'Suriname', '🇸🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('211', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SS', 'South Sudan', '🇸🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('212', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ST', 'Sao Tome and Principe', '🇸🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('213', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SV', 'El Salvador', '🇸🇻');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('214', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SX', 'Sint Maarten', '🇸🇽');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('215', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SY', 'Syria', '🇸🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('216', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'SZ', 'Eswatini', '🇸🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('217', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TC', 'Turks and Caicos Islands', '🇹🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('218', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TD', 'Chad', '🇹🇩');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('219', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TF', 'French Southern and Antarctic Lands', '🇹🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('220', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TG', 'Togo', '🇹🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('221', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TH', 'Thailand', '🇹🇭');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('222', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TJ', 'Tajikistan', '🇹🇯');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('223', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TK', 'Tokelau', '🇹🇰');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('224', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TL', 'East Timor', '🇹🇱');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('225', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TM', 'Turkmenistan', '🇹🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('226', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TN', 'Tunisia', '🇹🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('227', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TO', 'Tonga', '🇹🇴');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('228', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TR', 'Turkey', '🇹🇷');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('229', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TT', 'Trinidad and Tobago', '🇹🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('230', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TV', 'Tuvalu', '🇹🇻');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('231', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TW', 'Taiwan', '🇹🇼');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('232', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'TZ', 'Tanzania', '🇹🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('233', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'UA', 'Ukraine', '🇺🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('234', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'UG', 'Uganda', '🇺🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('235', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'UK', 'United Kingdom', '🇬🇧');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('236', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'US', 'United States of America', '🇺🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('237', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'UY', 'Uruguay', '🇺🇾');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('238', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'UZ', 'Uzbekistan', '🇺🇿');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('239', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'VA', 'Vatican City', '🇻🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('240', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'VC', 'Saint Vincent and the Grenadines', '🇻🇨');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('241', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'VE', 'Venezuela', '🇻🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('242', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'VG', 'British Virgin Island', '🇻🇬');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('243', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'VI', 'US Virgin Island', '🇻🇮');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('244', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'VN', 'Vietnam', '🇻🇳');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('245', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'VU', 'Vanuatu', '🇻🇺');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('246', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'WF', 'Wallis and Futuna', '🇼🇫');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('247', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'WS', 'Samoa', '🇼🇸');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('248', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'YE', 'Yemen', '🇾🇪');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('249', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'YT', 'Mayotte', '🇾🇹');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('250', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ZA', 'South Africa', '🇿🇦');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('251', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ZM', 'Zambia', '🇿🇲');
INSERT INTO countries (id,created_at,updated_at,tld_code,country_name,icon) VALUES ('252', '2021-11-12 09:36:00', '2021-11-12 09:36:00', 'ZW', 'Zimbabwe', '🇿🇼');



INSERT INTO constants (text, code) VALUES
('National / Regional League', 'National League'),
('ITSL', 'ITSL'),
('OTSL', 'OTSL'),
('RTSL', 'RTSL'),
('TS Convention', 'TSC'),
('TS World Cup', 'TSWC'),
('Champions League', 'CL'),
('Friendly Game', 'FG'),
('Grand Slam', 'GS');