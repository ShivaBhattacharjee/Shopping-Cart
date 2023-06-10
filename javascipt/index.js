function addDeliveryAddress() {
  const pickupAddresses = document.querySelectorAll('.pickup-address');
  const lastPickupAddress = pickupAddresses[pickupAddresses.length - 1];

  const newPickupAddress = document.createElement('div');
  newPickupAddress.className = 'pickup-address';

  const pickupCardClone = lastPickupAddress.querySelector('.pickup-card').cloneNode(true);
  newPickupAddress.appendChild(pickupCardClone);

  const addButton = document.querySelector('.deliver-add');
  addButton.parentNode.insertBefore(newPickupAddress, addButton);
}


const orderOptions = document.querySelectorAll('.order-options');


orderOptions.forEach(option => {
  option.addEventListener('click', function() {

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
  button.addEventListener('click', function() {
  
    weightButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    this.classList.add('active');

    selectedWeight = parseInt(this.getAttribute('data-weight'));
    updateTotalPrice();
  });
});

function updateTotalPrice() {
  let totalPrice = 45;
  if (selectedWeight > 1) {
    totalPrice += (selectedWeight - 1) * 10;
  }
  document.querySelector('.total-price h1').textContent = `Total: from ₹ ${totalPrice}`;
  document.getElementById('total-price').textContent = totalPrice;
}

const defaultWeightButton = document.querySelector('.weight-buttons button[data-weight="1"]');
defaultWeightButton.classList.add('active');

const defaultOrderOption = document.querySelector('.order-options');
defaultOrderOption.classList.add('active');
const paymentOptions = document.querySelectorAll('.balance');


paymentOptions.forEach(option => {
  option.addEventListener('click', function() {
  
    paymentOptions.forEach(option => {
      option.classList.remove('active');
    });

    this.classList.add('active');
  });
});