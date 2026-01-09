module universe::space;

use std::string::String;
use std::vector;
const MAX_ORBITS: u64 = 15;
const E_INVALID_ORBIT_ID: u64 = 1;
const E_ORBIT_LIMIT_EXCEEDED: u64 = 2;
const E_ORBIT_ALREADY_EXISTS: u64 = 3;


public struct Planet has copy, drop, store{
    name: String,
    orbit: vector<u8>
}

public struct Star has copy, drop, store{
    name: String,
    planets: vector<Planet>,
    alive: bool,
    orbit: vector<u8>
}

public struct Galaxy has copy, drop, store{
    name: String,
    stars: vector<Star>
}

fun new_planet(name: String):Planet{
    Planet{
        name,
        orbit: vector::empty(),
    }
}


fun new_star( name: String): Star{
    Star{
        name,
        planets: vector::empty(),
        alive: true,
        orbit: vector::empty(),
    }
} 

fun new_galaxy(name: String): Galaxy{
    Galaxy{
        name,
        stars: vector::empty(),
    }
}

fun add_planet_on_star(star: &mut Star, orbitId: u8, planet: Planet){
    let mut planet = planet;
    assert!(orbitId >= 1 && orbitId <= (MAX_ORBITS as u8) , E_INVALID_ORBIT_ID);

    let len = vector::length(&star.planets);
    assert!(len <= MAX_ORBITS, E_ORBIT_LIMIT_EXCEEDED);

    let mut i = 1;
    while( i < len ){
        let existing_orbit = vector::borrow(&planet.orbit, i);
        assert!(*existing_orbit != orbitId, E_ORBIT_ALREADY_EXISTS);
        i = i+1;
    };

    vector::push_back(&mut planet.orbit, orbitId);
    vector::push_back(&mut star.planets, planet)
}

#[test_only]
use std::debug::print;

#[test]
fun test_add_planet_on_star(){
    let mut planet = new_planet(b"Planet 1".to_string());
    let mut star= new_star(b"Star 1".to_string());
    add_planet_on_star(&mut star, 2, planet);

    print(&star);
}