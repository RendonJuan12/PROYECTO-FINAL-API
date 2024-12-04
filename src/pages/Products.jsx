import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, incrementQuantity, decrementQuantity } from "../redux/cartSlice";
import axios from "axios";
import "./Products.css";

const initialProducts = [
  { id: 1, name: "Anillo de Oro 18k", price: 500, image: "/images/anillo.jpg" },
  { id: 2, name: "Cadena de Oro 18k", price: 700, image: "/images/cadena.jpg" },
  { id: 3, name: "Reloj de Diamantes", price: 2000, image: "/images/reloj.jpg" },
  { id: 4, name: "Manilla de Oro 18k", price: 400, image: "/images/manilla.jpg" },
];

const Products = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const [showCart, setShowCart] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Agregar producto al carrito
  const handleAddProduct = async (product) => {
    dispatch(addItem(product));

    try {
      const response = await axios.post("http://localhost:3000/products", product);
      if (response.status === 201) {
        console.log("Producto agregado al carrito en el servidor");
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito en la API:", error);
      alert("Hubo un error al agregar el producto.");
    }
  };

  const handleIncrementQuantity = (productId) => {
    dispatch(incrementQuantity(productId));
  };

  const handleDecrementQuantity = (productId) => {
    dispatch(decrementQuantity(productId));
  };

  const handleDeleteProduct = async () => {
    console.log("Product to delete:", productToDelete); // Add this log to check the state
    try {
      // Eliminar producto del servidor
      await axios.delete(`http://localhost:3000/products/${productToDelete.id}`);
      // Eliminar producto del carrito en Redux
      dispatch(removeItem(productToDelete.id));
      setShowDeleteModal(false); // Cerrar el modal
      setProductToDelete(null); // Limpiar el producto a eliminar
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Hubo un error al eliminar el producto.");
    }
  };
  
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="products-page">
      <header className="products-header">
        <h1 className="title">Joyería Prestigio y Elegancia</h1>
        <div className="cart-container">
          <button className="cart-button" onClick={toggleCart}>
            🛒 Carrito <span className="cart-count">{cart.length}</span>
          </button>

          {showCart && (
            <div className="cart-dropdown">
              <h2>Carrito de Compras</h2>
              {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
              ) : (
                <ul className="cart-items">
                  {cart.map((item) => (
                    <li key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-image"
                        />
                        <div>
                          <p className="cart-item-name">{item.name}</p>
                          <p className="cart-item-price">
                            ${item.price} x {item.quantity} = $
                            {item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="quantity-controls">
                        <button
                          className="decrement-button"
                          onClick={() => handleDecrementQuantity(item.id)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="increment-button"
                          onClick={() => handleIncrementQuantity(item.id)}
                        >
                          +
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => {
                            setProductToDelete(item); 
                            setShowDeleteModal(true);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="cart-summary">
                <h3>Total: ${cartTotal}</h3>
                <button className="checkout-button">Proceder al Pago</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="product-list">
        {initialProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h2>{product.name}</h2>
              <p className="product-price">${product.price}</p>
              <button
                className="add-to-cart"
                onClick={() => handleAddProduct(product)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de eliminar este producto del carrito?</h2>
            <button onClick={handleDeleteProduct}>Eliminar</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
