import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductManagement = () => {
  // Estado para gestionar los productos
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: "", price: "", image: "" });
  const [editProduct, setEditProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [nextId, setNextId] = useState(1); // Variable para llevar el control del siguiente ID

  // Función para obtener los productos desde la API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      setProducts(data);
      if (data.length > 0) {
        // Establecer el próximo ID como el más alto de los productos existentes + 1
        const maxId = Math.max(...data.map(product => product.id));
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  // Cargar los productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para agregar un nuevo producto
  const handleAddProduct = async () => {
    if (newProduct.title && newProduct.price && newProduct.image) {
      const newProductData = {
        id: nextId, // Usar el próximo ID
        title: newProduct.title,
        price: parseFloat(newProduct.price),
        image: newProduct.image, // Añadir la URL de la imagen
      };

      try {
        const response = await fetch("http://localhost:3000/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProductData),
        });
        const addedProduct = await response.json();
        setProducts([...products, addedProduct]);
        setNewProduct({ title: "", price: "", image: "" }); // Limpiar el formulario
        setNextId(nextId + 1); // Incrementar el siguiente ID
        setShowAddModal(false); // Cerrar el modal
      } catch (error) {
        console.error("Error al agregar el producto:", error);
      }
    } else {
      alert("Por favor, ingrese todos los campos.");
    }
  };

  // Función para editar un producto
  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setEditProduct({ ...productToEdit });
    setShowEditModal(true); // Mostrar modal de edición
  };

  // Función para guardar los cambios del producto editado
  const handleSaveEditProduct = async () => {
    if (editProduct && editProduct.title && editProduct.price && editProduct.image) {
      try {
        const response = await fetch(`http://localhost:3000/products/${editProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProduct),
        });
        const updatedProduct = await response.json();
        setProducts(products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        ));
        setEditProduct(null);
        setShowEditModal(false); // Cerrar el modal
      } catch (error) {
        console.error("Error al editar el producto:", error);
      }
    } else {
      alert("Por favor, ingrese todos los campos.");
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async () => {
    try {
      await fetch(`http://localhost:3000/products/${productToDelete}`, {
        method: "DELETE",
      });
      setProducts(products.filter((product) => product.id !== productToDelete));
      setShowDeleteModal(false); // Cerrar el modal
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  // Función para manejar los cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  return (
    <div className="product-management-container">
      <header className="header">
        <h1>Gestión de Productos de Joyería</h1>

        {/* Botón para abrir el modal de agregar nuevo producto */}
        <button className="new-product-button" onClick={() => setShowAddModal(true)}>
          Agregar Producto
        </button>
      </header>

      {/* Modal de agregar producto */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nuevo Producto</h2>
            <input
              type="text"
              placeholder="Nombre del Producto"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            />
            <input
              type="number"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de la imagen"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
            <button onClick={handleAddProduct}>Agregar</button>
            <button onClick={() => setShowAddModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de edición de producto */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Producto</h2>
            <input
              type="text"
              name="title"
              value={editProduct ? editProduct.title : ""}
              onChange={handleEditChange}
            />
            <input
              type="number"
              name="price"
              value={editProduct ? editProduct.price : ""}
              onChange={handleEditChange}
            />
            <input
              type="text"
              name="image"
              value={editProduct ? editProduct.image : ""}
              onChange={handleEditChange}
            />
            <button onClick={handleSaveEditProduct}>Guardar Cambios</button>
            <button onClick={() => setShowEditModal(false)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Estás seguro de eliminar este producto?</h2>
            <button onClick={handleDeleteProduct}>Eliminar</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>${product.price}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditProduct(product.id)}>
                  Editar
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    setProductToDelete(product.id);
                    setShowDeleteModal(true);
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
