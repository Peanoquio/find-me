// Google map instance
let map;

// initial user position
let userLat;
let userLng;

// list of other users 
const userList = {};

// list of vendors
const vendorList = {};

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
        mapId: '92475cb9c703e333',
        zoom: 18,
        center: defaultLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM,
        },
        styles: [
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": "-100"
                    }
                ]
            },
            {
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 65
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": "50"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": "-100"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": "30"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": "40"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "hue": "#ffff00"
                    },
                    {
                        "lightness": -25
                    },
                    {
                        "saturation": -97
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [
                    {
                        "lightness": -25
                    },
                    {
                        "saturation": -100
                    }
                ]
            }
        ]
        
        //[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
    };

    // render the map to the specified div element
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

/**
 * Creates and add the vendor to the map
 *
 * @param {string} id
 * @param {google.maps.Map} map
 * @param {float} lat
 * @param {float} lng
 * @param {Object} details
 * @returns
 */
 function addVendor(id, map, lat, lng, details) {
    if (id in vendorList) {
        return;
    }

    const baseImgURL = '/static/images';
    let iconURL = `${baseImgURL}/shop.png`;

    // icon settings
    const icon = {
        url: iconURL,
        scaledSize: new google.maps.Size(70, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(44, 88),
    };

    // create the marker given the location
    const latLng = new google.maps.LatLng(lat, lng);
    const vendor = new google.maps.Marker({
        position: latLng,
        icon: icon,
        map: map,
        title: id,
        draggable: false,
        animation: google.maps.Animation.DROP,
    });

    // create the info window for the marker
    const infowindow = new google.maps.InfoWindow({
        content: details.promo,
    });

    // attach event to open info window once the marker is clicked
    vendor.addListener('click', () => {
        infowindow.open(map, vendor);
    });

    // attach the custom property
    vendor.custom = {
        id: id,
    };

    // add to the list
    vendorList[id] = vendor;

    // add to the map
    vendor.setMap(map);

    // display the toast message
    setTimeout(() => {
        toastr.info(details.toast.desc, details.toast.title);
    }, details.toast.delay_ms);

    console.log(`Added vendor having id: ${id}`);
    console.log(vendorList);
}

/**
 * Remove the vendor from the list and map
 *
 * @param {string} id
 */
 function removeVendor(id) {
    if (id in vendorList) {
        if (vendorList[id]) {
            vendorList[id].setMap(null);
        }
        delete vendorList[id];

        console.log(`Removed vendor having id: ${id}`);
        console.log(vendorList);
    }
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

    const baseImgURL = '/static/images';
    let iconURL = isReward ? `${baseImgURL}/gifts.png` : `${baseImgURL}/shop.png`;

    // icon settings
    const icon = {
        url: iconURL,
        scaledSize: new google.maps.Size(70, 70),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(44, 88),
    };

    // create the marker given the location
    const latLng = new google.maps.LatLng(lat, lng);
    const goal = new google.maps.Marker({ 
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

    const baseImgURL = 'http://localhost:8081/';
    // let iconURL = isSelf ? `${baseImgURL}/man.png` : `${baseImgURL}/woman.png`;
    let iconURL = `static/images/user-location.png`;

    // user icon settings
    const userIcon = {
        url: iconURL,
        scaledSize: new google.maps.Size(35, 46),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(32, 32),
        //labelOrigin: new google.maps.Point(0, -5),
    };

    // create the user marker given the location
    const latLng = new google.maps.LatLng(lat, lng);
    const user = new google.maps.Marker({ 
        position: latLng, 
        icon: userIcon,
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
