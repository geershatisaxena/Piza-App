// Order page JavaScript

// DOM Elements
let selectedSize = 'medium';
let selectedCrust = 'regular';
let selectedSauce = 'tomato';
let selectedCheese = 'mozzarella';
let selectedToppings = [];
let quantity = 1;

// Pizza menu data
const pizzaMenu = JSON.parse(localStorage.getItem('pizzaMenu'));

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the order page
    if (!window.location.pathname.includes('order.html')) {
        return;
    }
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize order page
    initOrderPage();
});

// Initialize order page
function initOrderPage() {
    // Render pizza options
    renderPizzaOptions();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update order summary
    updateOrderSummary();
}

// Render pizza options
function renderPizzaOptions() {
    // Render sizes
    renderOptionGroup('sizes', pizzaMenu.sizes, selectedSize);
    
    // Render crusts
    renderOptionGroup('crusts', pizzaMenu.crusts, selectedCrust);
    
    // Render sauces
    renderOptionGroup('sauces', pizzaMenu.sauces, selectedSauce);
    
    // Render cheeses
    renderOptionGroup('cheeses', pizzaMenu.cheeses, selectedCheese);
    
    // Render toppings
    renderOptionGroup('toppings', pizzaMenu.toppings, null, true);
}

// Render an option group
function renderOptionGroup(groupId, options, selectedId, isMultiSelect = false) {
    const container = document.getElementById(groupId);
    if (!container) return;
    
    container.innerHTML = '';
    
    options.forEach(option => {
        const isSelected = isMultiSelect 
            ? selectedToppings.includes(option.id)
            : selectedId === option.id;
        
        const optionElement = document.createElement('div');
        optionElement.className = `option-item ${isSelected ? 'selected' : ''}`;
        optionElement.dataset.id = option.id;
        
        optionElement.innerHTML = `
            <h4>${option.name}</h4>
            <div class="option-price">$${option.price.toFixed(2)}</div>
        `;
        
        optionElement.addEventListener('click', () => {
            if (isMultiSelect) {
                toggleTopping(option.id);
            } else {
                selectOption(groupId, option.id);
            }
        });
        
        container.appendChild(optionElement);
    });
}

// Select a single option
function selectOption(groupId, optionId) {
    switch (groupId) {
        case 'sizes':
            selectedSize = optionId;
            break;
        case 'crusts':
            selectedCrust = optionId;
            break;
        case 'sauces':
            selectedSauce = optionId;
            break;
        case 'cheeses':
            selectedCheese = optionId;
            break;
    }
    
    // Re-render the group
    renderOptionGroup(groupId, pizzaMenu[groupId], optionId);
    updateOrderSummary();
}

// Toggle a topping
function toggleTopping(toppingId) {
    const index = selectedToppings.indexOf(toppingId);
    
    if (index === -1) {
        selectedToppings.push(toppingId);
    } else {
        selectedToppings.splice(index, 1);
    }
    
    // Re-render toppings
    renderOptionGroup('toppings', pizzaMenu.toppings, null, true);
    updateOrderSummary();
}

// Setup event listeners
function setupEventListeners() {
    // Quantity controls
    document.getElementById('decreaseQty')?.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            document.getElementById('quantityValue').textContent = quantity;
            updateOrderSummary();
        }
    });
    
    document.getElementById('increaseQty')?.addEventListener('click', () => {
        quantity++;
        document.getElementById('quantityValue').textContent = quantity;
        updateOrderSummary();
    });
    
    // Place order button
    document.getElementById('placeOrder')?.addEventListener('click', placeOrder);
}

// Update order summary
function updateOrderSummary() {
    const size = pizzaMenu.sizes.find(s => s.id === selectedSize);
    const crust = pizzaMenu.crusts.find(c => c.id === selectedCrust);
    const sauce = pizzaMenu.sauces.find(s => s.id === selectedSauce);
    const cheese = pizzaMenu.cheeses.find(c => c.id === selectedCheese);
    
    // Calculate base price
    let basePrice = size.price + crust.price + sauce.price + cheese.price;
    
    // Add toppings
    let toppingsPrice = 0;
    let toppingsList = [];
    
    selectedToppings.forEach(toppingId => {
        const topping = pizzaMenu.toppings.find(t => t.id === toppingId);
        if (topping) {
            toppingsPrice += topping.price;
            toppingsList.push(topping.name);
        }
    });
    
    // Calculate total
    const subtotal = (basePrice + toppingsPrice) * quantity;
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = 2.99;
    const total = subtotal + tax + deliveryFee;
    
    // Update summary UI
    document.getElementById('summarySize').textContent = `${size.name} Pizza`;
    document.getElementById('summaryCrust').textContent = crust.name;
    document.getElementById('summarySauce').textContent = sauce.name;
    document.getElementById('summaryCheese').textContent = cheese.name;
    document.getElementById('summaryToppings').textContent = 
        toppingsList.length > 0 ? toppingsList.join(', ') : 'None';
    document.getElementById('summaryQuantity').textContent = quantity;
    
    // Update prices
    document.getElementById('subtotalPrice').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxPrice').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('deliveryPrice').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

// Place order
function placeOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Create order object
    const order = {
        userId: currentUser.id,
        userName: currentUser.name,
        size: selectedSize,
        crust: selectedCrust,
        sauce: selectedSauce,
        cheese: selectedCheese,
        toppings: [...selectedToppings],
        quantity: quantity,
        total: parseFloat(document.getElementById('totalPrice').textContent.replace('$', '')),
        deliveryAddress: '123 Main St (Demo Address)' // In a real app, this would come from a form
    };
    
    // Save order to database
    const savedOrder = saveOrder(order);
    
    // Show success message
    alert(`Order placed successfully! Your order ID is: ${savedOrder.id}`);
    
    // Reset form
    selectedSize = 'medium';
    selectedCrust = 'regular';
    selectedSauce = 'tomato';
    selectedCheese = 'mozzarella';
    selectedToppings = [];
    quantity = 1;
    
    // Re-render everything
    renderPizzaOptions();
    document.getElementById('quantityValue').textContent = quantity;
    updateOrderSummary();
}