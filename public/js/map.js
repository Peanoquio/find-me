// Google map instance
let map;

// initial user position
let userLat;
let userLng;

// list of other users 
const userList = {};

// list of visible goals
const goalList = {};

/**
 * Main function which will be invoked as a callback by the Google Map API upon loading
 */
function initMap() {
    // China Square Central
    const lat = 1.2842701734812285;
    const lng = 103.84694341149904;

    const defaultLatLng = new google.maps.LatLng(lat, lng);

    const mapOptions = {
        zoom: 18,
        center: defaultLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    // render the map to the specified div element
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

/**
 * Creates and add the goal to the map
 * 
 * @param {string} id 
 * @param {google.maps.Map} map 
 * @param {float} lat 
 * @param {float} lng 
 * @param {boolean} isReward 
 * @returns
 */
 function addGoal(id, map, lat, lng, isReward) {
    if (id in goalList) {
        return;
    }

    const baseImgURL = 'http://maps.google.com/mapfiles/kml/shapes/';
    let iconURL = isReward ? `${baseImgURL}/dollar.png` : `${baseImgURL}/snack_bar.png`;

    // icon settings
    const icon = {
        url: iconURL,
        scaledSize: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
    };

    // create the marker given the location
    const latLng = new google.maps.LatLng(lat, lng);
    goal = new google.maps.Marker({ 
        position: latLng, 
        icon: icon,
        map: map, 
        draggable: false,
        animation: google.maps.Animation.DROP,
    });

    // attach the custom property
    goal.custom = {
        id: id,
    };

    // add to the list
    goalList[id] = goal;

    // add to the map
    goal.setMap(map);

    // delay to animate the bouncing icon
    setTimeout(() => {
        for (goalId in goalList) {
            goalList[goalId].setAnimation(google.maps.Animation.BOUNCE);
        }
    }, 1500);
    
    console.log(`Added goal having id: ${id}`);
    console.log(goalList);
}

/**
 * Remove the goal from the list and map
 * 
 * @param {string} id 
 */
 function removeGoal(id) {
    if (id in goalList) {
        if (goalList[id]) {
            goalList[id].setMap(null);
        }
        delete goalList[id];

        console.log(`Removed goal having id: ${id}`);
        console.log(goalList);
    }
}

/**
 * Creates and add the user to the list and the map
 * 
 * @param {string} id 
 * @param {google.maps.Map} map 
 * @param {float} lat 
 * @param {float} lng 
 * @param {boolean} isSelf 
 * @returns
 */
function addUser(id, map, lat, lng, isSelf) {
    if (id in userList) {
        return;
    }

    const baseImgURL = 'http://maps.google.com/mapfiles/kml/shapes/';
    let iconURL = isSelf ? `${baseImgURL}/man.png` : `${baseImgURL}/woman.png`;

    // user icon settings
    const userIcon = {
        url: iconURL,
        scaledSize: new google.maps.Size(35, 35),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
        //labelOrigin: new google.maps.Point(0, -5),
    };

    // create the user marker given the location
    const latLng = new google.maps.LatLng(lat, lng);
    user = new google.maps.Marker({ 
        position: latLng, 
        icon: userIcon,
        label: { color: '#000000', fontWeight: 'bold', fontSize: '10px', text: id },
        map: map, 
        draggable: false,
        animation: google.maps.Animation.DROP,
    });

    // attach the custom property
    user.custom = {
        id: id,
    };

    // add to the list
    userList[id] = user;

    // add to the map
    user.setMap(map);

    console.log(`Added user having id: ${id}`);
    console.log(userList);
}

/**
 * Remove the user from the list and map
 * 
 * @param {string} id 
 */
function removeUser(id) {
    if (id in userList) {
        if (userList[id]) {
            userList[id].setMap(null);
        }
        delete userList[id];

        console.log(`Removed user having id: ${id}`);
        console.log(userList);
    }
}

/**
 * Move the user in the map
 * 
 * @param {string} id 
 * @param {google.maps.Map} map 
 * @param {float} latDelta 
 * @param {float} lngDelta 
 * @param {boolean} panMap 
 * @returns 
 */
function moveUser(id, map, latDelta, lngDelta, panMap = true) {
    if (!(id in userList)) {
        return;
    }    

    if (userList[id]) {
        userLat += latDelta;
        userLng += lngDelta;

        return setUserPosition(id, map, userLat, userLng, panMap);
    }
}

/**
 * Set the user position in the map
 * 
 * @param {string} id 
 * @param {google.maps.Map} map 
 * @param {float} lat
 * @param {float} lng 
 * @param {boolean} panMap 
 * @returns 
 */
 function setUserPosition(id, map, lat, lng, panMap = false) {
    if (!(id in userList)) {
        return;
    }    

    if (userList[id]) {
        const user = userList[id];

        userPos = new google.maps.LatLng(lat, lng);
        // set the user position in the map
        user.setPosition(userPos);

        if (panMap) {
            // map view will follow the user
            map.panTo(userPos);
        }

        return {
            userId: id,
            lat: userLat, 
            lng: userLng,
        };
    }
}
