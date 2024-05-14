import {useState, useEffect} from "react";
import {Link} from "react-router-dom"
import axios from "axios"

import logo from '../../images/Panel/logo.png'
import profile from '../../images/Panel/profile.png'
import request from '../../images/Panel/request.png'
import order from '../../images/Panel/order.png'
import products from '../../images/Panel/products.png'
import './panel.css'

export default function Panel() {
    const [userType, setUserType] = useState('')

    useEffect(() => {
        axios({
            method: 'GET',
            url: '/api/get-user-type/'
        }).then((response) => {
            if (response.status === 200) {
                setUserType(response.data.user_type)
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, []);
    return (
        <>
            <div className="panel">
                <div className="panel__logo">
                    <img src={logo} alt='logo'/>
                </div>
                <h1>Order Book</h1>
                <nav className='panel__nav'>
                    <ul className='panel__nav__list'>
                        {userType !== 'anon' ?
                            <>
                                <p>Пользователь</p>
                                <li>
                                    <img src={profile} alt='profile'/>
                                    <Link to={'/'} className='link'>Профиль</Link>
                                </li>
                                <li>
                                    <img src={request} alt='request'/>
                                    <Link to={'/'} className='link'>Сделать запрос</Link>
                                </li>
                                <li>
                                    <img src={request} alt='request'/>
                                    <Link to={'/'} className='link'>Мои запросы</Link>
                                </li>
                                <li>
                                    <img src={order} alt='order'/>
                                    <Link to={'/'} className='link'>Мои заказы</Link>
                                </li>
                            </> :
                            <>
                                <p>Анонимный пользователь</p>
                                <li>
                                    <Link to={'login/'} className='link'>Войти</Link>
                                </li>
                                <li>
                                    <Link to={'registration/'} className='link'>Зарегистрироваться</Link>
                                </li>
                            </>
                        }
                        {userType === 'worker' || userType === 'staff' ?
                            <>
                                <p>Работник</p>
                                <li>
                                    <img src={request} alt='request'/>
                                    <Link to={'/'} className='link'>Управление запросами</Link>
                                </li>
                                <li>
                                    <img src={order} alt='order'/>
                                    <Link to={'/'} className='link'>Управление заказами</Link>
                                </li>
                            </> : ''
                        }
                        {userType === 'staff' ?
                            <>
                                <p>Администратор</p>
                                <li>
                                    <img src={profile} alt='profile'/>
                                    <Link to={'/'} className='link'>Управление пользователями</Link>
                                </li>
                                <li>
                                    <img src={products} alt='products'/>
                                    <Link to={'/'} className='link'>Управление продуктами</Link>
                                </li>
                            </> : ''
                        }
                    </ul>
                </nav>
            </div>
        </>
    )
}