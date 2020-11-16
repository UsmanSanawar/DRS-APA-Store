import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_UPDATE_QUANTITIES,
    POST_SALE_ORDER,
    RESET_CART_PAID
} from './cartActionTypes';


/**
 * @param {array} items
 * @param {object} product
 * @param {array} options
 * @return {number}
 */
function findItemIndex(items, product, options) {
    return items.findIndex((item) => {
        if (item.product.id !== product.id || item.options.length !== options.length) {
            return false;
        }

        for (let i = 0; i < options.length; i += 1) {
            const option = options[i];
            const itemOption = item.options.find(itemOption => (
                itemOption.optionId === option.optionId && itemOption.valueId === option.valueId
            ));

            if (!itemOption) {
                return false;
            }
        }

        return true;
    });
}

function calcDiscounts(items) {
    return items.reduce((discount, item) => discount + item.discount, 0);
}

function calcTaxes(items) {
    return items.reduce((tax, item) => tax + item.tax, 0);
}

function calcSubtotal(items) {
    return items.reduce((subtotal, item) => subtotal + item.productTotal, 0);
}

function calcQuantity(items) {
    return items.reduce((quantity, item) => quantity + item.quantity, 0);
}

function calcTotal(subtotal, extraLines) {
    return subtotal + extraLines.reduce((total, extraLine) => total + extraLine.price, 0);
}

function addItem(state, product, options, quantity = 0) {
    // const itemIndex = findItemIndex(state.items, product, options);

    let newItems;
    let { lastItemId } = state;

    // if (itemIndex === -1) {


    let handleDiscount = (item) => {
        let product = item;
        console.log(product, "sdasdsadasdsadasdas", product.discountProducts)
        let discountedPrice = 0

        product.discountProducts && product.discountProducts.map(p => {
            if (p.discount.customerGroupId === 2) {
                discountedPrice = ((quantity * product.price * p.discount.discountPercentage) / 100)
            }
        })


        return parseFloat(discountedPrice)
    }

    let handleTaxCalc = (item) => {
        let taxClass = product.taxClass;
        let taxApply = 0;
        let rates = []

        for (let tax of taxClass.taxRates) {
            if (tax.taxRatesCustomerGroups.some(row => row.customerGroupId === 14)) {
                rates.push(tax.rate)
            }
        }

        let sum = rates.reduce(function (a, b) { return a + b }, 0)
        let totalPrice = (product.price * quantity) - handleDiscount(item)

        taxApply = (totalPrice * sum) / 100
        return parseFloat(taxApply)
    }

    let handleTotalPerRow = (item) => {
        return ((product.price * quantity) - handleDiscount(item)) + handleTaxCalc(item)
    }


    let discount = 0;
    discount = discount + handleDiscount(product)

    let tax = 0
    tax = tax + handleTaxCalc(product)

    let productTotal = 0
    productTotal = productTotal + handleTotalPerRow(product)

    lastItemId += 1;
    newItems = [...state.items, {
        id: lastItemId,
        product: JSON.parse(JSON.stringify(product)),
        options: JSON.parse(JSON.stringify(options)),
        price: product.price,
        discount: discount,
        tax: tax,
        productTotal: productTotal,
        total: product.price * quantity,
        quantity,
    }];

    console.log(newItems, "newItems")

    const totalDiscounts = calcDiscounts(newItems);
    const totalTaxs = calcTaxes(newItems);
    const subtotal = calcSubtotal(newItems);
    const total = calcTotal(subtotal, state.extraLines);

    return {
        ...state,
        lastItemId,
        subtotal,
        total,
        totalDiscounts,
        totalTaxs,
        items: newItems,
        quantity: calcQuantity(newItems),
    };
}

function removeItem(state, itemId) {
    const { items } = state;
    const newItems = items.filter(item => item.id !== itemId);

    const totalDiscounts = calcDiscounts(newItems);
    const totalTaxs = calcTaxes(newItems);
    const subtotal = calcSubtotal(newItems);
    const total = calcTotal(subtotal, state.extraLines);

    return {
        ...state,
        items: newItems,
        quantity: calcQuantity(newItems),
        totalDiscounts,
        totalTaxs,
        subtotal,
        total,
    };
}

function updateQuantities(state, quantities) {
    let needUpdate = false;

    const newItems = state.items.map((item) => {
        const quantity = quantities.find(x => x.itemId === item.id && x.value !== item.quantity);

        if (!quantity) {
            return item;
        }

        needUpdate = true;

        return {
            ...item,
            quantity: quantity.value,
            total: quantity.value * item.price,
        };
    });

    if (needUpdate) {
        const totalDiscounts = calcDiscounts(newItems);
        const totalTaxs = calcTaxes(newItems);
        const subtotal = calcSubtotal(newItems);
        const total = calcTotal(subtotal, state.extraLines);

        return {
            ...state,
            items: newItems,
            quantity: calcQuantity(newItems),
            subtotal,
            total,
            totalDiscounts,
            totalTaxs
        };
    }

    return state;
}

/*
* item example:
* {
*   id: 1,
*   product: {...}
*   options: [
*     {optionId: 1, optionTitle: 'Color', valueId: 1, valueTitle: 'Red'}
*   ],
*   price: 250,
*   quantity: 2,
*   total: 500
* }
* extraLine example:
* {
*   type: 'shipping',
*   title: 'Shipping',
*   price: 25
* }
*/
const initialState = {
    lastItemId: 0,
    quantity: 0,
    items: [],
    subtotal: 0,
    totalDiscounts: 0,
    totalTaxs: 0,
    paid: false,
    saleOrder: [],
    extraLines: [ // shipping, taxes, fees, .etc
        // {
        //     type: 'shipping',
        //     title: 'Shipping',
        //     price: 25,
        // },
        // {
        //     type: 'tax',
        //     title: 'Tax',
        //     price: 0,
        // },
    ],
    total: 0,
    orderId: null,

};

export default function cartReducer(state = initialState, action) {
    switch (action.type) {
        case CART_ADD_ITEM:
            return addItem(state, action.product, action.options, action.quantity);

        case CART_REMOVE_ITEM:
            return removeItem(state, action.itemId);

        case CART_UPDATE_QUANTITIES:
            return updateQuantities(state, action.quantities);

        case POST_SALE_ORDER: {
            console.log(state, "Request")
            let responseData = action.response.data;

            console.log(action.response, "action.responseSaleOrder")

            let orderId = null
            if (responseData.status === "success") {
                let order = []
                order.push(responseData.data)
                state.orderId = responseData.data.orderId
                localStorage.setItem('orders', JSON.stringify(order && order.length > 0 ? order : []))
            }


            return {
                ...initialState,
                paid: true,
                orderId: state.orderId
                // saleOrder: state.saleOrder
            };
        }

        case RESET_CART_PAID: {
            return {
                ...initialState,
                paid: false,
                orderId: null
            };
        }

        default:
            return state;
    }
}
