import {useState, useEffect} from "react"
import axios from "axios"
import './profile.css'

import userAvatar from '../../images/Profile/user avatar.jpg'

export default function Profile() {
    const [user, setUser] = useState({})

    useEffect(() => {
        axios({
            method: 'GET',
            url: '/api/me/'
        }).then((response) => {
            if (response.status === 200) {
                setUser(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
    }, []);

    function logout(event) {
        axios({
            method: 'GET',
            url: '/api/logout/'
        }).then((response) => {
            if (response.status === 200) {
                window.location.href = '/'
            } else {
                window.location.reload()
            }
        }).catch((error) => {
            window.location.reload()
        })
        event.preventDefault()
    }

    return (<>
        <div className="profile">
            <div className="profile__avatar">
                <img src={user.photo ? user.photo : userAvatar}/>
            </div>
            <div className="profile__data">
                <ul className='profile__data__list'>
                    <li>
                        <h2>Полное имя: {user.full_name}</h2>
                    </li>
                    <li>
                        <h2>Имя пользователя в системе: {user.login}</h2>
                    </li>
                    <li>
                        <h2>Электронный адрес почты: {user.email}</h2>
                    </li>
                    <li>
                        <h2>Телефонный номер: {user.telephone}</h2>
                    </li>
                </ul>
            </div>
            <div className="profile__buttons">
                <button className='profile__buttons__change'>Изменить профиль</button>
                <button className='profile__buttons__logout' onClick={logout}>Выйти из системы</button>
            </div>
        </div>
    </>)
}