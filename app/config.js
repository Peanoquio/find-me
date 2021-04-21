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
};
