/**
 * Convert from degrees to radians
 * 
 * @param {float} degrees 
 * @returns 
 */
Math.toRadians = (degrees) => {
	return degrees * Math.PI / 180;
};

/**
 * Convert from radians to degrees
 * 
 * @param {float} radians 
 * @returns 
 */
Math.toDegrees = (radians) => {
	return radians * 180 / Math.PI;
};

/**
 * Get the distance in meters between 2 position coordinates
 * This is based on: https://stackoverflow.com/questions/837872/calculate-distance-in-meters-when-you-know-longitude-and-latitude-in-java
 * 
 * @param {float} lat1 
 * @param {float} lng1 
 * @param {float} lat2 
 * @param {float} lng2 
 * @returns 
 */
const getDistance = (lat1, lng1, lat2, lng2) => {
    const earthRadius = 6371000; // meters
    const dLat = Math.toRadians(lat2-lat1);
    const dLng = Math.toRadians(lng2-lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dist = earthRadius * c;

    return dist;
};

module.exports = {
    getDistance: getDistance,
};
