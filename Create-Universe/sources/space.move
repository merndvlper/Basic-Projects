module universe::space;

use std::string::String;

#[test_only]
use std::unit_test::assert_eq;

#[test_only]
use sui::test_scenario;

#[test_only]
use std::debug::print;

const MAX_ORBITS: u64 = 15;

const E_INVALID_ORBIT_ID: u64 = 1;
const E_ORBIT_ALREADY_EXISTS: u64 = 3;
const E_ORBIT_NOT_FOUND: u64 = 4;

public struct Planet has copy, drop, store {
    name: String,
    orbit: u8, // u8 tipine dönüştür
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

public fun new_planet(name: String, orbit: u8): Planet {
    assert!(orbit >= 1 && orbit <= (MAX_ORBITS as u8), E_INVALID_ORBIT_ID);
    Planet {
        name,
        orbit,
    }
}

public fun new_star(name: String, orbit: u8): Star {
    assert!(orbit >= 1 && orbit <= (MAX_ORBITS as u8), E_INVALID_ORBIT_ID);
    Star {
        name,
        planets: vector::empty(),
        alive: true,
        orbit,
    }
}

public fun new_galaxy(name: String): Galaxy {
    Galaxy {
        name,
        stars: vector::empty(),
    }
}

fun new_universe(ctx: &mut TxContext): Universe {
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

entry fun create_universe(ctx: &mut TxContext) {
    let universe = new_universe(ctx);
    transfer::share_object(universe);
}

public fun add_planet_on_star(star: &mut Star, planet: Planet) {
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

public fun add_star_on_galaxy(galaxy: &mut Galaxy, star: Star) {
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

public fun add_galaxy_on_universe(universe: &mut Universe, galaxy: Galaxy) {
    vector::push_back(&mut universe.galaxies, galaxy);
}

public fun kill_star(star: &mut Star, orbitId: u8, galaxy: &mut Galaxy) {
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

#[test]
fun test_add_planet_on_star() {
    let planet = new_planet(b"Planet 1".to_string(), 1);
    let mut star = new_star(b"Star 1".to_string(), 2);

    add_planet_on_star(&mut star, planet);

    let len = vector::length(&star.planets);

    assert_eq!(len, 1);
}

#[test]
fun test_add_star_on_galaxy() {
    let star = new_star(b"Star 1".to_string(), 1);
    let mut galaxy = new_galaxy(b"Galaxy 1".to_string());

    add_star_on_galaxy(&mut galaxy, star);
    let len = vector::length(&galaxy.stars);
    assert_eq!(len, 1);
}

#[test]
#[expected_failure(abort_code = E_ORBIT_ALREADY_EXISTS)]
fun test_add_same_orbit_ids_for_planets() {
    let planet_1 = new_planet(b"planet 1".to_string(), 1);
    let planet_2 = new_planet(b"planet 2".to_string(), 1);

    let mut star = new_star(b"Star 1".to_string(), 1);

    add_planet_on_star(&mut star, planet_1);
    add_planet_on_star(&mut star, planet_2);
}

#[test]
#[expected_failure(abort_code = E_ORBIT_ALREADY_EXISTS)]
fun test_add_same_orbit_ids_for_stars() {
    let star_1 = new_star(b"Star 1".to_string(), 1);
    let star_2 = new_star(b"Star 2".to_string(), 1);

    let mut galaxy = new_galaxy(b"Galaxy 1".to_string());

    add_star_on_galaxy(&mut galaxy, star_1);
    add_star_on_galaxy(&mut galaxy, star_2);
}

#[test]
#[expected_failure(abort_code = E_INVALID_ORBIT_ID)]
fun test_add_star_fails_if_orbit_out_of_range_planets() {
    let planet = new_planet(b"planet 1".to_string(), 0);
    let mut star = new_star(b"Star 1".to_string(), 1);

    add_planet_on_star(&mut star, planet);
}

#[test]
#[expected_failure(abort_code = E_INVALID_ORBIT_ID)]
fun test_add_star_fails_if_orbit_out_of_range_stars() {
    let star = new_star(b"Star 1".to_string(), 16);
    let mut galaxy = new_galaxy(b"Galaxy 1".to_string());

    add_star_on_galaxy(&mut galaxy, star);
}

#[test]
#[expected_failure(abort_code = E_INVALID_ORBIT_ID)]
fun test_limit_planets() {
    let mut star = new_star(b"Star".to_string(), 1);

    let mut i = 1;
    while (i <= 15) {
        let planet = new_planet(b"Planet".to_string(), i);
        add_planet_on_star(&mut star, planet);
        i = i+ 1;
    };

    let planet_limit = new_planet(b"Limit".to_string(), 16);
    add_planet_on_star(&mut star, planet_limit);
}

#[test]
fun kill_star_test() {
    let planet = new_planet(b"Planet".to_string(), 1);
    let planet_2 = new_planet(b"Planet 1".to_string(), 2);

    let mut star = new_star(b"Star".to_string(), 1);
    let mut galaxy = new_galaxy(b"Galaxy".to_string());

    add_planet_on_star(&mut star, planet);
    add_planet_on_star(&mut star, planet_2);

    add_star_on_galaxy(&mut galaxy, star);
    kill_star(&mut star, 1, &mut galaxy);

    assert_eq!(galaxy.stars[0].alive, false);
    assert!(vector::length(&galaxy.stars[0].planets) == 0, 1);
}

#[test_only]
const ADMIN: address = @0x12;

#[test]
fun test_create_universe() {
    let mut scenario = test_scenario::begin(ADMIN);
    {
        create_universe(test_scenario::ctx(&mut scenario));
    };
    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let planet = new_planet(b"Planet".to_string(), 1);
        let mut star = new_star(b"Star".to_string(), 2);
        let mut galaxy = new_galaxy(b"Galaxy".to_string());
        add_planet_on_star(&mut star, planet);
        add_star_on_galaxy(&mut galaxy, star);
        kill_star(&mut star, 2, &mut galaxy);
        let mut universe = test_scenario::take_shared<Universe>(&scenario);
        add_galaxy_on_universe(&mut universe, galaxy);
        print(&universe);
        test_scenario::return_shared(universe);
    };

    test_scenario::end(scenario);
}
