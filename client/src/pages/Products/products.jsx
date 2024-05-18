import {useState, useEffect} from "react"
import axios from "axios"
import ProductsFilter from "../../components/ProductsFilter/productsFilter.jsx"
import Modal from "../../components/Modal/modal.jsx";
import './products.css'

export default function Products() {
    const [creationProdStatus, setCreationProdStatus] = useState()
    const [editionProdStatus, setEditionProdStatus] = useState()
    const [products, setProducts] = useState([])

    const [productId, setProductId] = useState(undefined)
    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState(undefined)
    const [productInfo, setProductInfo] = useState(undefined)
    const [productDescription, setProductDescription] = useState(undefined)

    useEffect(() => {
        getProducts(event)
    }, []);

    function getProducts(event) {
        let urlParams = ''
        const checkboxes = [
            ['new_products', 'new'],
            ['old_products', 'old'],
            ['expensive_products', 'expensive'],
            ['cheap_products', 'cheap']
        ]
        const prices = [
            ['min_price', 'smallestPrice'],
            ['max_price', 'greatestPrice']
        ]

        checkboxes.forEach((value) => {
            const checkbox = document.getElementById(value[0])

            if (checkbox.checked) {
                if (urlParams) {
                    urlParams += `&${value[1]}=true`
                } else {
                    urlParams += `?${value[1]}=true`
                }
            }
        })

        prices.forEach((value) => {
            const price = document.getElementById(value[0]).value

            if (price) {
                if (urlParams) {
                    urlParams += `&${value[1]}=${price}`
                } else {
                    urlParams += `?${value[1]}=${price}`
                }
            }
        })

        axios({
            method: 'GET',
            url: `/api/admin-products/${urlParams}`
        }).then((response) => {
            if (response.status === 200) {
                setProducts(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
        event.preventDefault()
    }

    function addPhoto(id, file) {
        const formData = new FormData()

        if (file) {
            formData.append('photo', file)
            formData.append('product', id)

            axios({
                method: 'POST',
                url: '/api/admin-product-photos/',
                data: formData,
                xsrfHeaderName: 'X-CSRFTOKEN',
                xsrfCookieName: 'csrftoken',
                withCredentials: true
            }).then((response) => {
                if (response.status === 201) {
                    getProducts(event)
                } else {
                    console.log(response)
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    function deletePhoto(id) {
        axios({
            method: 'DELETE',
            url: `/api/admin-product-photo/${id}/`,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 204) {
                getProducts(event)
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function addProduct(event) {
        const formData = new FormData()

        const files = document.getElementById('add_product_photos').files;
        for (let x = 0; x < files.length; x++) {
            formData.append("photos", files[x]);
        }

        formData.append('name', document.getElementById('create_product_name').value)
        formData.append('price', document.getElementById('create_product_price').value)
        formData.append('info', document.getElementById('create_product_info').value)
        formData.append('short_description', document.getElementById('create_product_description').value)

        axios({
            method: 'POST',
            url: '/api/admin-products/',
            data: formData,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 201) {
                setCreationProdStatus('Продукт успешно добавлен')
                getProducts(event)
            } else {
                setCreationProdStatus('Что-то пошло не так')
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                let message = ''

                for (const [key, value] of Object.entries(error.response.data)) {
                    if (key === 'message') {
                        message += `${value}\n`
                    } else {
                        message += `${key}: ${value}\n`
                    }
                }
                setCreationProdStatus(message)
            } else {
                setCreationProdStatus('Что-то пошло не так')
            }
        })

        event.preventDefault()
    }

    function editProduct(event) {
        const data = {
            name: productName,
            price: productPrice,
            info: productInfo,
            short_description: productDescription
        }

        axios({
            method: 'PATCH',
            url: `/api/admin-products/${productId}/`,
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                setEditionProdStatus('Успешно изменено')
                getProducts()
            } else {
                setEditionProdStatus('Что-то пошло не так')
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                let message = ''

                for (const [key, value] of Object.entries(error.response.data)) {
                    if (key === 'message') {
                        message += `${value}\n`
                    } else {
                        message += `${key}: ${value}\n`
                    }
                }
                setEditionProdStatus(message)
            } else {
                setEditionProdStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
    }

    function deleteProduct(id) {
        axios({
            method: 'DELETE',
            url: `/api/admin-products/${id}/`,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 204) {
                getProducts(event)
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function openCreateProductsModal() {
        document.getElementById('create__products__modal').style.display = 'flex'
    }

    function closeCreateProductsModal() {
        document.getElementById('create__products__modal').style.display = 'none'
    }

    function openEditProductModal(id) {
        products.forEach((value) => {
            if (value.id === id) {
                setProductId(value.id)
                setProductName(value.name)
                setProductPrice(value.price)
                setProductInfo(value.info)
                setProductDescription(value.short_description)

                return true
            }
        })
        document.getElementById('edit__products__modal').style.display = 'flex'
    }

    function closeEditProductModal() {
        document.getElementById('edit__products__modal').style.display = 'none'

        setProductId(undefined)
        setProductName('')
        setProductPrice(undefined)
        setProductInfo('')
        setProductDescription('')
    }

    return (
        <>
            <div className="products">
                <header className='products__header'>
                    <h2>Управление продуктами</h2>
                    <button className='products__header__create' onClick={openCreateProductsModal}>
                        Добавить продукт
                    </button>
                </header>
                <ProductsFilter filterFunc={getProducts}/>
                <ul className='products__list'>
                    {products.map((value, key) => {
                        return (
                            <>
                                <li>
                                    <div className="product__photos">
                                        {value.photos[0] ?
                                            value.photos.map((value, key) => {
                                                return (
                                                    <>
                                                        <div className="product__photos_photo">
                                                            <img src={value.photo} alt='product photo'/>
                                                            <button className='buttons__delete' onClick={
                                                                (event) => {
                                                                    deletePhoto(value.id)
                                                                    event.preventDefault()
                                                                }
                                                            }>Удалить
                                                            </button>
                                                        </div>
                                                    </>
                                                )
                                            }) : ''
                                        }
                                        <label className="product__photos_photo">
                                            <input type='file' name='add_product_photo' id='add_product_photo'
                                                   accept='image/*'
                                                   onChange={(event) => {
                                                       addPhoto(value.id, event.target.files[0])
                                                       event.target.value = ''
                                                       event.preventDefault()
                                                   }}/>
                                            <span>+</span>
                                        </label>
                                    </div>
                                    <div className="product__data">
                                        <p><b>Название:</b> {value.name}</p>
                                        <p><b>Цена:</b> {value.price}р</p>
                                        <p><b>Информация о товаре:</b> {value.info}</p>
                                        {value.short_description ?
                                            <p><b>Описание:</b> {value.short_description}</p> : ''}
                                    </div>
                                    <div className="product__buttons">
                                        <button className='edit_product' onClick={
                                            (event) => {
                                                openEditProductModal(value.id)
                                                event.preventDefault()
                                            }
                                        }>Изменить
                                        </button>
                                        <button className='delete_product' onClick={
                                            (event) => {
                                                deleteProduct(value.id)
                                                event.preventDefault()
                                            }
                                        }>Удалить
                                        </button>
                                    </div>
                                </li>
                            </>
                        )
                    })}
                </ul>
                <Modal id='create__products__modal' status={creationProdStatus} closeModal={closeCreateProductsModal}
                       buttons={
                           <>
                               <button className='add_product_button' onClick={addProduct}>Добавить</button>
                           </>
                       }>
                    <form className='products__modal'>
                        <label className="products__modal__photo">
                            <input type='file' name='photos' id='add_product_photos'
                                   accept='image/*' multiple={true}
                                   onChange={(event) => {
                                       addPhoto(value.id, event.target.files[0])
                                       event.preventDefault()
                                   }}/>
                            <span>Добавить фотографии</span>
                        </label>
                        <div className="products__modal__info">
                            <input type='text' name='name' id='create_product_name' placeholder='Название продукта'/>
                            <input type='number' name='price' id='create_product_price' placeholder='Цена'/>
                            <textarea name='info' id='create_product_info'
                                      placeholder='Информация о продукте'></textarea>
                            <textarea name='description' id='create_product_description'
                                      placeholder='Небольшое описание продукта'></textarea>
                        </div>
                    </form>
                </Modal>
                <Modal id='edit__products__modal' status={editionProdStatus} closeModal={closeEditProductModal}
                       buttons={
                           <>
                               <button className='edit_product_button' onClick={editProduct}>Изменить</button>
                           </>
                       }>
                    <form className='products__modal'>
                        <div className="products__modal__info">
                            <input type='text' name='name' id='create_product_name' placeholder='Название продукта'
                                   value={productName} onChange={(e) => {
                                setProductName(e.target.value)
                            }}/>
                            <input type='number' name='price' id='create_product_price' placeholder='Цена'
                                   value={productPrice} onChange={(e) => {
                                setProductPrice(e.target.value)
                            }}/>
                            <textarea name='info' id='create_product_info'
                                      placeholder='Информация о продукте' value={productInfo} onChange={(e) => {
                                setProductInfo(e.target.value)
                            }}></textarea>
                            <textarea name='description' id='create_product_description'
                                      placeholder='Небольшое описание продукта' value={productDescription}
                                      onChange={(e) => {
                                          setProductDescription(e.target.value)
                                      }}></textarea>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    )
}