// taking location from user
let location_position;
let userLatitude
let userLongitude
const successCallback = (position) => {
    location_position=position
    userLatitude=location_position.coords.latitude
    userLongitude=location_position.coords.longitude
};

const errorCallback = (error) => {
    console.log(error);
    alert("Please enable location permission")

};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);







let liCount = 0;

function printHospitals(hospital){
  // let list_of_hospitals= document.querySelector('.list_of_hospitals')
  // let ul= document.createElement('ul')




  let ul= document.getElementsByTagName('ul')[1] // as navbar is also a ul , we need to select second one
  if(liCount<10 && hospital.tags.name){
    let li=document.createElement('li')
    li.textContent=hospital.tags.name
    ul.appendChild(li)
    liCount++;
    console.log(hospital)
  }

  // let list_of_hospitals= document.querySelector('.list_of_hospitals')
  // let ul = document.createElement('ul')
  // for(let hospital of hospitals){
  //   console.log(hospital)
  //   let li= document.createElement('li')
  //   li.textContent= hospital.tags.name
  //   console.log(hospital.tags.name)
  //   ul.appendChild(li)



  // }
  // list_of_hospitals.appendChild(ul)
}










// Function to search for hospitals using OpenStreetMap API
function searchForHospitals(latitude, longitude, radius) {
  var query = `[out:json][timeout:25];
                (
                  node["amenity"="hospital"](around:${radius},${latitude},${longitude});
                  way["amenity"="hospital"](around:${radius},${latitude},${longitude});
                  relation["amenity"="hospital"](around:${radius},${latitude},${longitude});
                );
                out body;>;out skel qt;`;

  var encodedQuery = encodeURIComponent(query);
  var apiUrl = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => data.elements);
}

// Function to add hospital markers to a Bing Map
function addHospitalMarkers(map, hospitals) {
  hospitals.forEach(hospital => {
    // console.log(hospital)
    var latitude = hospital.lat;
    var longitude = hospital.lon;

    // Create a location using Bing Maps Location class
    var location = new Microsoft.Maps.Location(latitude, longitude);

    // Create a pushpin for the hospital and add it to the map


    var pinOptions = {
      icon: '/images/icons/map_pinv2.png', // URL of the custom pin image
      anchor: new Microsoft.Maps.Point(12, 39), // Optional: Adjust the anchor point if needed
      title: hospital.tags.name,
      // subTitle: 'Hospital',
    };



    var pushpin = new Microsoft.Maps.Pushpin(location, pinOptions);
    map.entities.push(pushpin);
    printHospitals(hospital)
  });
}

// Initialize the Bing Map
function initMap() {
  var map = new Microsoft.Maps.Map('#map', {
    credentials: 'AipVvHKN8OtwiGPpTjMZYRhRa-lkk2-yakMlTaMgL8IX6LfApk8BvRuFLtDTw855',
    center: new Microsoft.Maps.Location(userLatitude, userLongitude), // Default center (San Francisco)
    zoom: 15 // Default zoom level
  });


  var searchRadius = 7000; // Search radius in meters
  // Search for hospitals using OpenStreetMap API
  searchForHospitals(userLatitude, userLongitude, searchRadius)
    .then(hospitals => {
      // Add hospital markers to the Bing Map
      addHospitalMarkers(map, hospitals);
      // printHospitals(hospitals);//prints hospitals list beside map
    })
    .catch(error => console.error('Error searching for hospitals:', error));
}

// Load the Bing Maps API asynchronously
function loadBingMapsScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://www.bing.com/api/maps/mapcontrol?key=AipVvHKN8OtwiGPpTjMZYRhRa-lkk2-yakMlTaMgL8IX6LfApk8BvRuFLtDTw855&callback=initMap';
  document.body.appendChild(script);
}

// Call loadBingMapsScript to load the Bing Maps API
loadBingMapsScript();



