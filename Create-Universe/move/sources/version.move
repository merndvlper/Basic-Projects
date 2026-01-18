module universe::version;

use sui::package::Publisher;

public struct Version has key {
    id: UID,
    version: u64,
}

const E_INVALID_VERSION: u64 = 0;
const E_INVALID_PUBLISHER: u64 = 1;
const E_VERSION_ALREADY_UPDATED: u64 = 2;

const VERSION: u64 = 1;

fun init(ctx: &mut TxContext) {
    transfer::share_object(Version {
        id: object::new(ctx),
        version: VERSION,
    });
}

public fun check_is_valid(version: &Version) {
    assert!(version.version == VERSION, E_INVALID_VERSION);
}

public fun migrate(pub: &Publisher, version: &mut Version) {
    assert!(version.version != VERSION, E_VERSION_ALREADY_UPDATED);
    assert!(pub.from_package<Version>(), E_INVALID_PUBLISHER);

    version.version = VERSION;
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
