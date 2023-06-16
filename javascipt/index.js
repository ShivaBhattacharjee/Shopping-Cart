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

let distance;
const orderOptions = document.querySelectorAll('.order-options');
orderOptions.forEach(option => {
  option.addEventListener('click', function () {
    orderOptions.forEach(option => {
      option.classList.remove('active');
    });
    this.classList.add('active');
  });
});

let selectedWeight = 1;

// Update defaultWeightButton selection
const defaultWeightButton = document.querySelector('.weight-buttons button[data-weight="1"]');
defaultWeightButton.classList.add('active');
defaultWeightButton.click();



let previousDistance;
let previousWeight = 1;

function updateTotalPrice(distance) {
  let totalPrice = 0;
  let cost = 0;
  let gst = 0;

  if (distance && selectedWeight <= 30) {
    cost = distance * 12;
    gst = cost * 0.18;
    totalPrice = cost + gst;
  } else if (selectedWeight > 30) {
    if (distance && selectedWeight) {
      cost = distance * 12;
      gst = cost * 0.18;
      totalPrice = cost + gst + 50; // Add additional cost of 50 Rs for 40 kg and 50 kg weight
    } else {
      totalPrice = 95;
    }
  } else {
    totalPrice = 45;
  }

  // Round off totalPrice, cost, and gst to two decimal places
  totalPrice = totalPrice.toFixed(2);
  cost = cost.toFixed(2);
  gst = gst.toFixed(2);

  document.getElementById('total-distance').textContent = distance ? `Total Distance: ${distance.toFixed(2)} km` : 'Total Distance: ';
  document.getElementById('cost').textContent = distance ? `Cost: ₹ ${cost}` : selectedWeight <= 30 ? 'Cost: ₹ 45' : 'Cost: ₹ 95';
  document.getElementById('gst').textContent = distance ? `GST(18%): ₹ ${gst}` : 'GST(18%): ₹ ';
  document.getElementById('total-cost').textContent = distance ? `Total Cost: ₹ ${totalPrice}` : 'Total Cost: ₹ ';
  document.querySelector('.total-price h1').textContent = `Total: from ₹ ${totalPrice}`;
  document.getElementById('total-price').textContent = totalPrice;

  // Store the current distance and weight for future reference
  previousDistance = distance;
  previousWeight = selectedWeight;
}







const weightButtons = document.querySelectorAll('.weight-buttons button');
weightButtons.forEach(button => {
  button.addEventListener('click', function () {
    weightButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    const weight = parseInt(this.getAttribute('data-weight'));
    if (weight > 30) {
      selectedWeight = weight;
    } else {
      selectedWeight = 1;
    }
    updateTotalPrice();
  });
});
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

// google autocomplete widget 
const pickupAutocomplete = new google.maps.places.Autocomplete(pickupAddressInput);
const deliveryAutocomplete = new google.maps.places.Autocomplete(deliveryAddressInput);

const directionsService = new google.maps.DirectionsService();

pickupAddressInput.addEventListener('change', calculateDistance);
deliveryAddressInput.addEventListener('change', calculateDistance);

function calculateDistance() {
  const pickupAddress = pickupAddressInput.value;
  const deliveryAddress = deliveryAddressInput.value;

  if (pickupAddress && deliveryAddress) {
    const request = {
      origin: pickupAddress,
      destination: deliveryAddress,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        const route = response.routes[0];
        let totalDistance = 0;

        // Iterate over each leg of the route and accumulate the distance
        for (let i = 0; i < route.legs.length; i++) {
          const leg = route.legs[i];
          totalDistance += leg.distance.value;
        }

        // Convert totalDistance to kilometers with decimal format
        const numericDistance = totalDistance / 1000;
        updateTotalPrice(numericDistance);
        console.log('Distance between pickup and delivery: ' + numericDistance.toFixed(2) + ' km');
      } else {
        console.log('Error calculating distance:', status);
      }
    });
  }
}


// Call updateTotalPrice to initialize the total price display
updateTotalPrice();
