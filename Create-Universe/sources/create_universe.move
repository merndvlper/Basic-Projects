module universe::creation;

use std::string::String;
use universe::space::{Galaxy};

public struct Universe has key, store{
    id: UID,
    galaxys: vector<Galaxy>
} 

fun new_universe(ctx: &mut TxContext): Universe{
    Universe{
        id: object::new(ctx),
        galaxys: vector::empty()
    }
}
