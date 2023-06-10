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