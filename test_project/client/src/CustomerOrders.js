import React, { Component } from "react";
import { Link } from 'react-router-dom'; // Import Link component
// import logo from "./logo.svg";
import revsLogo from './revs-logo.png'
import editIcon from "./edit-icon.png";
import "./OrderScreen.css";
import OrderCompletePopUp from "./OrderCompletePopUp";
import MenuItemPopUp from "./MenuItemPopUp";

/**
 * @author Joanne Liu
 * Component for making customer order on order screen.
 */
class CustomerOrders extends Component {

    /**
     * Constructs a new instance of the customer order screen component.
     * 
     * @param {object} props The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            menuData: {}, // State to hold menu item name to price
            entrees: [], // State to hold entrees data
            sides: [],
            desserts: [],
            beverages: [], // State to hold beverages data
            seasonals: [],
            ingredientData: {},
            selectedItems: {}, // State to hold selected items
            showEntrees: false, // State to control rendering of entrees
            showSides: false, // State to control rendering of sides
            showDesserts: false, // State to control rendering of desserts
            showBeverages: false, // State to control rendering of beverages
            showSeasonals: false, // State to control rendering of seasonals
            total: 0,
            orderNumInput: [],
            isConfirmationOpen: false,
            currItem: {},
            currItemData: {},
            origCurrItem: {},
            menuItemOpen: false,
            isLoading: true,
            weather: "",
            tempCelsius: 0
        };
        this.orderNum = 0;
        this.fetchMenuData();
        this.fetchIngredientData();
        this.fetchOrderNum();
        this.fetchWeather();
    }

    /**
     * Executes when the component is mounted.
     * Calls methods to calculate the total, fetch saved data, and initialize Google Translate.
     * This lifecycle method is invoked immediately after a component is mounted.
     */
    componentDidMount() {
        this.fetchSavedData();
        this.calculateTotal();
        this.initializeGoogleTranslate();
    }

    /**
     * Initializes Google Translate API if not already initialized.
     * Adds a script tag to the document body to load the necessary Google Translate script asynchronously.
     * Sets up the callback function to initialize Google Translate when the script is loaded.
     */
    initializeGoogleTranslate() {
        if (!window.googleTranslateElementInit) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
            window.googleTranslateElementInit = this.googleTranslateElementInit.bind(this);
        }
    }

    /**
     * Callback function to initialize Google Translate once the script is loaded.
     * Creates a new Google Translate element with English as the page language.
     * @param {string} id - The id of the HTML element where the translation widget should be placed.
     */
    googleTranslateElementInit() {
        new window.google.translate.TranslateElement({ pageLanguage: "en" }, "google_translate_element");
    }


    /**
     * Fetches menu data from the specified API endpoint.
     * Parses the response JSON and updates the component's state with the menu data.
     */
    fetchMenuData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI") 
        // fetch("http://localhost:9000/menuItemsAPI") 
            .then(res => res.json())
            .then(res => {
                const menuDataMap = {};
                res.forEach(item => {
                    menuDataMap[item.item_name] = {price: item.price, descript: item.descript, picture: item.picture, veg: item.vegetarian, gf: item.glutenfree} ;
                });
                this.setState({ menuData: menuDataMap, showEntrees: false, showBeverages: false });
            })
            .catch(err => console.error(err));
    }

    /**
     * Fetches ingredient data from the specified API endpoint.
     * Parses the response JSON and updates the component's state with the ingredient data.
     */    
    fetchIngredientData() {
        // console.log("in locations");
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/ingredientData")
        // fetch("http://localhost:9000/customerOrdersAPI/ingredientData") 
        // fetch("http://localhost:9000/customerOrdersAPI/location") 
            .then(res => res.json())
            .then(res => {
                const ingredientMap = {};
                res.forEach(item => {
                    ingredientMap[item.ingredient_name] = {location: item.storage_location, custom: item.customizable};
                    // ingredientMap[item.ingredient_name] = {location: item.storage_location};
                });
                this.setState({ ingredientData: ingredientMap });
                // console.log(ingredientMap);
            })
            .catch(err => console.error(err));
    }
    
    /**
     * Fetches entrees data from the specified API endpoint and updates the component's state accordingly.
     */
    fetchEntreesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/entrees")
            .then(res => res.json())
            .then(res => this.setState({ entrees: res, showEntrees: true, showSides: false, showDesserts: false, showBeverages: false, showSeasonals: false }))
            .catch(err => console.error(err));
    }

    /**
     *Fetches beverages data from the specified API endpoint and updates the component's state accordingly.
     */
    fetchBeveragesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/beverages")
            .then(res => res.json())
            .then(res => this.setState({ beverages: res, showEntrees: false, showSides: false, showDesserts: false, showBeverages: true, showSeasonals: false }))
            .catch(err => console.error(err));
    }

    /**
     * Fetches sides data from the specified API endpoint and updates the component's state accordingly.
     */    
    fetchSidesData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/sides")
            .then(res => res.json())
            .then(res => this.setState({ sides: res, showEntrees: false, showSides: true, showDesserts: false, showBeverages: false, showSeasonals: false }))            
            .catch(err => console.error(err));
    }


    /**
     * Fetches desserts data from the specified API endpoint and updates the component's state accordingly.
     */
    fetchDessertsData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/desserts")
            .then(res => res.json())
            .then(res => this.setState({ desserts: res, showEntrees: false, showSides: false, showDesserts: true, showBeverages: false, showSeasonals: false }))
            .catch(err => console.error(err));
    }

    /**
     * Fetches seasonals data from the specified API endpoint and updates the component's state accordingly.
     */    
    fetchSeasonalsData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/seasonals")
            .then(res => res.json())
            .then(res => this.setState({ seasonals: res, showEntrees: false, showSides: false, showDesserts: false, showBeverages: false, showSeasonals: true }))            
            .catch(err => console.error(err));
    }

    /**
     * Fetches saved data from the customer submit class and updates the component's state accordingly.
     */
    fetchSavedData() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/savedData")
        // fetch("http://localhost:9000/customerOrdersAPI/savedData") 
            .then(res => res.json())
            .then(res => {
                if (res && Object.keys(res).length > 0) {
                    this.setState({ selectedItems: res }, this.calculateTotal);
                } else {
                    // if res was empty
                    this.setState({ selectedItems: {} });
                }
            })          
            .catch(err => console.error(err));
    }

    /**
     * Fetches current ingredients for a specific menu item from the ingredients database in the backend.
     * @param {string} menuItemName - The name of the menu item to fetch ingredients for.
     */
    fetchCurrIngredients(menuItemName) {
        fetch(`https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuIngredientsAPI/ingredients/${menuItemName}`)
            .then(response => response.json())
            .then(data => {
            // console.log('Fetched menu item ingredients:', data);
            const parsedData = data.reduce((acc, ingredient) => {
                // Check if the current item exists in the accumulator
                if (!acc[ingredient.menu_item_name]) {
                    // If not, create a new entry with an empty array for ingredients
                    acc[ingredient.menu_item_name] = {
                        item: ingredient.menu_item_name,
                        ingredients: []
                    };
                }
                // Push the ingredient (name and quantity pair) into the ingredients array for the corresponding menu item
                acc[ingredient.menu_item_name].ingredients.push({
                    name: ingredient.ingredient_name,
                    quantity: ingredient.quantity
                });
                return acc;
            }, {});

            const {menuData} = this.state;

            const currentItem = parsedData[menuItemName];
            
            // Make a deep copy of currItem
            const origCurrentItem = JSON.parse(JSON.stringify(currentItem));

            this.setState({
                currItem: parsedData[menuItemName],
                origCurrItem: origCurrentItem,
                currItemData: {price: menuData[menuItemName].price, descript: menuData[menuItemName].descript, picture: menuData[menuItemName].picture, veg: menuData[menuItemName].veg, gf: menuData[menuItemName].gf},
                isLoading: false
            });
        })
        .catch(error => console.error('Error fetching ingredients:', error)); 
    }

    /**
     * Fetches weather data from the specified API endpoint and updates the component's state accordingly.
     */
    fetchWeather() {
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/menuItemsAPI/weather")
        // fetch("http://localhost:9000/menuItemsAPI/weather") 
            .then(response => response.json())
            .then(data => {
                const description = data.weather[0].main;
                const temperature = data.main.temp;

                console.log("Description:", description);
                console.log("Temperature:", temperature);

                this.setState({weather: description, tempCelsius: temperature});
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });
    }

    /**
     * Renders weather information in the component.
     * @returns {JSX.Element} - JSX containing weather information.
     */
    renderWeather() {
        const {weather, tempCelsius} = this.state;
        // Convert Celsius to Fahrenheit
        const tempFahrenheit = (tempCelsius * 9/5) + 32;

        // Round the result to two decimal places
        const temp = tempFahrenheit.toFixed(2);

        // Get current date and time
        const currentDate = new Date();
        const dateOptions = { weekday: 'short', month: 'numeric', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

        const dateString = currentDate.toLocaleDateString('en-US', dateOptions);
        const timeString = currentDate.toLocaleTimeString('en-US', timeOptions);

        return (
            <div className = "right-logo">
                <p className = "bold-date">{dateString} {timeString}</p>
                <p>{weather} </p>
                <p>{tempCelsius} &deg;C / {temp}  &deg;F </p>
            </div>
        )
    }

    /**
     * Renders the list of selected items in the right sidebar of the component.
     * @returns {JSX.Element} - JSX containing the list of selected items and the total price.
     */
    renderSelectedItems() {
        const { selectedItems, total } = this.state;
        // console.log("in render selected", selectedItems);
        return (
            <div className="right-sidebar">
                <h2>Order</h2>
                <div className="selected-items-container">
                    <div className = "edit-button-container">
                        <Link to="/customerSubmit">
                            <button className = "edit-button" onClick={() => this.handleCheckOut()}>
                                <img src={editIcon} alt="Edit" />
                            </button>
                        </Link>
                    </div>
                    <div className="selected-items-list">
                    {Object.entries(selectedItems).map(([itemName, selectedItem]) => (
                        <div key={itemName} className="selected-item">
                            <div className="item-info">
                                <div className="quantity-buttons">
                                    <p>{selectedItem.quantity}</p>
                                    <div style={{ width: '10px' }}></div>
                                    <button className="quantity-button" onClick={() => this.handleQuantityChange(itemName, 'increase')}>+</button>
                                    <button className="quantity-button" onClick={() => this.handleQuantityChange(itemName, 'decrease')}>-</button>
                                </div>
                            </div>
                            <div className="item-name">
                                <p>{selectedItem.name}</p>
                            </div>
                            <p className="item-price">${(selectedItem.quantity * selectedItem.price).toFixed(2)}</p>
                        </div>
                    ))}
                    </div>
                </div>
                <p>Total: ${total.toFixed(2)}</p>
                <div className = "next-button-container">
                    <Link to="/customerSubmit" className = "link-button">
                        <button onClick={() => this.handleCheckOut()}>Next</button>
                    </Link>
                </div>
            </div>
        );
    }

    /**
     * Handles the click event when a menu item is clicked to display its details.
     * @param {string} itemName - The name of the menu item clicked.
     */
    handleItemClick(itemName) {
        this.fetchCurrIngredients(itemName);
        this.toggleMenuItemPopUp();
    }

    /**
     * Adds an item to the selected items list and updates the total price.
     * @param {object} newItem - The new item to be added.
     */
    addItem = (newItem) => {
        const { menuData, selectedItems, origCurrItem} = this.state;
        this.toggleMenuItemPopUp();
        const price = menuData[newItem.item].price;
        if (price !== undefined) { // Check if price is defined
            const updatedItems = { ...selectedItems };
            if (updatedItems[newItem.item]) {
                updatedItems[newItem.item].quantity += 1; // Increase quantity if item already exists
                // make deep copy of first instance
                // const newItemIngredients = updatedItems[newItem.item].ingredients[0].map(ingredient => ({ ...ingredient }));
                updatedItems[newItem.item].ingredients.push(newItem.ingredients);
            } else {
                updatedItems[newItem.item] = {name: newItem.item, quantity: 1, price: price, ingredients: [origCurrItem.ingredients, newItem.ingredients]}; // Default quantity is 1
            }
            this.setState({ selectedItems: updatedItems }, this.calculateTotal);
        }
    }

    /**
     * Removes the details of the currently displayed menu item. Function for when use clicks cancel on menu item pop-up
     * @param {string} itemName - The name of the item to be removed.
     */
    removeItem = (itemName) => {
        this.setState({
            currItem: {},
            currItemData: {},
            isLoading: true
        });
        this.toggleMenuItemPopUp();
    }

    /**
     * Updates the current item with the provided updated ingredients.
     * @param {object} updatedIngredients - The updated ingredients of the current item.
     */
    updateItem = (updatedIngredients) => {
        this.setState({currItem: updatedIngredients});
    }

    /**
     * Renders entrees as buttons in the component.
     * @returns {JSX.Element} - JSX containing entrees as buttons.
     */
    renderEntrees() {
        const { entrees, menuItemOpen, currItem, currItemData, isLoading, menuData, ingredientData } = this.state;
        return (
            <div>
                <h2>Entrees</h2>
                {menuItemOpen && !isLoading && (
                    <MenuItemPopUp
                        onAdd={this.addItem}
                        onRemove = {this.removeItem}
                        update = {this.updateItem}
                        menuItem = {currItem}
                        menuItemData = {currItemData}
                        ingredientData = {ingredientData}
                    />
                )}
                <div className="items-container">
                    {entrees.map(item => (
                        // only prints if price is positive
                        item.price > 0 &&
                        <div className="order-button-container" key={item.item_name}>
                            <button onClick={() => this.handleItemClick(item.item_name)}>
                                <img src={menuData[item.item_name].picture} alt="menu item" class="button-image"></img>
                                <span class="button-text">{item.item_name} &emsp; ${item.price} </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /**
     * Renders beverages as buttons in the component.
     * @returns {JSX.Element} - JSX containing entrees as buttons.
     */
    renderBeverages() {
        const { beverages, menuItemOpen, currItem, isLoading, menuData, currItemData, ingredientData } = this.state;
        return (
            <div>
                <h2>Beverages</h2>
                {menuItemOpen && !isLoading && (
                    <MenuItemPopUp
                        onAdd={this.addItem}
                        onRemove = {this.removeItem}
                        update = {this.updateItem}
                        menuItem = {currItem}
                        menuItemData = {currItemData}
                        ingredientData = {ingredientData}
                    />
                )}
                <div className="items-container">
                    {beverages.map(item => (
                        // only prints if price is positive
                        item.price > 0 &&
                        <div className="order-button-container" key={item.item_name}>
                            <button onClick={() => this.handleItemClick(item.item_name)}>
                                <img src={menuData[item.item_name].picture} alt="menu item" class="button-image"></img>
                                <span class="button-text">{item.item_name} &emsp; ${item.price} </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /**
     * Renders sides as buttons in the component.
     * @returns {JSX.Element} - JSX containing entrees as buttons.
     */
    renderSides() {
        const { sides, menuItemOpen, currItem, isLoading, menuData, currItemData, ingredientData} = this.state;
        return (
            <div>
                <h2>Sides</h2>
                {menuItemOpen && !isLoading && (
                    <MenuItemPopUp
                        onAdd={this.addItem}
                        onRemove = {this.removeItem}
                        update = {this.updateItem}
                        menuItem = {currItem}
                        menuItemData = {currItemData}
                        ingredientData = {ingredientData}
                    />
                )}
                <div className="items-container">
                    {sides.map(item => (
                        // only prints if price is positive
                        item.price > 0 &&
                        <div className="order-button-container" key={item.item_name}>
                            <button onClick={() => this.handleItemClick(item.item_name)}>
                                <img src={menuData[item.item_name].picture} alt="menu item" class="button-image"></img>
                                <span class="button-text">{item.item_name} &emsp; ${item.price}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /**
     * Renders desserts as buttons in the component.
     * @returns {JSX.Element} - JSX containing entrees as buttons.
     */
    renderDesserts() {
        const { desserts, menuItemOpen, currItem, isLoading, menuData, currItemData, ingredientData} = this.state;
        return (
            <div>
                <h2>Desserts</h2>
                {menuItemOpen && !isLoading && (
                    <MenuItemPopUp
                        onAdd={this.addItem}
                        onRemove = {this.removeItem}
                        update = {this.updateItem}
                        menuItem = {currItem}
                        menuItemData = {currItemData}                        
                        ingredientData = {ingredientData}
                    />
                )}
                <div className="items-container">
                    {desserts.map(item => (
                        // only prints if price is positive
                        item.price > 0 &&
                        <div className="order-button-container" key={item.item_name}>
                            <button onClick={() => this.handleItemClick(item.item_name)}>
                                <img src={menuData[item.item_name].picture} alt="menu item" class="button-image"></img>
                                <span class="button-text">{item.item_name} &emsp; ${item.price}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /**
     * Renders seasonals as buttons in the component.
     * @returns {JSX.Element} - JSX containing entrees as buttons.
     */
    renderSeasonals() {
        const { seasonals, menuItemOpen, currItem, isLoading, menuData, currItemData, ingredientData } = this.state;
        return (
            <div>
                <h2>Seasonal Items</h2>
                {menuItemOpen && !isLoading && (
                    <MenuItemPopUp
                        onAdd={this.addItem}
                        onRemove = {this.removeItem}
                        update = {this.updateItem}
                        menuItem = {currItem}
                        menuItemData = {currItemData}
                        ingredientData = {ingredientData}
                    />
                )}
                <div className="items-container">
                    {seasonals.map(item => (
                        // only prints if price is positive
                        item.price > 0 &&
                        <div className="order-button-container" key={item.item_name}>
                            <button onClick={() => this.handleItemClick(item.item_name)}>
                                <img src={menuData[item.item_name].picture} alt="menu item" class="button-image"></img>
                                <span class="button-text">{item.item_name} &emsp; ${item.price}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    /**
     * Calculates the total price of selected items and updates the component's state.
     */
    calculateTotal() {
        const { selectedItems } = this.state;
        let total = 0;
        Object.values(selectedItems).forEach(selectedItem => {
            total += selectedItem.quantity * selectedItem.price;
        });
        this.setState({ total: total });
    }

    /**
     * Fetches the order number from the API endpoint and updates the component's state.
     */
    fetchOrderNum() {
        // fetch("http://localhost:9000/customerOrdersAPI/orderNum") 
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/orderNum")
            .then(res => res.json())
            .then(res => this.setState({ orderNumInput: res}))            
            .catch(err => console.error(err));
    }

    /**
     * Toggles the confirmation pop-up.
     */
    toggleConfirmationPopUp = () => {
        this.setState(prevState => ({ isConfirmationOpen: !prevState.isConfirmationOpen }));
    };

    /**
     * Toggles the menu item pop-up.
     */
    toggleMenuItemPopUp = () => {
        // console.log("in toggle Menu item");
        this.setState(prevState => ({ menuItemOpen: !prevState.menuItemOpen }));
    };

    /**
     * Reloads the page by resetting selected items, total price, and closing confirmation pop-up.
     */
    reloadPage = () => {
        this.setState({selectedItems: {}, total: 0, isConfirmationOpen: false});
        window.location.reload();
    };

    /**
     * Handles the submission of the order. Sends a POST request to the server with order details.
     */
    handleSubmit() {
        const { total, orderNumInput, selectedItems } = this.state;

        // console.log("This is handleSubmit", orderNumInput);
        this.orderNum = orderNumInput[0].max + 1;
        // console.log("This is handleSubmit number", this.orderNum);
        const currentDate = new Date();

        // Extract year, month, and day
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are 0-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Construct the formatted date string
        const order_date = `${year}-${month}-${day}`;

        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        // Construct the formatted time string
        const order_time = `${hours}:${minutes}:${seconds}`;

        // console.log(order_date);
        // console.log(order_time);

        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/submit", {
        // fetch("http://localhost:9000/customerOrdersAPI/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({orderNum: this.orderNum, total, order_date, order_time})
        })
        .then(() => {
            // Show pop up window for order confirmation
            // this.toggleConfirmationPopUp();
        })
        .catch(error => {
            console.error("Error submitting order:", error);
            // Show a pop-up message if there's an error submitting the order
            window.alert("Error submitting order. Please try again later.");
        })

        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/submitDetails", {
        // fetch("http://localhost:9000/customerOrdersAPI/submitDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({orderNum: this.orderNum, selectedItems})
        })
        .then(() => {
            // Show pop up window for order confirmation
            this.toggleConfirmationPopUp();
        })
        .catch(error => {
            console.error("Error submitting order:", error);
            // Show a pop-up message if there's an error submitting the order
            window.alert("Error submitting order. Please try again later.");
        })


    }

    /**
     * Handles the checkout process. Sends a POST request to the server to save selected items.
     */
    handleCheckOut = () => {
        const { selectedItems } = this.state;
        fetch("https://project-3-full-stack-agile-web-project-3-uub4.onrender.com/customerOrdersAPI/save", {
        // fetch("http://localhost:9000/customerOrdersAPI/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({selectedItems})
        })
        .then(() => {
            // Show pop up window for order confirmation
            // this.toggleConfirmationPopUp();
            console.log("handle checkout: data saved");
            console.log(selectedItems);
        })
        .catch(error => {
            console.error("Error saving order:", error);
            // Show a pop-up message if there's an error submitting the order
            window.alert("Error loading check out screen. Please try again later.");
        });
    };

    /**
     * Handles quantity changes of selected items.
     * @param {string} itemName - The name of the item whose quantity is to be changed.
     * @param {string} type - The type of quantity change, either 'increase' or 'decrease'.
     */
    handleQuantityChange(itemName, type) {
        const { selectedItems } = this.state;
        const updatedItems = { ...selectedItems };
        switch (type) {
            case 'increase':
                // make deep copy of first instance
                const newItemIngredients = updatedItems[itemName].ingredients[0].map(ingredient => ({ ...ingredient }));
                updatedItems[itemName].ingredients.push(newItemIngredients);
                updatedItems[itemName].quantity++;
                break;
            case 'decrease':
                if (updatedItems[itemName].quantity > 1) {
                    updatedItems[itemName].ingredients.pop();
                    updatedItems[itemName].quantity--;
                } else {
                    // remove item if quantity < 1
                    delete updatedItems[itemName];
                }
                break;
            default:
                break;
        }
        this.setState({ selectedItems: updatedItems }, this.calculateTotal);
    }

    /**
     * Renders the cashier order screen.
     * Displays various components such as entrees, sides, desserts, beverages, seasonals,
     * selected items, and order confirmation popup.
     * 
     * @returns {JSX.Element} The JSX element representing the order screen.
     */
    render() {
        const { showEntrees, showBeverages, showSides, showDesserts, showSeasonals, isConfirmationOpen, total } = this.state;

        const penTextSize = localStorage.getItem('textsize');
        document.documentElement.style.setProperty('--text-size', penTextSize);
        const penTextWeight = localStorage.getItem('boldtext');
        document.documentElement.style.setProperty('--bold-text', penTextWeight);

        return (
            <div>
                <header className = "order-screen-header">
                    <div className = "header-content">
                        <img src={revsLogo} alt="Rev's American Grill Logo" className = "left-logo"/>
                        <div className = "middle-text">
                            <h1>Order Screen</h1>
                        </div>
                        {this.renderWeather()}
                    </div>
                </header>
                <div className="App1" style={{fontSize:(localStorage.getItem('textsize')*16), fontWeight: localStorage.getItem('boldtext'), filter: `invert(${localStorage.getItem('colorinv')})`}}>
                    <a href="https://project-3-full-stack-agile-web-project-3-jvj4.onrender.com/settings"><button id="settingsbutton">Settings</button></a>
                    <div className="sidebar">
                        <button className={showEntrees ? 'active' : ''} onClick={() => this.fetchEntreesData()}>Entrees</button>
                        <button className={showSides ? 'active' : ''} onClick={() => this.fetchSidesData()}>Sides</button>
                        <button className={showDesserts ? 'active' : ''} onClick={() => this.fetchDessertsData()}>Desserts</button>
                        <button className={showBeverages ? 'active' : ''} onClick={() => this.fetchBeveragesData()}>Beverages</button>
                        <button className={showSeasonals ? 'active' : ''} onClick={() => this.fetchSeasonalsData()}>Seasonals</button>
                        {/* {this.renderWeather()} */}
                    </div>
                    <div className="main">
                        {showEntrees && this.renderEntrees()}
                        {showSides && this.renderSides()}
                        {showDesserts && this.renderDesserts()}
                        {showBeverages && this.renderBeverages()}
                        {showSeasonals && this.renderSeasonals()}
                    </div>
                    {this.renderSelectedItems()}

                    {isConfirmationOpen && (
                        <OrderCompletePopUp
                            onClose={this.reloadPage}
                            orderNumber = {this.orderNum}
                            totalPrice = {total}
                        />
                    )}
                </div>
                <div id="google_translate_element"></div>
            </div>
        );
    }
}
export default CustomerOrders;
