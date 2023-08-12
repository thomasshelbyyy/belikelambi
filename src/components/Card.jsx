import { useState } from "react";
import { GiRoundStar, GiShoppingCart } from "react-icons/gi"
import Rodal from "rodal"
import 'rodal/lib/rodal.css';
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Card = ({ name, price, image, description, rating, id }) => {

    const {isLoggedIn, addToCart} = useAuth()

    const [detailOpen, setDetailOpen] = useState(false)

    const handleDetailOpen = ()=> {
        setDetailOpen(!detailOpen)
    }

    const closeDetail = ()=> {
        setDetailOpen(false)
    }

    const handleAddToCart = (id) => {
        if(!isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please login to add this product to cart',
            })
        } else {
            

            const product = {
                productId: id,
                name: name,
                price: price,
                image: image,
                quantity: 1
            }
            addToCart(product)
        }
    }

    return(
        <div className="product-card">
            <img src={image} alt={name} className="product-image" />
            <h3 className="product-name">{name}</h3>
            <p className="product-price">${price}</p>
            <button className="detail-button" onClick={handleDetailOpen}>Detail</button>
            <button className="add-to-cart-button" onClick={()=> handleAddToCart(id)}><GiShoppingCart /> Add to cart</button>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <Rodal 
            visible={detailOpen} 
            onClose={closeDetail}
            height={600}
            width={window.innerWidth > 768 ? "800" : "300"}
            showMask={true}
            closeOnEsc={true}
            closeMaskOnClick={true}>
                <div className="card-detail-container">
                    <img src={image} alt={name} className="modal-product-image" />
                    <div>
                        <h3 className="product-name">{name}</h3>
                        <p className="product-price">${price}</p>
                        <p className="product-detail">{description}</p>
                        <p className="product-review"><GiRoundStar className="rating-star" /> {rating.rate}/{rating.count} reviews</p>
                        <button className="add-to-cart-button" onClick={handleAddToCart}><GiShoppingCart /> Add to cart</button>
                    </div>
                </div>
            </Rodal>
        </div>
    )
}

export default Card