import {useState, useEffect} from "react"
import axios from "axios";
import './adminOrderRequests.css'
import NotFound from "../../components/NotFound/notFound.jsx";

export default function AdminOrderRequest() {
    const [requests, setRequests] = useState([])

    useEffect(() => {
        getOrderRequest()
    }, []);

    function getOrderRequest() {
        axios({
            method: 'GET',
            url: '/api/worker-requests/'
        }).then((response) => {
            if (response.status === 200) {
                setRequests(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
    }

    function changeOrderRequest(id, value) {
        const data = {
            status: value
        }

        axios({
            method: 'PATCH',
            url: `/api/worker-requests/${id}/`,
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                getOrderRequest()
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <div className="admin_order_request">
                <header className='admin_order_request__header'>
                    <h2>Управление запросами</h2>
                </header>
                {requests.length > 0 ? <>
                    <ul className='orders_requests admin_order_request__list'>
                        {
                            requests.map((value, key) => {
                                return (
                                    <>
                                        <li className='request'>
                                            <div className="header">
                                                <h3 className='user'><b>Отправитель:</b> {value.order.user}</h3>
                                                <h3><b>Номер запроса:</b> {value.identification_number}</h3>
                                                <p><b>Статус запроса:</b> <select value={value.status} onChange={
                                                    (event) => {
                                                        changeOrderRequest(value.id, event.target.value)
                                                        event.preventDefault()
                                                    }
                                                }>
                                                    <option value='Н'>Новый</option>
                                                    <option value='О'>В обработке</option>
                                                    <option value='Р'>Решен</option>
                                                    <option value='ОТ'>Отклонен</option>
                                                </select></p>
                                                <span><b>Стоимость:</b> {value.order.price}р</span>
                                                <span className='place'><b>Место:</b> {value.order.place}</span>
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
                </> : <NotFound/>}
            </div>
        </>
    )
}