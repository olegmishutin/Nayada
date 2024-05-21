import {useState, useEffect} from "react"
import OrdersFilter from "../../components/OrdersFilter/ordersFilter.jsx";
import './adminOrder.css'
import axios from "axios";

export default function AdminOrder() {
    const [categories, setCategories] = useState([])
    const [orders, setOrders] = useState([])

    useEffect(() => {
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
        let urlParams = ''
        const statuses = []

        const statusCheckboxes = [
            ['new_order_checkbox', 'Н'],
            ['processing_order_checkbox', 'О'],
            ['completed_order_checkbox', 'В'],
            ['canceled_order_checkbox', 'ОТ']
        ]

        const priceCheckboxes = [
            ['expensive_order_checkbox', 'expensive'],
            ['cheap_order_checkbox', 'cheap']
        ]

        statusCheckboxes.forEach((value) => {
            if (document.getElementById(value[0]).checked) {
                statuses.push(value[1])
            }
        })

        if (statuses) {
            urlParams += `?status=${statuses}`
        }

        priceCheckboxes.forEach((value) => {
            if (document.getElementById(value[0]).checked) {
                if (urlParams) {
                    urlParams += `&${value[1]}=true`
                } else {
                    urlParams += `?${value[1]}=true`
                }
            }
        })

        categories.forEach((value) => {
            if (document.getElementById(`order-category-${value.id}`).checked) {
                if (urlParams) {
                    urlParams += `&category-${value.id}=true`
                } else {
                    urlParams += `?category-${value.id}=true`
                }
            }
        })

        axios({
            method: 'GET',
            url: `/api/worker-orders/${urlParams}`
        }).then((response) => {
            if (response.status === 200) {
                setOrders(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })

        if (event) {
            event.preventDefault()
        }
    }

    function changeOrderStatus(id, value) {
        axios({
            method: 'PATCH',
            url: `/api/worker-orders/${id}/`,
            data: {
                status: value
            },
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                getOrders()
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function addCategoryToOrder(order, category_id) {
        const categoriesCopy = [category_id]

        order.categories.forEach((value) => {
            categoriesCopy.push(value.id)
        })

        axios({
            method: 'PATCH',
            url: `/api/worker-orders/${order.id}/`,
            data: {
                categories: categoriesCopy
            },
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                getOrders()
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function removeCategoryFromOrder(order, category_id) {
        const categoriesCopy = []

        order.categories.forEach((value) => {
            categoriesCopy.push(value.id)
        })

        const newCategoriesCopy = categoriesCopy.filter((id) => id !== category_id);

        axios({
            method: 'PATCH',
            url: `/api/worker-orders/${order.id}/`,
            data: {
                categories: newCategoriesCopy
            },
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                getOrders()
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <div className="admin_order">
                <header className='admin_order__header'>
                    <h2>Управление заказами</h2>
                </header>
                <OrdersFilter categories={categories} filterFunc={getOrders}/>
                <ul className='orders_requests admin_order_request__list admin_order__list'>
                    {
                        orders.map((value, key) => {
                            return (
                                <>
                                    <li className='request'>
                                        <div className="header">
                                            <h3 className='user'><b>Заказчик:</b> {value.user}</h3>
                                            <h3><b>Номер заказа:</b> {value.identification_number}</h3>
                                            <p><b>Статус заказа:</b> <select value={value.status} onChange={
                                                (e) => {
                                                    changeOrderStatus(value.id, e.target.value)
                                                    e.preventDefault()
                                                }
                                            }>
                                                <option value='Н'>Новый</option>
                                                <option value='О'>В обработке</option>
                                                <option value='В'>Выполнен</option>
                                                <option value='ОТ'>Отменен</option>
                                            </select></p>
                                            <span><b>Стоимость:</b> {value.price}р</span>
                                            <span className='place'><b>Место:</b> {value.place}</span>
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
                                                                    <p><b>Информация о товаре:</b> {product.info}</p>
                                                                </div>
                                                            </li>
                                                        </>
                                                    )
                                                })
                                            }
                                        </ul>
                                        <p className='admin_order__list__category_name'><b>Категории заказа</b></p>
                                        <ul className='orders_filter__filters'>
                                            {
                                                categories.map((category, key) => {
                                                    return (
                                                        <>
                                                            <li className='orders_filter__box'>
                                                                <p>{category.name}</p>
                                                                {
                                                                    value.categories.find(obj => obj.id === category.id) !== undefined ?
                                                                        <>
                                                                            <button onClick={(e) => {
                                                                                removeCategoryFromOrder(value, category.id)
                                                                                e.preventDefault()
                                                                            }}>-
                                                                            </button>
                                                                        </> :
                                                                        <>
                                                                            <button onClick={(e) => {
                                                                                addCategoryToOrder(value, category.id)
                                                                                e.preventDefault()
                                                                            }}>+
                                                                            </button>
                                                                        </>
                                                                }
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