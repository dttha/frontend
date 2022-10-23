import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { ip } from "./configs/ip";

export const Store = createContext()

const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null, 
    cart: {
        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod: localStorage.getItem('paymentMethod')
            ? localStorage.getItem('paymentMethod')
            : '',
        shippingMethod: localStorage.getItem('shippingMethod')
            ? localStorage.getItem('shippingMethod')
            : '',
        // refesh trang nhung van giu nguyen trang do
        cartItems: [],
        cartId: null,
    }
}
function reducer(state, action) {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            //add to cart 
            const newItem = action.payload
            const existItem = state.cart.cartItems.find(
                (item) => item._id === newItem._id
            )
            const cartItems = existItem
                ? state.cart.cartItems.map(item =>
                    item._id === existItem._id ? newItem : item
                )
                : [...state.cart.cartItems, newItem]
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }
        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            )
            localStorage.setItem('cartItems', JSON.stringify(cartItems))
            return { ...state, cart: { ...state.cart, cartItems } }
        }
        case 'GET_CART_SUCCESS': {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartId: action.payload.cart._id,
                    cartItems: action.payload.cart.cartItems.map((i) => {
                        return {
                            ...i.product,
                            quantity: i.quantity
                        }
                    })
                }
            }
        }
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } }
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload }
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
                cart: {
                    cartItems: [],
                    shippingAddress: {},
                }
            }
        case 'SAVE_SHIPPING_ADDRESS':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: action.payload
                }
            }
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart: { ...state.cart, paymentMethod: action.payload },
            };
        case 'SAVE_SHIPPING_METHOD':
            return {
                ...state,
                cart: { ...state.cart, shippingMethod: action.payload },
            }
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);    
    const value = { state, dispatch }
    console.log(state);
    useEffect(() => {
        if (state.cart.cartId && state?.userInfo?.token && state.cart?.cartItems) {
            const updateCart = async () => {
                await axios.put(
                    `${ip}/api/cart/${state.cart.cartId}`,
                    {
                        cartItems: state.cart.cartItems.map((i) => {
                            return {
                                product: i._id,
                                quantity: i.quantity
                            }
                        })
                    },
                    {
                        headers: { Authorization: `Bearer ${state.userInfo.token}` },
                    }
                );
            }
            updateCart()
        }
    }, [state.cart?.cartItems, state.cart?.cartId, state?.userInfo?.token])
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}