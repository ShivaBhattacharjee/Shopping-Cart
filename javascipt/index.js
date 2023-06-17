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
      totalPrice = cost + gst + ((selectedWeight - 30) * 50); // Add additional cost based on weight above 30 kg
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


// Get the current local date
const currentDate = new Date().toLocaleDateString('en-CA');

// Set the min attribute of the depart date input field to the current local date
document.getElementById("depart-date-input").min = currentDate;

// Set the min attribute of the arrive date input field to the current local date
document.getElementById("arrive-date-input").min = currentDate;

// Function to enable/disable schedule options based on the selected date and time
function updateScheduleOptions() {
  const currentDate = new Date().toLocaleDateString('en-CA');
  const selectedDate = document.getElementById("arrive-date-input").value;
  const selectedSchedule = document.getElementById("schedule").value;
  const currentTime = new Date().getHours();
  const scheduleOptions = document.querySelectorAll("#schedule option");

  // Enable/disable options based on the selected date and time
  if (selectedDate === currentDate) {
    if (currentTime < 6 || (currentTime >= 12 && currentTime < 18)) {
      // Disable "6am to 12pm" and "12pm to 6pm" options
      scheduleOptions[1].disabled = true;
      scheduleOptions[2].disabled = true;
      scheduleOptions[3].disabled = true;
      // Select the default option
      scheduleOptions[0].selected = true;
    }else if(currentTime>12){
      scheduleOptions[2].disabled = true;
    }
  } else {
    // Enable all options for future dates
    scheduleOptions.forEach(option => {
      option.disabled = false;
    });
  }

  // Show/hide the "Change date" option
  const changeDateOption = document.querySelector("#schedule option[value='change-date-option']");
  if (selectedDate === currentDate) {
    changeDateOption.disabled = false;
  } else {
    changeDateOption.disabled = true;
  }
}

// Attach event listeners to the date input fields
document.getElementById("arrive-date-input").addEventListener("change", updateScheduleOptions);
document.getElementById("depart-date-input").addEventListener("change", updateScheduleOptions);

// Initial update of schedule options based on the current date and time
updateScheduleOptions();
