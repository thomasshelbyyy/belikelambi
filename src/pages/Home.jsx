import { useEffect, useState } from "react"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import Rodal from "rodal";
// include styles
import 'rodal/lib/rodal.css';
import Card from "../components/Card";
import axios from "axios";
import CartCard from "../components/CartCard";
import Swal from "sweetalert2";

const Home = ()=> {
    const baseURL = "https://fakestoreapi.com/products"
    const { isLoggedIn, loggedInUser, handleCheckout } = useAuth()
    const [cartOpen, setCartOpen] = useState(false)
    const [items, setItems] = useState([])
    const [category, setCategory] = useState("all")
    const [categories, setCategories] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(()=> {
        const fetchCategories = async ()=> {
            try{
                const results = await axios.get(`${baseURL}/categories`)
                setCategories(results.data)
            } catch(error) {
                console.log(error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(()=> {
        const fetchData = async ()=> {
            try {
                let results = ""
                switch (category) {
                    case "all":
                        results = await axios.get(baseURL)
                        break;
                    case "electronics":
                        results = await axios.get(`${baseURL}/category/electronics`)
                        break;
                    case "jewelery":
                        results = await axios.get(`${baseURL}/category/jewelery`)
                        break;
                    case "men's clothing":
                        results = await axios.get(`${baseURL}/category/men's clothing`)
                        break;
                    case "women's clothing":
                        results = await axios.get(`${baseURL}/category/women's clothing`)
                        break;
                
                    default:
                        break;
                }
                setItems(results.data)
            } catch(error) {
                console.log(error)
            }
        }

        fetchData()
    }, [category])

    useEffect(()=> {
        if(loggedInUser && loggedInUser.cart) {
            const newTotal = loggedInUser.cart.reduce((total, item)=> total + item.price * item.quantity, 0)
            setTotalPrice(newTotal)
        }
    }, [loggedInUser, loggedInUser && loggedInUser.cart])
      

    const toggleCart = ()=> {
        setCartOpen(!cartOpen)
    }

    const closeCart = ()=> {
        setCartOpen(false)
    }

    const updateTotal = (newTotal)=> {
        setTotalPrice(newTotal)
    }

    const handleCheckoutClick = ()=> {
        if(totalPrice === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please add minimum 1 product!',
            })
        } else {
            Swal.fire({
                title: 'You want to checkout the product?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, checkout'
            }).then(result => {
                if(result.isConfirmed) {
                    Swal.fire({
                        title: 'Product checked out!',
                        icon: 'success'
                    })

                    handleCheckout(selectedItems)
                    setCartOpen(false)
                }
            })
        }
    }

    return(
        <div>
            <Header toggleCart={toggleCart} />

            <main className="main-content">
                <h1 className="title">Products</h1>
                <div className="categories-button-group">
                    <button className={`category-button ${category === "all" ? "active" : ""}`} onClick={()=> setCategory("all")}>All prducts</button>
                    {categories.length > 0 && categories.map((cat, i) => (
                        <button 
                        className={`category-button ${cat === category ? "active" : ""}`}
                        onClick={()=> setCategory(cat)} 
                        key={i}>
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="products-container">
                    {items.length > 0 && items.map(item => (
                        <Card 
                        key={item.id}
                        name={item.title} 
                        price={item.price}
                        image={item.image}
                        description={item.description}
                        rating={item.rating}
                        id={item.id}
                        
                        />
                    ))}
                </div>
            </main>
            <Rodal 
            width={window.innerWidth > 768 ? "800" : "300"}
            height={600}
            visible={cartOpen} 
            onClose={closeCart}
            showMask={true}
            closeOnEsc={true}
            closeMaskOnClick={true}
            className="rodal">
                <div className="cart-card-container">
                    {loggedInUser && loggedInUser.cart ? (
                        loggedInUser.cart.map((item,i)=> (
                            <CartCard
                            id={item.productId}
                            name={item.name}
                            price={item.price}
                            image={item.image}
                            quantity={item.quantity}
                            key={i}
                            updateTotal={updateTotal}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            />
                        ))
                    ) : ""}
                </div>
                <div className="checkout-section">
                    <div className="price">
                        <p>Total Price</p>
                        <p><span className="dollar-sign">$</span>{totalPrice.toFixed(2)}</p>
                    </div>
                    <button className="checkout-button" onClick={handleCheckoutClick}>Chekout</button>
                </div>
                
            </Rodal>
        </div>
    )
}

export default Home