// China Square Central
const spawnPoint = {
    lat: 1.2842701734812285,
    lng: 103.84694341149904,
};

// goal parameters
const GOAL_DISCOVERY_METERS = 50;
const GOAL_REWARD_ACQUIRE_METERS = 20;

// goal types
const GOAL_TYPE_ORDER = 1;
const GOAL_TYPE_REWARD = 2;

// goal status
const GOAL_STATUS_NEW = 0;
const GOAL_STATUS_DISCOVERED = 1;
const GOAL_STATUS_ACQUIRED = 2;

// goals / objectives
const goals = [
    // Grids Coffee
    {
        id: 'GOING_OFF_GRID',
        lat: 1.283572,
        lng: 103.845951,
        type: GOAL_TYPE_ORDER,
        status: GOAL_STATUS_NEW,
    },
    // Little Creatures Brewing
    {
        id: 'ADOPT_LITTLE_CREATURES',
        lat: 1.282549,
        lng: 103.846236,
        type: GOAL_TYPE_ORDER, 
        status: GOAL_STATUS_NEW,
    },
    // Great Eastern Insurance
    {
        id: 'INSURE_YOURSELF',
        lat: 1.28493,
        lng: 103.847536,
        type: GOAL_TYPE_REWARD,
        status: GOAL_STATUS_NEW,
    },
    // DBS Bank
    {
        id: 'MONEY_HEIST',
        lat: 1.284625,
        lng: 103.846245,
        type: GOAL_TYPE_REWARD,
        status: GOAL_STATUS_NEW,
    },
];

// list of configured vendors
const vendors = {
    // Huggs Coffee
    'HUGGS_COFFEE': {
        id: 'HUGGS_COFFEE',
        lat: 1.283827,
        lng: 103.848882,
        details: {
            toast : {
                title: 'Huggs Coffee Promo',
                desc: 'free hug for every coffee mug used to save the environment',
                delay_ms: 8000,
            },
            promo: `<div>
                    <h3 class='center-text'>Huggs Coffee Promo</h3>
                    <div class='center-text'>free hug for every coffee mug used to save the environment</div>
                    <div><img width='50%' class='center-pos' src='/static/images/qrcode.png' alt='scan QR code'></div>
                    <div class='center-text'><video class='center-pos' width="240" height="180" autoplay muted loop>
                    <source src="/static/video/foodpanda_sushitei_ad.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                    </video></div>
                    </div>`,
        },
    },
    // Birds of a Feather
    'BIRDS_OF_A_FEATHER': {
        id: 'BIRDS_OF_A_FEATHER',
        lat: 1.282168,
        lng: 103.847684,
        details: {
            toast : {
                title: 'Birds of a Feather Promo',
                desc: 'enjoy 30% off if you dine as a flock of 4 people',
                delay_ms: 5000,
            },
            promo: `<div>
                    <h3 class='center-text'>Birds of a Feather Promo</h3>
                    <div class='center-text'>enjoy 30% off if you dine as a flock of 4 people</div>
                    <div><img class='center-pos' src='/static/images/qrcode.png' alt='scan QR code'></div>
                    </div>`,
        },
    },
};

module.exports = {
    SPAWN_POINT: spawnPoint,
    GOAL_DISCOVERY_METERS: GOAL_DISCOVERY_METERS,
    GOAL_REWARD_ACQUIRE_METERS: GOAL_REWARD_ACQUIRE_METERS,
    GOAL_TYPE_ORDER: GOAL_TYPE_ORDER,
    GOAL_TYPE_REWARD: GOAL_TYPE_REWARD,
    GOAL_STATUS_NEW: GOAL_STATUS_NEW,
    GOAL_STATUS_DISCOVERED: GOAL_STATUS_DISCOVERED,
    GOAL_STATUS_ACQUIRED: GOAL_STATUS_ACQUIRED,
    GOALS: goals,
    VENDORS: vendors,
};
