DROP DATABASE IF EXISTS finchcollectorspa;

CREATE DATABASE finchcollectorspa;

CREATE USER finch_admin WITH PASSWORD 'password';

GRANT ALL PRIVILEGES ON DATABASE finchcollectorspa TO finch_admin;


INSERT INTO main_app_finch VALUES
(default, 'Pip', 'zebra finch', 'Loves chirping at sunrise and hopping between branches.', 1),
(default, 'Chirpy', 'gouldian finch', 'Bright and colorful, always singing a sweet tune.', 1),
(default, 'Pebble', 'society finch', 'Loyal companion who enjoys flying in flocks.', 1),
(default, 'Tango', 'spice finch', 'Energetic flyer who never stays in one place for long.', 1),
(default, 'Flint', 'java finch', 'Has a soft spot for shiny objects and millet.', 1),
(default, 'Aurora', 'golden finch', 'Radiates calmness and loves sunbathing.', 1),
(default, 'Scout', 'zebra finch', 'Explorer at heart, always checking out new perches.', 1),
(default, 'Indigo', 'purple finch', 'Sings intricate melodies all morning long.', 1),
(default, 'Maple', 'house finch', 'Enjoys hanging near window sills and watching humans.', 1),
(default, 'Wren', 'green singing finch', 'Dances to the beat of her own chirp.', 1),
(default, 'Nimbus', 'owl finch', 'Quiet and observant, but wise beyond his chirps.', 1),
(default, 'Sunny', 'canary-winged finch', 'Always cheerful and follows the light.', 1);
