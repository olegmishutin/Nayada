import {Link} from "react-router-dom"
import logo from '../../images/Panel/logo.png'
import profile from '../../images/Panel/profile.png'
import request from '../../images/Panel/request.png'
import order from '../../images/Panel/order.png'
import products from '../../images/Panel/products.png'
import './panel.css'

export default function Panel() {
    return (
        <>
            <div className="panel">
                <div className="panel__logo">
                    <img src={logo} alt='logo'/>
                </div>
                <h1>Order Book</h1>
                <nav className='panel__nav'>
                    <ul className='panel__nav__list'>
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
                        <p>Работник</p>
                        <li>
                            <img src={request} alt='request'/>
                            <Link to={'/'} className='link'>Управление запросами</Link>
                        </li>
                        <li>
                            <img src={order} alt='order'/>
                            <Link to={'/'} className='link'>Управление заказами</Link>
                        </li>
                        <p>Администратор</p>
                        <li>
                            <img src={profile} alt='profile'/>
                            <Link to={'/'} className='link'>Управление пользователями</Link>
                        </li>
                        <li>
                            <img src={products} alt='products'/>
                            <Link to={'/'} className='link'>Управление продуктами</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}