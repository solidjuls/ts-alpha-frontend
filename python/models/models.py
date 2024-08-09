import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Country(Base):
    __tablename__ = "countries"

    id = sa.Column(sa.BigInteger, primary_key=True)
    created_at = sa.Column(sa.TIMESTAMP)
    updated_at = sa.Column(sa.TIMESTAMP)
    tld_code = sa.Column(sa.VARCHAR(255))
    country_name = sa.Column(sa.VARCHAR(255))
    icon = sa.Column(sa.VARCHAR(255))


class RegionalFederation(Base):
    __tablename__ = "RegionalFederations"

    id = sa.Column(sa.VARCHAR(8), primary_key=True)
    name = sa.Column(sa.VARCHAR(255))
    icon = sa.Column(sa.VARCHAR(255))


class City(Base):
    __tablename__ = "cities"

    id = sa.Column(sa.BigInteger, primary_key=True)
    name = sa.Column(sa.VARCHAR(50))
    latitude = sa.Column(sa.Float)
    longitude = sa.Column(sa.Float)
    province = sa.Column(sa.VARCHAR(100))
    timeZoneId = sa.Column(sa.VARCHAR(40))


class User(Base):
    __tablename__ = "users"

    id = sa.Column(sa.BigInteger, primary_key=True)
    name = sa.Column(sa.VARCHAR(255))
    email = sa.Column(sa.VARCHAR(255))
    email_verified_at = sa.Column(sa.VARCHAR(255))
    password = sa.Column(sa.VARCHAR(255))
    remember_token = sa.Column(sa.VARCHAR(255))
    created_at = sa.Column(sa.TIMESTAMP)
    updated_at = sa.Column(sa.TIMESTAMP)
    country_id = sa.Column(sa.BigInteger, sa.ForeignKey(Country.id))
    first_name = sa.Column(sa.VARCHAR(255))
    last_name = sa.Column(sa.VARCHAR(255))
    last_login_at = sa.Column(sa.TIMESTAMP)
    nickname = sa.Column(sa.VARCHAR(50))
    regionalFederationId = sa.Column(
        sa.VARCHAR(8), sa.ForeignKey(RegionalFederation.id)
    )
    cityId = sa.Column(sa.BigInteger, sa.ForeignKey(City.id))
    phoneNumber = sa.Column(sa.VARCHAR(20))
    preferredGamingPlatform = sa.Column(sa.VARCHAR(50))
    preferredGameDuration = sa.Column(sa.VARCHAR(50))
    timeZoneId = sa.Column(sa.VARCHAR(40))


class GameResult(Base):
    __tablename__ = "game_results"

    def __str__(self):
        output = ""
        for c in self.__table__.columns:
            output += "{}: {}\n".format(c.name, getattr(self, c.name))
        return output

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    id = sa.Column(sa.BigInteger, primary_key=True)
    created_at = sa.Column(sa.TIMESTAMP)
    updated_at = sa.Column(sa.TIMESTAMP)
    usa_player_id = sa.Column(sa.BigInteger, sa.ForeignKey(User.id))
    ussr_player_id = sa.Column(sa.BigInteger, sa.ForeignKey(User.id))
    game_type = sa.Column(sa.VARCHAR(255))
    game_code = sa.Column(sa.VARCHAR(255))
    reported_at = sa.Column(sa.TIMESTAMP)
    game_winner = sa.Column(sa.VARCHAR(255))
    end_turn = sa.Column(sa.Integer)
    end_mode = sa.Column(sa.VARCHAR(255))
    game_date = sa.Column(sa.TIMESTAMP)
    video1 = sa.Column(sa.VARCHAR(255))
    video2 = sa.Column(sa.VARCHAR(255))
    video3 = sa.Column(sa.VARCHAR(255))
    reporter_id = sa.Column(sa.BigInteger, sa.ForeignKey(User.id))
