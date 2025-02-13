import {useState, useEffect} from "react";
import {Link} from "react-router-dom"
import axios from "axios"

import logo from '../../images/Panel/logo.png'
import profile from '../../images/Panel/profile.png'
import request from '../../images/Panel/request.png'
import order from '../../images/Panel/order.png'
import products from '../../images/Panel/products.png'
import login from '../../images/Panel/login.png'
import registration from '../../images/Panel/registration.png'
import category from '../../images/Panel/category.png'
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
                setUserType('anon')
            }
        }).catch((error) => {
            setUserType('anon')
        })
    }, []);
    return (
        <>
            <div className="panel">
                <Link to={'/'} className="panel__logo">
                    <img src={logo} alt='logo' loading='lazy'/>
                </Link>
                <nav className='panel__nav'>
                    <ul className='panel__nav__list'>
                        {userType !== 'anon' ?
                            <>
                                <p>Пользователь</p>
                                <li>
                                    <img src={profile} alt='profile' loading='lazy'/>
                                    <Link to={'me/'} className='link'>Профиль</Link>
                                </li>
                                <li>
                                    <img src={request} alt='request' loading='lazy'/>
                                    <Link to={'my-requests/'} className='link'>Мои запросы</Link>
                                </li>
                                <li>
                                    <img src={order} alt='order' loading='lazy'/>
                                    <Link to={'/'} className='link'>Мои заказы</Link>
                                </li>
                            </> :
                            <>
                                <p>Аноним</p>
                                <li>
                                    <img src={login} alt='request' loading='lazy'/>
                                    <Link to={'login/'} className='link'>Войти</Link>
                                </li>
                                <li>
                                    <img src={registration} alt='request' loading='lazy'/>
                                    <Link to={'registration/'} className='link'>Зарегистрироваться</Link>
                                </li>
                            </>
                        }
                        {userType === 'worker' || userType === 'staff' ?
                            <>
                                <p>Работник</p>
                                <li>
                                    <img src={request} alt='request' loading='lazy'/>
                                    <Link to={'requests/'} className='link'>Управление запросами</Link>
                                </li>
                                <li>
                                    <img src={order} alt='order' loading='lazy'/>
                                    <Link to={'orders/'} className='link'>Управление заказами</Link>
                                </li>
                                <li>
                                    <img src={products} alt='products' loading='lazy'/>
                                    <Link to={'products/'} className='link'>Управление продуктами</Link>
                                </li>
                            </> : ''
                        }
                        {userType === 'staff' ?
                            <>
                                <p>Администратор</p>
                                <li>
                                    <img src={profile} alt='profile' loading='lazy'/>
                                    <Link to={'users/'} className='link'>Управление пользователями</Link>
                                </li>
                                <li>
                                    <img src={category} alt='category' loading='lazy'/>
                                    <Link to={'categories/'} className='link'>Управление категориями</Link>
                                </li>
                            </> : ''
                        }
                    </ul>
                </nav>
            </div>
        </>
    )
}