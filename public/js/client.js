// user id
let myID;

const form = $('#myForm');
const txt = $('#txt');
const chatArea = $('#chatArea');

let unReadMessageCount = 0;

/**
 * Check the triggered window event
 * 
 * @param {window.event} e 
 * @paran {SocketIO.Socket} socket
 * @returns function
 */
function checkKey(e, socket) {
    return (e) => {
        e = e || window.event;

        switch(e.keyCode) {
            case 38: // up arrow
                userPos = moveUser(myID, map, 0.00001, 0, true);
                socket.emit('sendPos', userPos);
                break;
            case 40: // down arrow
                userPos = moveUser(myID, map, -0.00001, 0, true);
                socket.emit('sendPos', userPos);
                break;
            case 37: // left arrow
                userPos = moveUser(myID, map, 0, -0.00001, true);
                socket.emit('sendPos', userPos);
                break;
            case 39: // right arrow
                userPos = moveUser(myID, map, 0, 0.00001, true);
                socket.emit('sendPos', userPos);
                break;
        }
    };
}

/**
 * Handle event when sending a group invitation to other
 *
 * @param {SocketIO.Socket} socket 
 * @returns
 */
function handleSendGroupInvitationCallback(socket) {
    return id => {
        if (id === myID) {
            return;
        }

        console.log(`Sending invitation to ${id}`);
        socket.emit('sendGroupInvitation', {
            sender: myID,
            receiver: id,
            title: 'Come and join my party!',
        });
    }
}
var sendGroupInvitation;
const handleSendGroupInvitation = socket => {
    sendGroupInvitation = handleSendGroupInvitationCallback(socket);
}

/**
 * Handle event when user receives invitation
 *
 * @param {SocketIO.Socket} socket 
 */
function handleNotifyUserInvite(socket) {
    socket.on('notifyUserInvite', details => {
        if (myID == details.receiver) {
            console.log(`I just received an invitation from ${details.sender}`);
            const modal = constructInvitationModal(details.sender, details.title);
            $('body').append(modal);

            $(`.invitation-decline-${details.sender}`).click(function() {
                $(`.invitation-wrapper-${details.sender}`).addClass('animate__backOutLeft');
                setTimeout(() => $(`.invitation-wrapper-${details.sender}`).remove(), 500);
            });
            $(`.invitation-accept-${details.sender}`).click(function() {
                $(`.invitation-wrapper-${details.sender}`).addClass('animate__backOutRight');
                setTimeout(() => $(`.invitation-wrapper-${details.sender}`).remove(), 500);
            });
        }
    });
}

/**
 * Handle the event to send the chat message upon form submission
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleSendChat(socket) {
    // send chat message
    form.submit((e) => {
        e.preventDefault();
        var textVal = txt.val();
        if (textVal) {
            socket.emit('sendMsg', textVal);
            txt.val('');
        }
    });
}

/**
 * Handle the event when receiving the chat message 
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleReceiveChat(socket) {
    // receive chat message
    socket.on('newMsg', (data) => {
        const className = data.senderId !== 'notification'
            ? `profile ${data.senderId === myID && 'self'}`
            : data.senderId;
        
        const d = new Date();
        const date = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ", " + d.toDateString();
        chatArea.append(`<div class='well ${className}'>${data.senderId !== 'notification' ? `<span class='user'>${data.senderId}</span><span class='date'>${date}</span>` : ''}${data.message}</div>`);

        $('#chatArea').scrollTop($('#chatArea')[0].scrollHeight);
        
        handleUnreadMessage(true);
    });
}

/**
 * Handle the event when receiving the chat message 
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleReceiveHint(socket) {
    // receive hint message
    socket.on('newHint', (data) => {
        if (data.userId === myID) {
            toastr.success(data.message, 'Hint');
        }
    });
}

/**
 * Handle the event when a user joins the session
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleUserJoin(socket) {
    // when a user joins the session
    socket.on('userList', (data) => {
        myID = socket.id;

        console.log('I am user: %s', myID);

        // go through the user list coming from the server
        for (let userId in data.users) {
            if (data.users.hasOwnProperty(userId)) {
                let isSelf = (myID === userId) ? true : false;

                // set and preserve the user position in-memory
                if (isSelf) {
                    userLat = data.users[userId].lat;
                    userLng = data.users[userId].lng;

                    socket.emit('sendPos', {
                        userId: myID,
                        lat: userLat,
                        lng: userLng,
                    });
                }

                // add the user to the list and map
                addUser(userId, map, data.users[userId].lat, data.users[userId].lng, isSelf);
            }
        }

        // go through the user list on the client side
        for (userId in userList) {
            if (userList.hasOwnProperty(userId)) {
                // if the user is no longer in the list coming from the server side
                if (!(userId in data.users)) {
                    removeUser(userId);
                }
            }
        }
    });
}

/**
 * Handle the event when the list of goals has been updated
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleGoalList(socket) {
    // refresh goals
    socket.on('goalList', (data) => {
        // go through the goal list coming from the server
        for (let goalId in data.goals) {
            if (data.goals.hasOwnProperty(goalId)) {
                let goal = data.goals[goalId];

                // check if GOAL_TYPE_REWARD
                let isReward = (goal.type === 2) ? true : false;
                // add the goal to the map so it is revealed
                addGoal(goal.id, map, goal.lat, goal.lng, isReward);
            }
        }

        // go through the goal list on the client side
        for (goalId in goalList) {
            if (goalList.hasOwnProperty(goalId)) {
                // if the goal is no longer in the list coming from the server side
                if (!(goalId in data.goals)) {
                    removeGoal(goalId);
                }
            }
        }
    });
}

/**
 * Handle the event when the list of vendors has been broadcasted
 *
 * @param {SocketIO.Socket} socket
 */
 function handleVendorList(socket) {
    // refresh vendors
    socket.on('vendorList', (data) => {
        // go through the vendor list coming from the server
        for (let vendorId in data.vendors) {
            if (data.vendors.hasOwnProperty(vendorId)) {
                let vendor = data.vendors[vendorId];
                // add the vendor to the map so it is revealed
                addVendor(vendor.id, map, vendor.lat, vendor.lng, vendor.details);
            }
        }

        // go through the vendor list on the client side
        for (vendorId in vendorList) {
            if (vendorList.hasOwnProperty(vendorId)) {
                // if the vendor is no longer in the list coming from the server side
                if (!(vendorId in data.vendors)) {
                    removeVendor(vendorId);
                }
            }
        }
    });
}

/**
 * Handle the event when the users in the map update their positions
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleUsersPostionUpdate(socket) {
    // when a user updates his/her position
    socket.on('newPos', (data) => {
        // only update the position of other people in the map
        if (data.userId !== myID) {
            setUserPosition(data.userId, map, data.lat, data.lng, false);
        }
    });
}

/**
 * Handle the event when a goal has been discovered
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleGoalDiscovery(socket) {
    // when a goal has been discovered
    socket.on('newGoal', (data) => {
        // check if GOAL_TYPE_REWARD
        let isReward = (data.type === 2) ? true : false;
        // add the goal to the map so it is revealed
        addGoal(data.id, map, data.lat, data.lng, isReward);
    });
}

/**
 * Handle the event when a goal has been acquired
 * 
 * @param {SocketIO.Socket} socket 
 */
function handleGoalAcquisition(socket) {
    // when a goal has been acquired
    socket.on('clearGoal', (data) => {
        // remove the goal from the map
        removeGoal(data.goal.id);

        if (data.userId === myID) {
            const newRewardsElement = constructElement();
            $('body').append(newRewardsElement);

            const element = document.querySelector('.rewards-wrapper');
            party.confetti(element);

            $('.rewards-close').click(function() {
                $('.rewards-wrapper').remove();
            });
        }
    });
}

/**
 * Register the handlers to the socket
 * 
 * @param {SocketIO.Socket} socket 
 */
function registerHandlers(socket) {
    const handlers = [
        handleReceiveChat,
        handleUserJoin,
        handleGoalList,
        handleVendorList,
        handleUsersPostionUpdate,
        handleGoalDiscovery,
        handleGoalAcquisition,
        handleReceiveHint,
        handleSendGroupInvitation,
        handleNotifyUserInvite,
    ];

    for (idx in handlers) {
        handlers[idx].call(null, socket);
    }
}

/**
 * Toggle uncount message alert
 * 
 * @param {boolean} isNewMessage 
 */
function handleUnreadMessage(isNewMessage = false) {
    if ($('.chat-wrapper').hasClass('animate__fadeOutDown') && isNewMessage) {
        unReadMessageCount++;
        $('.unread-message').html(unReadMessageCount).removeClass('hide');
    } else {
        unReadMessageCount = 0;
        $('.unread-message').addClass('hide');
    }
}

/**
 * Rewards element
 * 
 */
function constructElement() {
    const max = 50;
    const min = 30;
    const rewards = Math.floor(Math.random() * (max - min + 1)) + min;

    return `<div class='rewards-wrapper animate__animated animate__bounceIn animate__slow'>
        <img src='static/images/rewards.png' />
        <h1>Congratulations</h1>
        <p>
            <span>${rewards}</span> panda pay credits has been credited to your account
        </p>
        <button type='button' class='rewards-close btn btn-light animate__fadeOut'>close</button>
    </div>`;
}

function constructInvitationModal(id, title) {
    return `<div class='invitation-wrapper invitation-wrapper-${id} animate__animated animate__wobble animate__slow'>
        <img src='static/images/rewards.png' />
        <h1>${id} invited you!</h1>
        <p>
            ${title}
        </p>
        <button type='button' class='invitation-decline-${id} btn btn-light animate__fadeOut'>decline</button>
        <button type='button' class='invitation-accept-${id} btn btn-light animate__fadeOut'>accept</button>
    </div>`;
}

jQuery(document).ready(() => {
    $('#txt').keypress(function (e) {
        if (e.which == 13) {
          $('#myForm').submit();
          return false; 
        }
    });

    const chatWrapper = $('.chat-wrapper');
    const toggleChat = () => {
        if (chatWrapper.hasClass('animate__fadeInUp')) {
            chatWrapper.css('transform', 'translateZ(0)');
        }
        handleUnreadMessage();
    
        chatWrapper.toggleClass('animate__fadeOutDown').toggleClass('animate__fadeInUp');
    };

    $('#chat-btn').click(function() {
        toggleChat();
    });

    $('.toggle-chat').click(function() {
        toggleChat();
    });
});
