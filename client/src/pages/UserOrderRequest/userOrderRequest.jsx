import {useState, useEffect} from "react"
import Modal from "../../components/Modal/modal.jsx"
import ProductsFilter from "../../components/ProductsFilter/productsFilter.jsx"
import axios from "axios"
import './userOrderRequest.css'
import {findReturnStatement} from "eslint-plugin-react/lib/util/ast.js";

export default function UserOrderRequest() {
    const [userRequests, setUserRequests] = useState([])
    const [products, setProducts] = useState([])
    const [basketProducts, setBasketProducts] = useState([])
    const [basketPrice, setBasketPrice] = useState(0)
    const [status, setStatus] = useState('')

    useEffect(() => {
        getOrdersRequests()
    }, []);

    function getOrdersRequests() {
        axios({
            method: 'GET',
            url: '/api/user-requests/'
        }).then((response) => {
            if (response.status === 200) {
                setUserRequests(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
    }

    function getProducts() {
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
            url: `/api/products/${urlParams}`
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

    function createOrderWithRequest(event) {
        const productsList = []
        basketProducts.forEach((value) => {
            productsList.push(value.id)
        })

        const data = {
            place: document.getElementById('user_order_request_place').value,
            comment: document.getElementById('user_order_request_comment').value,
            products: productsList
        }

        axios({
            method: 'POST',
            url: '/api/user-orders/',
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 201) {
                setStatus('Запрос успешно создан')
                getOrdersRequests()
            } else {
                setStatus('Что-то пошло не так')
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
                setStatus(message)
            } else {
                setStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
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

    function openModal() {
        getProducts()
        document.getElementById('user_orders').style.display = 'flex'
    }

    function closeModal() {
        document.getElementById('user_orders').style.display = 'none'
        setStatus('')
        setBasketProducts([])
        setBasketPrice(0)
    }

    return (
        <>
            <div className="user_orders_request">
                <header className='user_orders_request__header'>
                    <h2>Мои запросы</h2>
                    <button onClick={openModal}>Создать новый запрос</button>
                </header>
                <Modal id='user_orders' status={status} closeModal={closeModal} buttons={
                    <>
                        <button className='user_orders_request__create' onClick={createOrderWithRequest}>Отправить
                            запрос
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
                                                                            <img src={value.photo} alt='product photo'/>
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
                            <p className='basket_price'>Общая стоимость заказа: {basketPrice}</p>
                            <ul className='products__list'>
                                {
                                    basketProducts.map((value, key) => {
                                        return (
                                            <>
                                                <li>
                                                    <div className="product__photos">
                                                        {value.photos[0] ?
                                                            <div className="product__photos_photo">
                                                                <img src={value.photos[0].photo} alt='product photo'/>
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
                        <input type='text' name='place' id='user_order_request_place' placeholder='Место доставки'/>
                        <input type='text' name='comment' id='user_order_request_comment'
                               placeholder='Небольшой комментарий'/>
                    </div>
                </Modal>
                <ul className="orders_requests">
                    {
                        userRequests.map((value, key) => {
                            return (
                                <>
                                    <li className='request'>
                                        <div className="header">
                                            <h3><b>Номер запроса:</b> {value.identification_number}</h3>
                                            <p><b>Статус запроса:</b> {value.status}</p>
                                            <span><b>Стоимость:</b> {value.order.price}</span>
                                        </div>
                                        <ul className="data">
                                            {
                                                value.order.products.map((value, key) => {
                                                    return (
                                                        <>
                                                            <li className='product'>
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
                                                            </li>
                                                        </>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </li>
                                </>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}