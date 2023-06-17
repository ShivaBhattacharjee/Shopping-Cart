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

let previousDistance;
let previousWeight = 1;
let selectedWeight = 1;

function updateTotalPrice(distance, weight) {
     let totalPrice = 0;
  let cost = 0;
  let gst = 0;

  if (distance && weight <= 30) {
    cost = distance * 12;
    gst = cost * 0.18;
    totalPrice = cost + gst;
  } else if (weight > 30) {
    if (distance && weight) {
      cost = (distance * 12) + 50;
      gst = cost * 0.18;
      totalPrice = cost + gst; 
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
    updateTotalPrice(previousDistance, selectedWeight);
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

        
        for (let i = 0; i < route.legs.length; i++) {
          const leg = route.legs[i];
          totalDistance += leg.distance.value;
        }

        const numericDistance = totalDistance / 1000;
        updateTotalPrice(numericDistance, selectedWeight);
        console.log('Distance between pickup and delivery: ' + numericDistance.toFixed(2) + ' km');
      } else {
        console.log('Error calculating distance:', status);
      }
    });
  }
}


updateTotalPrice();

// Get the current local date
const currentDate = new Date().toLocaleDateString('en-CA');


// Set the min attribute of the arrive date input field to the current local date
document.getElementById("arrive-date-input").min = currentDate;

// Function to enable/disable schedule options based on the selected date and time
function updateScheduleOptions() {
  const currentDate = new Date().toLocaleDateString('en-CA');
  const selectedDate = document.getElementById("arrive-date-input").value;
  const selectedSchedule = document.getElementById("schedule");
  const currentTime = new Date().getHours();
  const scheduleOptions = document.querySelectorAll("#schedule option");

  // Enable/disable options based on the selected date and time
  if (selectedDate === currentDate) {
    if (currentTime < 9) {
      // Disable both "9am to 12pm" and "12pm to 5pm" options
      scheduleOptions[1].disabled = true;
      scheduleOptions[2].disabled = true;
      scheduleOptions[3].disabled = true;
      // Select the default option
      scheduleOptions[0].selected = true;
    } else if (currentTime >= 9 && currentTime < 12) {
      // Disable "12pm to 5pm" option
      scheduleOptions[2].disabled = true;
    } else {
      // Disable "9am to 12pm" option
      scheduleOptions[1].disabled = true;
    }
  } else {
    // Enable all options for future dates
    scheduleOptions.forEach(option => {
      option.disabled = false;
    });
    // Select the default option
    scheduleOptions[0].selected = true;
  }
}

document.getElementById("arrive-date-input").addEventListener("change", updateScheduleOptions);

updateScheduleOptions();


