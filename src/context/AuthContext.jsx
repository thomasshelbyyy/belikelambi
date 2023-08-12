import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    if(!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]))
    }
  }, []);

  const getParsedUsers = ()=> {
    const storedUsers = localStorage.getItem("users")
    return JSON.parse(storedUsers)
  }

  const register = (userData) => {
    const storedUsers = localStorage.getItem('users')
    const parsedStoredUsers = JSON.parse(storedUsers)
    const getUser = parsedStoredUsers.find(user => user.email === userData.email)
    if(getUser) {
        Swal.fire({
          icon: 'error',
                title: 'Oops...',
                text: 'Email already taken',
        })
        return false
    } else {
      const updatedUsers = [...parsedStoredUsers, userData]
        localStorage.setItem('users', JSON.stringify(updatedUsers) )
        return true
    }
  }

  const login = (userData) => {
    const storedUsers = localStorage.getItem('users')
    const parsedStoredUsers = JSON.parse(storedUsers)
    const getUser = parsedStoredUsers.find(user => user.email === userData.email && user.password === userData.password)
    if(getUser) {
        setLoggedInUser(getUser)
        setIsLoggedIn(true)
        return true
    } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'username or password wrong',
        })
        return false
    }
  };

  const logout = () => {
    setIsLoggedIn(false)
    setLoggedInUser(null);
  };

  const addToCart = (product)=> {
    const storedUsers = localStorage.getItem("users")
    const parsedStoredUsers = JSON.parse(storedUsers)
    const getUser = parsedStoredUsers.find(user => user.email === loggedInUser.email)

    // find the same product
    const duplicateProduct = getUser.cart.find(item => item.name === product.name)
    if(duplicateProduct) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'product already in the cart',
      })
      return false
    }

    let updatedUser
    if(!getUser.cart) {
      updatedUser = {...getUser, cart: [product]}
    } else {
      updatedUser = {...getUser, cart: [...getUser.cart, product]}
    }
    const updatedUsers = [updatedUser, ...parsedStoredUsers.filter(user => user.email !== loggedInUser.email )]
    toast.success(`${product.name} added to cart`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  });
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setLoggedInUser(updatedUser)
  }

  const removeCart = (id) => {
    const parsedUsers = getParsedUsers()
    const removedCarts = loggedInUser.cart.filter(cart => cart.productId !== id)
    const updatedUser = {...loggedInUser, cart: removedCarts}
    const updatedUsers = [updatedUser, ...parsedUsers.filter(user => user.email !== loggedInUser.email)]

    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setLoggedInUser(updatedUser)
  }

  const handleQuantityChange = (id, newQuantity) => {
    const parsedUsers = getParsedUsers();
    // FIND THE PRODUCT THAT WE WANT TO UPDATE THE QUANTITY
    const getProduct = loggedInUser.cart.find(item => item.productId === id);

    // FIND THE INDEX OF THE PRODUCT THAT WE WANT TO UPDATE
    const updatedProductIndex = loggedInUser.cart.findIndex(item => item.productId === id);

    // REMOVE THE OLD CART OBJECT BEFORE ADDING THE NEW ONE
    const removedProduct = loggedInUser.cart.filter(item => item.productId !== id);

    // CHANGE THE QUANTITY VALUE USING OBJECT DESTRUCTURING
    const updatedQuantity = { ...getProduct, quantity: newQuantity };

    // INSERT THE UPDATED PRODUCT BACK AT ITS ORIGINAL POSITION
    removedProduct.splice(updatedProductIndex, 0, updatedQuantity);

    // UPDATE THE USER
    const updatedUser = { ...loggedInUser, cart: removedProduct };

    // FINALLY UPDATE THE USERS
    const updatedUsers = [updatedUser, ...parsedUsers.filter(user => user.email !== loggedInUser.email)];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setLoggedInUser(updatedUser);
  }

  const handleCheckout = (selectedItems)=> {
    const parsedUsers = getParsedUsers()
    const remainingItems = loggedInUser.cart.filter(item => !selectedItems.includes(item.productId))

    const updatedUser = {...loggedInUser, cart: remainingItems}
    const updatedUsers = [updatedUser, ...parsedUsers.filter(user => user.email !== loggedInUser.email)]
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setLoggedInUser(updatedUser)
  }


  return (
    <AuthContext.Provider value={{ loggedInUser,isLoggedIn, login, logout, register, addToCart, handleQuantityChange, removeCart, handleCheckout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
