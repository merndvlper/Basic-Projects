module universe::creation;

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

entry fun create_universe(ctx: &mut TxContext){
    let universe = new_universe(ctx);
    transfer::share_object(universe);
}
