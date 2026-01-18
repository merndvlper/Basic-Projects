#[test_only]
module universe::space_tests;

use std::debug::print;
use std::unit_test::assert_eq;
use sui::test_scenario;
use universe::space::{Self, Universe};
use universe::version::{Self, Version};

const ADMIN: address = @0x12;

#[test]
fun test_add_planet_on_star() {
    let mut scenario = test_scenario::begin(ADMIN);

    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let planet = space::new_planet(b"Planet 1".to_string(), 1, &version);
        let mut star = space::new_star(b"Star 1".to_string(), 2, &version);

        space::add_planet_on_star(&mut star, planet, &version);

        let len = vector::length(space::star_planets(&star));

        assert_eq!(len, 1);
        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
fun test_add_star_on_galaxy() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let star = space::new_star(b"Star 1".to_string(), 1, &version);
        let mut galaxy = space::new_galaxy(b"Galaxy 1".to_string(), &version);

        space::add_star_on_galaxy(&mut galaxy, star, &version);
        let len = vector::length(space::galaxy_stars(&galaxy));
        assert_eq!(len, 1);
        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = space::E_ORBIT_ALREADY_EXISTS)]
fun test_add_same_orbit_ids_for_planets() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let planet_1 = space::new_planet(b"planet 1".to_string(), 1, &version);
        let planet_2 = space::new_planet(b"planet 2".to_string(), 1, &version);

        let mut star = space::new_star(b"Star 1".to_string(), 1, &version);

        space::add_planet_on_star(&mut star, planet_1, &version);
        space::add_planet_on_star(&mut star, planet_2, &version);

        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = space::E_ORBIT_ALREADY_EXISTS)]
fun test_add_same_orbit_ids_for_stars() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let star_1 = space::new_star(b"Star 1".to_string(), 1, &version);
        let star_2 = space::new_star(b"Star 2".to_string(), 1, &version);

        let mut galaxy = space::new_galaxy(b"Galaxy 1".to_string(), &version);

        space::add_star_on_galaxy(&mut galaxy, star_1, &version);
        space::add_star_on_galaxy(&mut galaxy, star_2, &version);

        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = space::E_INVALID_ORBIT_ID)]
fun test_add_star_fails_if_orbit_out_of_range_planets() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let planet = space::new_planet(b"planet 1".to_string(), 0, &version);
        let mut star = space::new_star(b"Star 1".to_string(), 1, &version);

        space::add_planet_on_star(&mut star, planet, &version);

        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = space::E_INVALID_ORBIT_ID)]
fun test_add_star_fails_if_orbit_out_of_range_stars() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let star = space::new_star(b"Star 1".to_string(), 16, &version);
        let mut galaxy = space::new_galaxy(b"Galaxy 1".to_string(), &version);

        space::add_star_on_galaxy(&mut galaxy, star, &version);

        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = space::E_INVALID_ORBIT_ID)]
fun test_limit_planets() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let mut star = space::new_star(b"Star".to_string(), 1, &version);

        let mut i = 1;
        while (i <= 15) {
            let planet = space::new_planet(b"Planet".to_string(), i, &version);
            space::add_planet_on_star(&mut star, planet, &version);
            i = i+ 1;
        };

        let planet_limit = space::new_planet(b"Limit".to_string(), 16, &version);
        space::add_planet_on_star(&mut star, planet_limit, &version);

        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
fun kill_star_test() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let planet = space::new_planet(b"Planet".to_string(), 1, &version);
        let planet_2 = space::new_planet(b"Planet 1".to_string(), 2, &version);

        let mut star = space::new_star(b"Star".to_string(), 1, &version);
        let mut galaxy = space::new_galaxy(b"Galaxy".to_string(), &version);

        space::add_planet_on_star(&mut star, planet, &version);
        space::add_planet_on_star(&mut star, planet_2, &version);

        space::add_star_on_galaxy(&mut galaxy, star, &version);
        space::kill_star(&mut star, 1, &mut galaxy, &version);

        let star_ref = space::galaxy_star_at(&galaxy, 0);
        assert_eq!(space::star_is_alive(star_ref), false);
        assert!(vector::length(space::star_planets(star_ref)) == 0, 1);

        test_scenario::return_shared(version);
    };
    test_scenario::end(scenario);
}

#[test]
fun test_create_universe_and_kill_star() {
    let mut scenario = test_scenario::begin(ADMIN);
    version::init_for_testing(test_scenario::ctx(&mut scenario));
    test_scenario::next_tx(&mut scenario, ADMIN);

    {
        let version = test_scenario::take_shared<Version>(&scenario);
        let ctx = test_scenario::ctx(&mut scenario);
        let mut universe = space::new_universe(ctx, &version);

        let planet = space::new_planet(b"Planet".to_string(), 1, &version);
        let mut star = space::new_star(b"Star".to_string(), 2, &version);
        let mut galaxy = space::new_galaxy(b"Galaxy".to_string(), &version);

        space::add_planet_on_star(&mut star, planet, &version);
        space::add_star_on_galaxy(&mut galaxy, star, &version);
        space::kill_star(&mut star, 2, &mut galaxy, &version);

        space::add_galaxy_on_universe(&mut universe, galaxy, &version);
        space::create_universe(universe, &version);
        test_scenario::return_shared(version);
    };

    test_scenario::next_tx(&mut scenario, ADMIN);
    {
        let universe = test_scenario::take_shared<Universe>(&scenario);
        print(&universe);
        test_scenario::return_shared(universe);
    };

    test_scenario::end(scenario);
}
