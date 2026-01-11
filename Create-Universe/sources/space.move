module universe::space;

use std::string::String;
use std::unit_test::assert_eq;

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

public fun new_planet(name: String):Planet{
    Planet{
        name,
        orbit: vector::empty(),
    }
}


public fun new_star( name: String): Star{
    Star{
        name,
        planets: vector::empty(),
        alive: true,
        orbit: vector::empty(),
    }
} 

public fun new_galaxy(name: String): Galaxy{
    Galaxy{
        name,
        stars: vector::empty(),
    }
}

public fun add_planet_on_star(star: &mut Star, orbitId: u8, planet: Planet){
    let mut planet = planet;
    assert!(orbitId >= 1 && orbitId <= (MAX_ORBITS as u8) , E_INVALID_ORBIT_ID);

    let len = vector::length(&star.planets);
    assert!(len <= MAX_ORBITS, E_ORBIT_LIMIT_EXCEEDED);

    let mut i = 0;
    while( i < len ){
        let existing_orbit = vector::borrow(&star.planets, i); // TODO: Burayı çöz aynı orbitId atanabiliyor
        assert!(existing_orbit.orbit[0] != orbitId, E_ORBIT_ALREADY_EXISTS);
        i = i+1;
    };

    vector::push_back(&mut planet.orbit, orbitId);
    vector::push_back(&mut star.planets, planet)
}

public fun add_star_on_galaxy(galaxy: &mut Galaxy, orbitId: u8, star: Star){
    let mut star = star;
    assert!(orbitId >= 1 && orbitId <= (MAX_ORBITS as u8), E_INVALID_ORBIT_ID);
    
    let len = vector::length(&galaxy.stars); 
    assert!(len <= MAX_ORBITS, E_ORBIT_LIMIT_EXCEEDED);

    let mut i = 0;
    while(i < len){ 
        let existing_orbit = vector::borrow(&galaxy.stars, i);
        assert!(existing_orbit.orbit[0] != orbitId, E_ORBIT_ALREADY_EXISTS);
        i = i + 1;
    };
    
    vector::push_back(&mut star.orbit, orbitId);
    vector::push_back(&mut galaxy.stars, star);
}



#[test]
fun test_add_planet_on_star(){
    let planet = new_planet(b"Planet 1".to_string());
    let mut star = new_star(b"Star 1".to_string());

    add_planet_on_star(&mut star, 1, planet);

    let len= vector::length(&star.planets);

    assert_eq!(len ,1);
}

#[test]
fun test_add_star_on_galaxy(){
    let star = new_star(b"Star 1".to_string());
    let mut galaxy = new_galaxy(b"Galaxy 1".to_string());

    add_star_on_galaxy(&mut galaxy, 1, star);

    let len= vector::length(&galaxy.stars);
    assert_eq!(len, 1);
}

#[test]
#[expected_failure(abort_code= E_ORBIT_ALREADY_EXISTS)]
fun test_add_same_orbit_ids_1(){
    let planet_1 = new_planet(b"planet 1".to_string()); 
    let planet_2 = new_planet(b"planet 2".to_string()); 

    let mut star = new_star(b"Star 1".to_string());

    add_planet_on_star(&mut star, 2, planet_1);
    add_planet_on_star(&mut star, 2, planet_2);
}

#[test]
#[expected_failure(abort_code= E_ORBIT_ALREADY_EXISTS)]
fun test_add_same_orbit_ids_2(){
    let star_1 = new_star(b"Star 1".to_string()); 
    let star_2 = new_star(b"Star 2".to_string()); 

    let mut galaxy = new_galaxy(b"Galaxy 1".to_string());

    add_star_on_galaxy(&mut galaxy, 2, star_1);
    add_star_on_galaxy(&mut galaxy, 2, star_2);
}

#[test]
#[expected_failure(abort_code= E_INVALID_ORBIT_ID)]
fun test_add_star_fails_if_orbit_out_of_range_1(){
    let planet = new_planet(b"planet 1".to_string()); 
    let mut star = new_star(b"Star 1".to_string());

    add_planet_on_star(&mut star, 0, planet);
}

#[test]
#[expected_failure(abort_code= E_INVALID_ORBIT_ID)]
fun test_add_star_fails_if_orbit_out_of_range_2(){
    let star = new_star(b"Star 1".to_string()); 
    let mut galaxy = new_galaxy(b"Galaxy 1".to_string());

    add_star_on_galaxy(&mut galaxy, 16, star);
}