import {useState} from "react"
import Auth from "../../components/Auth/auth.jsx"
import axios from "axios"

import loginImage from '../../images/Auth/login.jpg'
import './login.css'

export default function Login() {
    const [status, setStatus] = useState('')

    function login(event) {
        const data = {
            login: document.getElementById('login').value,
            password: document.getElementById('password').value
        }

        axios({
            method: 'POST',
            url: '/api/login/',
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                setStatus(response.data.message)
                window.location.href = '/'
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

    return (
        <>
            <Auth authImage={loginImage} status={status}>
                <h1 className='login-head'>Авторизация</h1>
                <input type='text' name='login' placeholder='Логин' id='login' className='login-input' required={true}/>
                <input type='password' name='password' placeholder='Пароль' id='password' className='login-input'
                       required={true}/>
                <button type='button' className='login-button' onClick={login}>Авторизоваться</button>
            </Auth>
        </>
    )
}