import React, { useState, useEffect } from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';
import { getCategories, createProduct } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';

const AddProduct = () => {

    const [values, setValues] = useState({
        name: "",
        description: "",
        stock: "",
        price: "",
        photo: "",
        category: "",
        categories: [],
        loading: false,
        error: "",
        createdProduct: "",
        getRedirect: false,
        formData: ""
    });

    const { name, description, stock, price, categories, category, loading, error, createdProduct, getRedirect, formData } = values

    const { user, token } = isAuthenticated();

    const preload = () => {
        getCategories().then(data => {
            console.log(data)
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({ ...values, categories: data, formData: new FormData() })
            }
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        preload();
    }, []);

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const onSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, error: "", loading: true })
        createProduct(user._id, token, formData)
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error })
                } else {
                    setValues({
                        ...values,
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        photo: "",
                        loading: false,
                        createdProduct: data.name
                    })
                }
            }).catch(err => console.log(err))
    }

    const successMsg = () => (
        <div className="alert alert-success mt-3"
            style={{ display: createdProduct ? "" : "none" }}
        >
            <h4>{createdProduct} created succesfully</h4>
        </div>
    )

    const errMsg = () => {
        return (
            <div className="alert alert-danger mt-3"
                style={{ display: error ? "" : "none" }}
            >
                <h4>Unable to create product.</h4>
            </div>
        )
    }

    const createProductForm = () => (
        <form >
            <span>Post photo</span>
            <div className="form-group">
                <label className="btn btn-block btn-success">
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="photo"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group">
                <textarea
                    onChange={handleChange("description")}
                    name="photo"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("price")}
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                />
            </div>
            <div className="form-group">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {categories && categories.map((cate, index) => (
                        <option key={index} value={cate._id}>{cate.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    value={stock}
                />
            </div>

            <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
                Create Product
          </button>
        </form>
    );

    return (
        <Base>
            <div className="container mt-3">
                <div className="row bg-white rounded mb-3">
                    <div className="col-md-8 offset-md-2">
                        {successMsg()}
                        {errMsg()}
                        {createProductForm()}
                        <Link className="btn btn-outline-primary mb-3" to="/admin/dashbord">Admin Home</Link>
                    </div>
                </div>
            </div>
        </Base>
    );
}

export default AddProduct;
