import {useState, useEffect} from "react"
import Modal from "../../components/Modal/modal.jsx"
import OrdersFilter, {getOrdersFilterUrlParams} from "../../components/OrdersFilter/ordersFilter.jsx";
import axios from "axios"

import './orders.css'
import anonImage from '../../images/Auth/anon image.jpg'
import ProductsFilter, {getProductsFilterUrlParams} from "../../components/ProductsFilter/productsFilter.jsx";
import getErrorMessageFromData from "../../helpers.jsx";
import NotFound from "../../components/NotFound/notFound.jsx";

export default function Orders() {
    const [userType, setUserType] = useState('')
    const [categories, setCategories] = useState([])
    const [orders, setOrders] = useState([])
    const [editingOrderId, setEditingOrderId] = useState(undefined)
    const [basketProducts, setBasketProducts] = useState([])
    const [basketPrice, setBasketPrice] = useState(0)
    const [products, setProducts] = useState([])
    const [status, setStatus] = useState('')
    const [editingOrderPlace, setEditingOrderPlace] = useState('')
    const [editingOrderComment, setEditingOrderComment] = useState('')

    useEffect(() => {
        axios({
            method: 'GET',
            url: '/api/get-user-type/'
        }).then((response) => {
            if (response.status === 200) {
                setUserType(response.data.user_type)
            } else {
                setUserType('anon')
            }
        }).catch((error) => {
            setUserType('anon')
        })

        axios({
            method: 'GET',
            url: '/api/user-categories/'
        }).then((response) => {
            if (response.status === 200) {
                setCategories(response.data)
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })

        getOrders()
    }, []);

    function getOrders(event) {
        axios({
            method: 'GET',
            url: `/api/user-orders/${getOrdersFilterUrlParams(categories)}`
        }).then((response) => {
            if (response.status === 200) {
                setOrders(response.data)
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })

        if (event) {
            event.preventDefault()
        }
    }

    function getProducts() {
        axios({
            method: 'GET',
            url: `/api/products/${getProductsFilterUrlParams()}`
        }).then((response) => {
            if (response.status === 200) {
                setProducts(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
    }

    function editOrder(event) {
        const productsList = []
        basketProducts.forEach((value) => {
            productsList.push(value.id)
        })

        const data = {
            place: editingOrderPlace,
            comment: editingOrderComment,
            products: productsList
        }

        axios({
            method: 'PATCH',
            url: `/api/user-orders/${editingOrderId}/`,
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                setStatus('Заказ успешно изменен')
                getOrders()
            } else {
                setStatus('Что-то пошло не так')
            }
        }).catch((error) => {
            if (error.response.status === 400 || error.response.status === 403) {
                setStatus(getErrorMessageFromData(error.response.data))
            } else {
                setStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
    }

    function cancelOrder(order_id) {
        axios({
            method: 'DELETE',
            url: `/api/user-orders/${order_id}/`,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 204) {
                getOrders()
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
    }

    function addProductInBasket(product) {
        const productCopy = {...product}
        setBasketPrice(basketPrice + productCopy.price)

        productCopy['keyNumber'] = basketProducts.length
        setBasketProducts([...basketProducts, productCopy])
    }

    function removeProductFromBasket(product) {
        setBasketProducts(basketProducts => basketProducts.filter(item => item.keyNumber !== product.keyNumber))
        setBasketPrice(basketPrice - product.price)
    }

    function openModal(order) {
        const productsList = []

        getProducts()
        setEditingOrderId(order.id)
        setBasketPrice(order.price)
        setEditingOrderPlace(order.place)
        setEditingOrderComment(order.comment)

        order.products.forEach((value) => {
            value['keyNumber'] = productsList.length
            productsList.push(value)
        })

        setBasketProducts(productsList)
        document.getElementById('user_orders').style.display = 'flex'
    }

    function closeModal() {
        setStatus('')
        document.getElementById('user_orders').style.display = 'none'
    }

    return (
        <>
            {userType !== 'anon' ? <>
                <div className="my_orders">
                    <header className='my_orders__header'>
                        <h2>Мои заказы</h2>
                    </header>
                    <OrdersFilter categories={categories} filterFunc={getOrders}/>
                    <Modal id='user_orders' status={status} closeModal={closeModal} buttons={
                        <>
                            <button className='my_orders__control_buttons__edit' onClick={editOrder}>
                                Изменить заказ
                            </button>
                        </>
                    }>
                        <ProductsFilter filterFunc={getProducts}/>
                        <div className="user_orders_request__modal">
                            <div className="left_modal_panel">
                                <ul className="products__list">
                                    {
                                        products.map((value, key) => {
                                            return (
                                                <>
                                                    <li>
                                                        <div className="product__photos">
                                                            {value.photos[0] ?
                                                                value.photos.map((value, key) => {
                                                                    return (
                                                                        <>
                                                                            <div className="product__photos_photo">
                                                                                <img src={value.photo}
                                                                                     alt='product photo'/>
                                                                            </div>
                                                                        </>
                                                                    )
                                                                }) : ''
                                                            }
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
                                                                    addProductInBasket(value)
                                                                }
                                                            }>Добавить
                                                            </button>
                                                        </div>
                                                    </li>
                                                </>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div className="right_modal_panel">
                                <h3>Моя корзина</h3>
                                <p className='basket_price'>Общая стоимость заказа: {basketPrice}р</p>
                                <ul className='products__list'>
                                    {
                                        basketProducts.map((value, key) => {
                                            return (
                                                <>
                                                    <li>
                                                        <div className="product__photos">
                                                            {value.photos[0] ?
                                                                <div className="product__photos_photo">
                                                                    <img src={value.photos[0].photo}
                                                                         alt='product photo'/>
                                                                </div> : ''
                                                            }
                                                        </div>
                                                        <div className="product__data">
                                                            <p><b>Название:</b> {value.name}</p>
                                                            <p><b>Цена:</b> {value.price}р</p>
                                                            <p><b>Информация о товаре:</b> {value.info}</p>
                                                        </div>
                                                        <div className="product__buttons">
                                                            <button className='edit_product' onClick={
                                                                (event) => {
                                                                    removeProductFromBasket(value)
                                                                }
                                                            }>Удалить
                                                            </button>
                                                        </div>
                                                    </li>
                                                </>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="user_orders_request__inputs">
                            <input type='text' name='place' id='user_order_request_place' placeholder='Место доставки'
                                   value={editingOrderPlace} onChange={(e) => {
                                setEditingOrderPlace(e.target.value)
                            }}/>
                            <input type='text' name='comment' id='user_order_request_comment'
                                   placeholder='Небольшой комментарий' value={editingOrderComment} onChange={(e) => {
                                setEditingOrderComment(e.target.value)
                            }}/>
                        </div>
                    </Modal>
                    {orders.length > 0 ? <>
                        <ul className='orders_requests admin_order_request__list admin_order__list'>
                            {
                                orders.map((value, key) => {
                                    return (
                                        <>
                                            <li className='request'>
                                                <div className="header">
                                                    <h3><b>Номер заказа:</b> {value.identification_number}</h3>
                                                    <p><b>Статус заказа:</b> {value.status}</p>
                                                    <span><b>Стоимость:</b> {value.price}р</span>
                                                    <span className='place'><b>Место:</b> {value.place}</span>
                                                    {
                                                        value.comment ? <>
                                                        <span
                                                            className='comment'><b>Комментарий:</b> {value.comment}</span>
                                                        </> : ''
                                                    }
                                                </div>
                                                <ul className="data">
                                                    {
                                                        value.products.map((product, key) => {
                                                            return (
                                                                <>
                                                                    <li className='product'>
                                                                        <div className="product__photos">
                                                                            {product.photos[0] ?
                                                                                <div className="product__photos_photo">
                                                                                    <img src={product.photos[0].photo}
                                                                                         alt='product photo'/>
                                                                                </div> : ''
                                                                            }
                                                                        </div>
                                                                        <div className="product__data">
                                                                            <p><b>Название:</b> {product.name}</p>
                                                                            <p><b>Цена:</b> {product.price}р</p>
                                                                            <p><b>Информация о
                                                                                товаре:</b> {product.info}
                                                                            </p>
                                                                        </div>
                                                                    </li>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                                {
                                                    value.categories.length ? <>
                                                        <p className='admin_order__list__category_name'><b>Категории
                                                            заказа</b></p>
                                                        <ul className='orders_filter__filters'>
                                                            {
                                                                value.categories.map((category, key) => {
                                                                    return (
                                                                        <>
                                                                            <li className='orders_filter__box'>
                                                                                <p>{category.name}</p>
                                                                            </li>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </> : ''
                                                }
                                                <div className="my_orders__control_buttons">
                                                    {
                                                        value.status === 'Новый' ? <>
                                                            <button className='my_orders__control_buttons__edit'
                                                                    onClick={(e) => {
                                                                        openModal(value)
                                                                    }}>Изменить
                                                            </button>
                                                        </> : ''
                                                    }
                                                    {
                                                        value.status !== 'Выполнен' && value.status !== 'Отменен' ? <>
                                                            <button className='my_orders__control_buttons__delete'
                                                                    onClick={(e) => {
                                                                        cancelOrder(value.id)
                                                                    }}>Отменить
                                                            </button>
                                                        </> : ''
                                                    }
                                                </div>
                                            </li>
                                        </>
                                    )
                                })
                            }
                        </ul>
                    </> : <NotFound/>}
                </div>
            </> : <>
                <div className="anon">
                    <div className="anon__image">
                        <img src={anonImage} alt='anon image' loading='lazy'/>
                    </div>
                    <h1>Вы не вошли в систему</h1>
                </div>
            </>
            }
        </>
    )
}