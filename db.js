// Database simulation for Pizza App

// Initialize database if not exists
function initDatabase() {
    // Users database
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: '1',
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'demo123', // In a real app, this would be hashed
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    
    // Orders database
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    
    // Pizza menu database
    if (!localStorage.getItem('pizzaMenu')) {
        const pizzaMenu = {
            sizes: [
                { id: 'small', name: 'Small', price: 9.99 },
                { id: 'medium', name: 'Medium', price: 12.99 },
                { id: 'large', name: 'Large', price: 15.99 },
                { id: 'xlarge', name: 'Extra Large', price: 18.99 }
            ],
            crusts: [
                { id: 'thin', name: 'Thin Crust', price: 0 },
                { id: 'regular', name: 'Regular Crust', price: 0 },
                { id: 'thick', name: 'Thick Crust', price: 1.99 },
                { id: 'stuffed', name: 'Stuffed Crust', price: 2.99 }
            ],
            sauces: [
                { id: 'tomato', name: 'Tomato Sauce', price: 0 },
                { id: 'bbq', name: 'BBQ Sauce', price: 0.99 },
                { id: 'alfredo', name: 'Alfredo Sauce', price: 1.49 },
                { id: 'pesto', name: 'Pesto Sauce', price: 1.99 }
            ],
            cheeses: [
                { id: 'mozzarella', name: 'Mozzarella', price: 0 },
                { id: 'cheddar', name: 'Cheddar', price: 1.49 },
                { id: 'parmesan', name: 'Parmesan', price: 1.99 },
                { id: 'mixed', name: 'Mixed Cheese', price: 2.49 }
            ],
            toppings: [
                { id: 'pepperoni', name: 'Pepperoni', price: 1.99 },
                { id: 'mushrooms', name: 'Mushrooms', price: 1.49 },
                { id: 'onions', name: 'Onions', price: 1.49 },
                { id: 'sausage', name: 'Sausage', price: 2.49 },
                { id: 'bacon', name: 'Bacon', price: 2.49 },
                { id: 'olives', name: 'Olives', price: 1.49 },
                { id: 'peppers', name: 'Bell Peppers', price: 1.49 },
                { id: 'pineapple', name: 'Pineapple', price: 1.99 }
            ]
        };
        localStorage.setItem('pizzaMenu', JSON.stringify(pizzaMenu));
    }
}

// Get pizza menu data
function getPizzaMenu() {
    return JSON.parse(localStorage.getItem('pizzaMenu'));
}

// Save order to database
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Add order ID and timestamp
    const orderWithMeta = {
        ...order,
        id: 'order_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(orderWithMeta);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return orderWithMeta;
}

// Get user's orders
function getUserOrders(userId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders.filter(order => order.userId === userId);
}

// Initialize database when script loads
initDatabase();