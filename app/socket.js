const config = require('./config');
const util = require('./utility');
const server = require('./server');
const io = require('socket.io')(server, {origins: 'localhost:*'});

const spawnPoint = config.SPAWN_POINT;

// users connected to the server
const userList = {};
let connectionNum = 0;

// list of available vendors
const vendorList = config.VENDORS;

// list of goals discovered
const goalList = {};


// connection event
io.sockets.on('connection', socket => {
    if (!(socket.id in userList)) {
        // attach the custom property
        const user = {
            lat: spawnPoint.lat,
            lng: spawnPoint.lng,
        };

        // add user to the list
        userList[socket.id] = user;
        ++connectionNum;

        // broadcast everytime someone new connects to the server
        io.sockets.emit('userList', { users: userList, spawnPoint: spawnPoint });
        // refresh the goal list for the user
        socket.emit('goalList', { goals: goalList });
        // populate the vendors in the area for the user
        socket.emit('vendorList', { vendors: vendorList });

        console.log('New connection having id: %s', socket.id);
        console.log('Current number of userList: %s', connectionNum);
        console.log(userList);
    }

    // disconnection event
    socket.on('disconnect', () => {
        // remove connection from the list
        if (socket.id in userList) {
            delete userList[socket.id];
            --connectionNum;

            // broadcast everytime someone disconnects from the server
            io.sockets.emit('userList', { users: userList, spawnPoint: spawnPoint });

            console.log('Disconnection having id: %s', socket.id);
            console.log('Current number of userList: %s', connectionNum);
            console.log(userList);
        }
    });

    // message send event
    socket.on('sendMsg', message => {
        console.log('Message received: %s', message);

        // broadcast message
        io.sockets.emit('newMsg', { 
            senderId: socket.id, 
            message: message,
        });
    });

    // user position update
    socket.on('sendPos', message => {
        if (socket.id in userList) {
            // update the position and persist it in-memory
            userList[socket.id].lat = message.lat;
            userList[socket.id].lng = message.lng;
        }

        // broadcast user position update to everyone
        io.sockets.emit('newPos', message);

        for (idx in config.GOALS) {
            let goal = config.GOALS[idx];

            let dist = Number.MAX_VALUE;

            // if goal is not yet discovered
            if (goal.status === config.GOAL_STATUS_HINT) {
                // check the distance in meters between the user and any goal
                dist = util.getDistance(message.lat, message.lng, goal.lat, goal.lng);

                // check if the user is near any goal
                if (dist <= config.GOAL_DISCOVERY_METERS) {
                    goal.status = config.GOAL_STATUS_DISCOVERED;

                    goalList[goal.id] = goal;

                    // reveal nearby discovered goal
                    io.sockets.emit('newGoal', goal);

                    // broadcast message
                    io.sockets.emit('newMsg', { 
                        senderId: 'notification', 
                        message: `goal ${goal.id} was discovered by: ${socket.id}`,
                    });

                    console.log(`goal ${goal.id} was discovered by: ${socket.id}`);
                }
            }

            // if goal is not yet hinted
            if (goal.status === config.GOAL_STATUS_NEW) {
                // check the distance in meters between the user and any goal
                dist = util.getDistance(message.lat, message.lng, goal.lat, goal.lng);

                if (dist <= config.GOAL_HINT_METERS) {
                    goal.status = config.GOAL_STATUS_HINT;

                    goalList[goal.id] = goal;

                    // broadcast message
                    io.sockets.emit('newHint', { 
                        senderId: 'notification', 
                        userId: socket.id,
                        message: `A nearby treasure around ${goal.landmark}`,
                    });

                    console.log(`A nearby treasure around ${goal.landmark}`);
                }
            }

            // if there are rewards not yet acquired
            if (goal.type === config.GOAL_TYPE_REWARD && goal.status !== config.GOAL_STATUS_ACQUIRED) {
                if (dist === Number.MAX_VALUE) {
                    // check the distance in meters between the user and any goal
                    dist = util.getDistance(message.lat, message.lng, goal.lat, goal.lng);
                }

                // check if the user got the reward
                if (dist <= config.GOAL_REWARD_ACQUIRE_METERS) {
                    goal.status = config.GOAL_STATUS_ACQUIRED;

                    if (goal.id in goalList) {
                        delete goalList[goal.id];
                    }

                    // remove acquired goal
                    io.sockets.emit('clearGoal', {
                        goal,
                        userId: socket.id
                    });

                    // broadcast message
                    io.sockets.emit('newMsg', { 
                        senderId: 'notification', 
                        message: `goal ${goal.id} was acquired by: ${socket.id}`,
                    });

                    console.log(`goal ${goal.id} was acquired by: ${socket.id}`);
                }
            }
        } // end loop
    });

    socket.on('sendGroupInvitation', details => {
        console.log(`sending group invite notification to ${details.receiver}`);
        io.sockets.emit('notifyUserInvite', details);
    });
});
