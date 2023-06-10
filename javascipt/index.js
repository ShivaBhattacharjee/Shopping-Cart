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


let selectedWeight = 5;
updateTotalPrice();


const weightButtons = document.querySelectorAll('.weight-buttons button');
weightButtons.forEach(button => {
  button.addEventListener('click', function() {

    selectedWeight = parseInt(this.getAttribute('data-weight'));
    updateTotalPrice();
  });
});

function updateTotalPrice() {
  let totalPrice = 45;
  if (selectedWeight > 1) {
    totalPrice += (selectedWeight - 1) * 10;
  }
  document.getElementById('total-price').textContent = totalPrice;
}


const defaultWeightButton = document.querySelector('.weight-buttons button[data-weight="5"]');
defaultWeightButton.classList.add('selected');
