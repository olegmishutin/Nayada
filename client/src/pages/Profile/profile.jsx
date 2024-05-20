import {useState, useEffect} from "react"
import axios from "axios"
import Modal from "../../components/Modal/modal.jsx";
import './profile.css'

import userAvatar from '../../images/Profile/user avatar.jpg'
import getErrorMessageFromData from "../../helpers.jsx";

export default function Profile() {
    const [status, setStatus] = useState('')
    const [user, setUser] = useState({})

    useEffect(() => {
        getProfile(event)
    }, []);

    function getProfile(event) {
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
        event.preventDefault()
    }

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

    function changeProfile(event) {
        const formData = new FormData()

        let photo = document.getElementById('profile_photo').files[0]
        const data = {
            full_name: document.getElementById('profile_full_name').value,
            login: document.getElementById('profile_login').value,
            email: document.getElementById('profile_email').value,
            telephone: document.getElementById('profile_telephone').value
        }

        if (photo) {
            formData.append('photo', photo)
        }

        formData.append('full_name', data.full_name)
        formData.append('login', data.login)
        formData.append('email', data.email)
        formData.append('telephone', data.telephone)

        axios({
            method: 'PATCH',
            url: '/api/me/',
            data: formData,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                setStatus('Данные изменены')
                getProfile(event)
            } else {
                setStatus('Что-то пошло не так')
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setStatus(getErrorMessageFromData(error.response.data))
            } else {
                setStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
    }

    function openModal() {
        document.getElementById('modal-window').style.display = 'flex'
    }

    return (<>
        <div className="profile">
            <div className="profile__avatar">
                <img src={user.photo ? user.photo : userAvatar} alt='photo' loading='lazy'/>
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
                <button className='profile__buttons__change' onClick={openModal}>Изменить профиль</button>
                <button className='profile__buttons__logout' onClick={logout}>Выйти из системы</button>
            </div>
            <Modal status={status} buttons={
                <>
                    <button className='profile__modal__button' onClick={changeProfile}>Изменить</button>
                </>
            }>
                <>
                    <form className='profile__modal'>
                        <label className="profile__modal__file">
                            <input type='file' name='profile_photo' id='profile_photo' accept='image/*'/>
                            <span>Выберите фото</span>
                        </label>
                        <input className='profile__modal__input' type='text' name='full_name'
                               id='profile_full_name' placeholder='Полное имя' defaultValue={user.full_name}/>
                        <input className='profile__modal__input' type='text' name='login' id='profile_login'
                               placeholder='Имя пользователя в системе' defaultValue={user.login}/>
                        <input className='profile__modal__input' type='email' name='email' id='profile_email'
                               placeholder='Электронный адрес почты' defaultValue={user.email}/>
                        <input className='profile__modal__input' type='tel' name='telephone'
                               id='profile_telephone' placeholder='Телефонный номер' defaultValue={user.telephone}/>
                    </form>
                </>
            </Modal>
        </div>
    </>)
}