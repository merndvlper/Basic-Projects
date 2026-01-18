module universe::space;

use std::string::String;
use universe::version::Version;

const MAX_ORBITS: u64 = 15;

const E_INVALID_ORBIT_ID: u64 = 1;
const E_ORBIT_ALREADY_EXISTS: u64 = 3;
const E_ORBIT_NOT_FOUND: u64 = 4;

public struct Planet has copy, drop, store {
    name: String,
    orbit: u8,
}

public struct Star has copy, drop, store {
    name: String,
    planets: vector<Planet>,
    alive: bool,
    orbit: u8,
}

public struct Galaxy has copy, drop, store {
    name: String,
    stars: vector<Star>,
}

public struct Universe has key {
    id: UID,
    galaxies: vector<Galaxy>,
}

public fun new_planet(name: String, orbit: u8, version: &Version): Planet {
    version.check_is_valid();
    assert!(orbit >= 1 && orbit <= (MAX_ORBITS as u8), E_INVALID_ORBIT_ID);
    Planet {
        name,
        orbit,
    }
}

public fun new_star(name: String, orbit: u8, version: &Version): Star {
    version.check_is_valid();
    assert!(orbit >= 1 && orbit <= (MAX_ORBITS as u8), E_INVALID_ORBIT_ID);
    Star {
        name,
        planets: vector::empty(),
        alive: true,
        orbit,
    }
}

public fun new_galaxy(name: String, version: &Version): Galaxy {
    version.check_is_valid();
    Galaxy {
        name,
        stars: vector::empty(),
    }
}

public fun new_universe(ctx: &mut TxContext, version: &Version): Universe {
    version.check_is_valid();
    Universe {
        id: object::new(ctx),
        galaxies: vector::empty(),
    }
}

fun update_galaxy(galaxy: &mut Galaxy, _star: &mut Star, index: u64) {
    let star_ref = vector::borrow_mut(&mut galaxy.stars, index);

    star_ref.alive = _star.alive;
    star_ref.planets = _star.planets;
}

entry fun create_universe(universe: Universe, version: &Version) {
    version.check_is_valid();
    transfer::share_object(universe);
}

public fun add_planet_on_star(star: &mut Star, planet: Planet, version: &Version) {
    version.check_is_valid();
    let orbitId = planet.orbit;

    let len = vector::length(&star.planets);

    let mut i = 0;
    while (i < len) {
        let existing_orbit = vector::borrow(&star.planets, i);
        assert!(existing_orbit.orbit != orbitId, E_ORBIT_ALREADY_EXISTS);
        i = i+1;
    };

    vector::push_back(&mut star.planets, planet);
}

public fun add_star_on_galaxy(galaxy: &mut Galaxy, star: Star, version: &Version) {
    version.check_is_valid();
    let orbitId = star.orbit;

    let len = vector::length(&galaxy.stars);

    let mut i = 0;
    while (i < len) {
        let existing_orbit = vector::borrow(&galaxy.stars, i);
        assert!(existing_orbit.orbit != orbitId, E_ORBIT_ALREADY_EXISTS);
        i = i + 1;
    };

    vector::push_back(&mut galaxy.stars, star);
}

public fun add_galaxy_on_universe(universe: &mut Universe, galaxy: Galaxy, version: &Version) {
    version.check_is_valid();
    vector::push_back(&mut universe.galaxies, galaxy);
}

public fun kill_star(star: &mut Star, orbitId: u8, galaxy: &mut Galaxy, version: &Version) {
    version.check_is_valid();
    let len = vector::length(&galaxy.stars);
    let mut i = 0;
    let mut orbit_ref = len;
    while (i < len) {
        let star_ref = vector::borrow(&galaxy.stars, i);
        if (star_ref.orbit == orbitId) {
            orbit_ref = i;
        };
        i = i+1;
    };

    assert!(orbit_ref < len, E_ORBIT_NOT_FOUND);

    let len_planets = vector::length(&star.planets);
    let mut j = 0;

    while (j < len_planets) {
        star.planets.pop_back();
        j = j + 1;
    };

    star.alive = false;
    let star_ref = star;
    update_galaxy(galaxy, star_ref, orbit_ref);
}

#[test_only]
public fun star_planets(star: &Star): &vector<Planet> {
    &star.planets
}

#[test_only]
public fun galaxy_stars(galaxy: &Galaxy): &vector<Star> {
    &galaxy.stars
}

#[test_only]
public fun star_is_alive(star: &Star): bool {
    star.alive
}

#[test_only]
public fun galaxy_star_at(galaxy: &Galaxy, index: u64): &Star {
    vector::borrow(&galaxy.stars, index)
}
