import axios from 'axios'

//anonymous cart
const initialState = {
  items: []
}

const GET_CART = 'GET_CART'
const ADD_TO_CART = 'ADD_TO_CART'
// const UPDATE_CART = 'UPDATE_CART'
const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
const UPDATE_QUANTITY = 'UPDATE_QUANTITY'
const CHECKOUT = 'CHECKOUT'

export const getCart = data => {
  return {
    type: GET_CART,
    items: data.items,
    quantity: data.quantity,
    totalCost: data.totalCost
  }
}

export const addToCart = product => {
  return {
    type: ADD_TO_CART,
    product
  }
}

export const removeFromCart = restOfCart => {
  return {
    type: REMOVE_FROM_CART,
    restOfCart
  }
}

// export const updateCart = (productId, productUpdates) => {
//   return {
//     type: UPDATE_CART,
//     productId,
//     productUpdates
//   }
// }

export const updateQuantity = (productId, qty) => {
  return {
    type: UPDATE_QUANTITY,
    productId,
    qty
  }
}

export const checkout = () => {
  return {
    type: CHECKOUT
  }
}

export const getCartThunk = userId => {
  return async dispatch => {
    try {
      if (userId === undefined) {
        const {data} = await axios.get('/api/orders/cart')
        dispatch(getCart(data))
      } else {
        const {data} = await axios.get(`/api/orders/cart/${userId}`)
        dispatch(getCart(data))
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const addToCartThunk = productId => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`/api/orders/${productId}`)
      dispatch(addToCart(data))
    } catch (error) {
      console.error(error)
    }
  }
}

export const removeFromCartThunk = productId => {
  return async dispatch => {
    try {
      const {data} = await axios.delete(`/api/orders/${productId}`)
      dispatch(removeFromCart(data))
    } catch (error) {
      console.error(error)
    }
  }
}

// export const updateCartThunk = (productId, productUpdates => {
//   return async dispatch => {
//     try {
//       const updates = await axios.put('')
//     } catch(error) {
//       console.error(error)
//     }
//   }
// })

export const updateQuantityThunk = (productId, qty) => {
  return async dispatch => {
    try {
      const {data} = await axios.put(`/api/orders/${productId}/count/${qty}`)
      // dispatch(updateQuantity(productId, qty))
      getCartThunk(data)
    } catch (error) {
      console.error(error)
    }
  }
}
export const checkoutThunk = (address, billingInfo) => {
  return async dispatch => {
    try {
      console.log('in axios request...', address)
      await axios.put('/api/orders/checkout', {address, billingInfo})
      dispatch(checkout())
    } catch (error) {
      console.error(error)
    }
  }
}

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        items: action.items,
        quantity: action.quantity,
        totalCost: action.totalCost
      }
    case ADD_TO_CART:
      return {...state, items: [...state.items, action.product]}
    case UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.filter(el => {
          if (el.id === action.productId) {
            el.qty = action.qty
            return el
          }
        })
      }
    case REMOVE_FROM_CART:
      return {...state, items: action.restOfCart}
    case CHECKOUT:
      return initialState
    default:
      return state
  }
}
