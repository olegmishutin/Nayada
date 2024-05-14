import {useState} from "react"
import Auth from "../../components/Auth/auth.jsx";
import axios from "axios"

import regImage from '../../images/Auth/reg.jpg'

export default function Registration() {
    const [status, setStatus] = useState('')

    function register(event) {
        const data = {
            full_name: document.getElementById('full_name').value,
            login: document.getElementById('login').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }

        axios({
            method: 'POST',
            url: '/api/register/',
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 201) {
                setStatus('Успешно зарегистрировались!')
            } else {
                setStatus('Что-то пошло не так')
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                let message = ''

                for (const [key, value] of Object.entries(error.response.data)) {
                    message += `${key}: ${value}\n`
                }
                setStatus(message)
            } else {
                setStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
    }

    return (
        <>
            <Auth authImage={regImage} status={status}>
                <h1>Регистрация</h1>
                <input type='text' name='full_name' placeholder='ФИО' id='full_name' required={true}/>
                <input type='text' name='login' placeholder='Логин' id='login' required={true}/>
                <input type='email' name='email' placeholder='Email' id='email' required={true}/>
                <input type='password' name='password' placeholder='Пароль' id='password' required={true}/>
                <button type='button' onClick={register}>Зарегистрироваться</button>
            </Auth>
        </>
    )
}