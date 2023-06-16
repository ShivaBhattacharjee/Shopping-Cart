// let deliveryAddressCount = 3;

// function addDeliveryAddress() {
//   const pickupAddresses = document.querySelectorAll('.pickup-address');
//   const lastPickupAddress = pickupAddresses[pickupAddresses.length - 1];

//   const newPickupAddress = document.createElement('div');
//   newPickupAddress.className = 'pickup-address';

//   const barnadCircle = document.createElement('div');
//   barnadCircle.className = 'barnadcircle';

//   const previousBarnadCircle = lastPickupAddress.querySelector('.barnadcircle');
//   previousBarnadCircle.classList.add('connected');

//   barnadCircle.innerHTML = `
//     <h1>To &nbsp;&nbsp;&nbsp;&nbsp;</h1>
//     <div class="circle">
//       <span>${deliveryAddressCount}</span>
//       <div class="line"></div>
//     </div>
//   `;

//   newPickupAddress.appendChild(barnadCircle);

//   const pickupCardClone = lastPickupAddress.querySelector('.pickup-card').cloneNode(true);
//   const pickupCardCircle = pickupCardClone.querySelector('.circle');

//   pickupCardCircle.innerHTML = `
//     <span>${deliveryAddressCount}</span>
//   `;

//   newPickupAddress.appendChild(pickupCardClone);

//   const addButton = document.querySelector('.deliver-add');
//   addButton.parentNode.insertBefore(newPickupAddress, addButton);

//   deliveryAddressCount++;
// }

const orderOptions = document.querySelectorAll('.order-options');
orderOptions.forEach(option => {
  option.addEventListener('click', function () {
    orderOptions.forEach(option => {
      option.classList.remove('active');
    });
    this.classList.add('active');
  });
});

let selectedWeight = 5;
updateTotalPrice();

const weightButtons = document.querySelectorAll('.weight-buttons button');
weightButtons.forEach(button => {
  button.addEventListener('click', function () {
    weightButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    selectedWeight = parseInt(this.getAttribute('data-weight'));
    updateTotalPrice();
  });
});

// Update defaultWeightButton selection
const defaultWeightButton = document.querySelector('.weight-buttons button[data-weight="1"]');
defaultWeightButton.classList.add('active');
defaultWeightButton.click();

function updateTotalPrice() {
  let totalPrice = 45;
  if (selectedWeight > 1) {
    totalPrice += (selectedWeight - 1) * 10;
  }
  document.querySelector('.total-price h1').textContent = `Total: from ₹ ${totalPrice}`;
  document.getElementById('total-price').textContent = totalPrice;

  if (selectedWeight === 1) {
    document.querySelector('.total-price h1').textContent = `Total: from ₹ ${totalPrice}`;
    document.getElementById('total-price').textContent = totalPrice;
  }
}

const defaultOrderOption = document.querySelector('.order-options');
defaultOrderOption.classList.add('active');

const paymentOptions = document.querySelectorAll('.balance');
paymentOptions.forEach(option => {
  option.addEventListener('click', function () {
    paymentOptions.forEach(option => {
      option.classList.remove('active');
    });
    this.classList.add('active');
  });
});

// calculate the delivery and pickup distance

// Get references to the input fields
const pickupAddressInput = document.getElementById('pickup-address-input');
const deliveryAddressInput = document.getElementById('delivery-address-input');

// Create instances of the Google Places Autocomplete widget
const pickupAutocomplete = new google.maps.places.Autocomplete(pickupAddressInput);
const deliveryAutocomplete = new google.maps.places.Autocomplete(deliveryAddressInput);

// Initialize variables to store the place objects
let pickupPlace = null;
let deliveryPlace = null;

// Add event listeners to the input fields
pickupAddressInput.addEventListener('change', handleAddressChange);
deliveryAddressInput.addEventListener('change', handleAddressChange);

function handleAddressChange() {
  // Get the place object for the pickup address
  pickupPlace = pickupAutocomplete.getPlace();

  // Get the place object for the delivery address
  deliveryPlace = deliveryAutocomplete.getPlace();

  // Check if both addresses are filled
  if (pickupPlace && deliveryPlace) {
    // Calculate the distance between the two addresses
    const distance = calculateDistance(pickupPlace.geometry.location, deliveryPlace.geometry.location);
    console.log('Distance (km):', distance);
  }
}

function calculateDistance(pickupLocation, deliveryLocation, callback) {
  // Create a new instance of the Distance Matrix service
  const distanceService = new google.maps.DistanceMatrixService();

  // Prepare the request for distance calculation
  const request = {
    origins: [pickupLocation],
    destinations: [deliveryLocation],
    travelMode: 'DRIVING'
  };

  // Call the Distance Matrix service
  distanceService.getDistanceMatrix(request, (response, status) => {
    if (status === 'OK') {
      // Get the distance in meters from the response
      const distanceInMeters = response.rows[0].elements[0].distance.value;

      // Convert the distance to kilometers
      const distanceInKm = distanceInMeters / 1000;

      // Invoke the callback with the calculated distance
      callback(distanceInKm);
    } else {
      console.log('Distance calculation failed:', status);
    }
  });
}

// Example usage of the calculateDistance function
calculateDistance(pickupPlace.geometry.location, deliveryPlace.geometry.location, distance => {
  console.log('Distance (km):', distance);
});
