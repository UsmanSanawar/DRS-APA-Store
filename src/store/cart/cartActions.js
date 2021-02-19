import { toast } from "react-toastify";
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_UPDATE_QUANTITIES,
  ERROR,
  POST_SALE_ORDER,
  RESET_CART_PAID,
} from "./cartActionTypes";
import RestService from "../restService/restService";

export function postSaleOrder(formData) {
  return (dispatch) => {
    RestService.postSaleOrder(formData).then((response) => {
      if (response.data) {
        dispatch({
          type: POST_SALE_ORDER,
          response: response,
        });
      } else {
        dispatch({
          type: ERROR,
          response: response,
        });
      }
    });
  };
}

export function cartAddItemSuccess(
  product,
  options = [],
  quantity = 1,
  price,
  customer
) {
  product.price = price !== 0 && price !== null ? price : product.price;
  if (quantity > 0) {
    toast.success(
      `Product "${
        product.productName ? product.productName : product.name
      }" added to cart!`
    );
    return {
      type: CART_ADD_ITEM,
      product,
      options,
      quantity,
      customer,
    };
  } else {
    toast.error("Add quantity cannot be less then 1");
  }
}

export function cartRemoveItemSuccess(itemId) {
  return {
    type: CART_REMOVE_ITEM,
    itemId,
  };
}

export function cartUpdateQuantitiesSuccess(quantities) {
  return {
    type: CART_UPDATE_QUANTITIES,
    quantities,
  };
}

export function cartAddItem(
  product,
  options = [],
  quantity = 1,
  price = 0,
  customer
) {
  if (quantity > 0) {
    return (dispatch) =>
      new Promise((resolve) => {
          dispatch(
            cartAddItemSuccess(product, options, quantity, price, customer)
          );
          resolve();
      });
  } else {
    toast.error("Quantity cannot be less than 1")
  }
}

export function cartRemoveItem(itemId) {
  return (dispatch) =>
    new Promise((resolve) => {
      setTimeout(() => {
        dispatch(cartRemoveItemSuccess(itemId));
        resolve();
      }, 100);
    });
}

export function cartUpdateQuantities(quantities) {
  return (dispatch) =>
    new Promise((resolve) => {
      setTimeout(() => {
        dispatch(cartUpdateQuantitiesSuccess(quantities));
        resolve();
      }, 100);
    });
}

export function resetCartPaid(quantities) {
  // sending request to server, timeout is used as a stub
  return (dispatch) =>
    dispatch({
      type: RESET_CART_PAID,
      quantities,
    });
}
