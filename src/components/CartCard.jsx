import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GiTrashCan } from "react-icons/gi";
import Swal from "sweetalert2";

const CartCard = ({ id, name, price, image, quantity, updateTotal, selectedItems, setSelectedItems }) => {
  const { handleQuantityChange, removeCart } = useAuth();
  const [isChecked, setIsChecked] = useState(true); // Default checked state to true

  useEffect(() => {
    if (isChecked) {
      // Update the total only if the checkbox is checked
      updateTotal(price * quantity);
      setSelectedItems(prevItems => [...prevItems, id])
    } else {
      handleQuantityChange(id, 0);
      setSelectedItems(prevItems => prevItems.filter(item => item !== id))
    }
  }, [quantity, isChecked]);

  const handleCheckboxChange = (id) => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      // Reset local quantity to the original value when checkbox is checked again
      handleQuantityChange(id, 0);
      setSelectedItems(selectedItems.filter(item => item !== id))
    } else {
      handleQuantityChange(id, 1);
      setSelectedItems([...selectedItems, id])

    }
  };

  const handleRemoveCart = ()=> {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Removed',
          'The product has been removd from your cart.',
          'success'
        )
      }
      removeCart(id)
    })
  }

  return (
    <div className="checkout-card">
      <input type="checkbox" checked={isChecked} onChange={()=> handleCheckboxChange(id)} />
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h3>{name}</h3>
        <p>Price: ${price}</p>
        <div className="quantity-input">
          <button onClick={() => handleQuantityChange(id, quantity - 1)} disabled={quantity <= 1 || !isChecked}>
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setLocalQuantity(parseInt(e.target.value))}
            disabled={!isChecked}
          />
          <button onClick={() => handleQuantityChange(id, quantity + 1)} disabled={!isChecked}>+</button>
        </div>
      </div>
      <button className="remove-button" onClick={handleRemoveCart}>
        <GiTrashCan />
      </button>
    </div>
  );
};

export default CartCard;
