import Modal from "../../components/Modal/modal.jsx"
import {useState, useEffect} from "react"
import axios from "axios"

import userPhoto from '../../images/Profile/user avatar.jpg'
import './adminUsers.css'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [creationStatus, setCreationStatus] = useState('')
    const [editionStatus, setEditionStatus] = useState('')

    const [userId, setUserId] = useState(0)
    const [userFullName, setUserFullName] = useState('')
    const [userLogin, setUserLogin] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userTelephone, setUserTelephone] = useState('')
    const [userIsWorker, setUserIsWorker] = useState('')
    const [userIsStaff, setUserIsStaff] = useState('')

    useEffect(() => {
        getUser(event)
    }, []);

    function getUser(event) {
        const search = document.getElementById('search').value
        console.log(search)
        let url = search ? `/api/admin-users/?search=${search}` : '/api/admin-users/'

        axios({
            method: 'GET',
            url: url,
        }).then((respone) => {
            if (respone.status === 200) {
                setUsers(respone.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
        event.preventDefault()
    }

    function createUser(event) {
        const telephone = document.getElementById('users_telephone').value
        const data = {
            full_name: document.getElementById('users_full_name').value,
            login: document.getElementById('users_login').value,
            email: document.getElementById('users_email').value,
            password: document.getElementById('users_password').value,
            is_worker: document.getElementById('users_is_worker').checked,
            is_staff: document.getElementById('users_is_admin').checked
        }

        if (telephone) {
            data['telephone'] = telephone
        }

        axios({
            method: 'POST',
            url: '/api/admin-users/',
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 201) {
                setCreationStatus('Пользователь успешно создан')
                getUser()
            } else {
                setCreationStatus('Что-то пошло не так')
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                if (error.response.status === 400) {
                    let message = ''

                    for (const [key, value] of Object.entries(error.response.data)) {
                        if (key === 'message') {
                            message += `${value}\n`
                        } else {
                            message += `${key}: ${value}\n`
                        }
                    }
                    setCreationStatus(message)
                } else {
                    setCreationStatus('Что-то пошло не так')
                }
            }
        })
        event.preventDefault()
    }

    function editUser(event) {
        const telephone = document.getElementById('users_telephone_editing').value
        const data = {
            full_name: document.getElementById('users_full_name_editing').value,
            login: document.getElementById('users_login_editing').value,
            email: document.getElementById('users_email_editing').value,
            is_worker: document.getElementById('users_is_worker_editing').checked,
            is_staff: document.getElementById('users_is_admin_editing').checked,
        }

        if (telephone) {
            data['telephone'] = telephone
        }

        axios({
            method: 'PATCH',
            url: `/api/admin-users/${userId}/`,
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                setEditionStatus('Успешно изменено')
                getUser()
            } else {
                setEditionStatus('Что-то пошло не так')
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
                setEditionStatus(message)
            } else {
                setEditionStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
    }

    function deleteUser(id) {
        axios({
            method: 'DELETE',
            url: `/api/admin-users/${id}/`,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 204) {
                getUser()
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function createUserOpenModal() {
        document.getElementById('createUserModal').style.display = 'flex'
    }

    function createUserModalClose() {
        document.getElementById('createUserModal').style.display = 'none'
    }

    function editUserModalOpen(id) {
        users.forEach((value) => {
            if (value.id === id) {
                setUserId(id)
                setUserFullName(value.full_name)
                setUserLogin(value.login)
                setUserEmail(value.email)
                setUserTelephone(value.telephone)
                setUserIsWorker(value.is_worker)
                setUserIsStaff(value.is_staff)
                return true
            }
        })
        document.getElementById('editUserModal').style.display = 'flex'
    }

    function editUserModalClose() {
        document.getElementById('editUserModal').style.display = 'none'
        setEditionStatus('')
    }

    return (
        <>
            <div className="users">
                <header className='users__header'>
                    <h2>Управление пользователями</h2>
                    <form className="users__header__search">
                        <input type='text' name='search' id='search' placeholder='Поиск'/>
                        <button type='button' onClick={getUser}>Найти</button>
                    </form>
                    <button className='users__header__create' onClick={createUserOpenModal}>
                        Создать пользователя
                    </button>
                </header>
                <ul className='users__list'>
                    {users.map((value, key) => {
                        return (
                            <>
                                <li>
                                    <div className="photo">
                                        <img src={value.photo ? value.photo : userPhoto} alt='photo' loading='lazy'/>
                                    </div>
                                    <div className="info">
                                        <p><b>ФИО:</b> {value.full_name}</p>
                                        <p><b>Email:</b> {value.email}</p>
                                        <p><b>Логин:</b> {value.login}</p>
                                        <p><b>Телефон:</b> {value.telephone}</p>
                                        <p><b>Тип:</b> {
                                            value.is_staff ?
                                                'Админ' : value.is_worker ?
                                                    'Рабочий' : 'Пользователь'
                                        }</p>
                                    </div>
                                    <div className="buttons">
                                        <button className='buttons__change' onClick={
                                            (event) => {
                                                editUserModalOpen(value.id)
                                                event.preventDefault()
                                            }
                                        }>Изменить
                                        </button>
                                        <button className='buttons__delete' onClick={
                                            (event) => {
                                                deleteUser(value.id)
                                                event.preventDefault()
                                            }
                                        }>Удалить
                                        </button>
                                    </div>
                                </li>
                            </>
                        )
                    })}
                </ul>
                <Modal id='createUserModal' status={creationStatus} closeModal={createUserModalClose} buttons={
                    <>
                        <button className='createUserButton' onClick={createUser}>Создать</button>
                    </>
                }>
                    <form className='users__modal'>
                        <input type='text' className='input' name='full_name' placeholder='ФИО'
                               id='users_full_name' required={true}/>
                        <input type='text' className='input' name='login' placeholder='Логин' id='users_login'
                               required={true}/>
                        <input type='email' className='input' name='email' placeholder='Email' id='users_email'
                               required={true}/>
                        <input type='password' className='input' name='password' placeholder='Пароль'
                               id='users_password' required={true}/>
                        <input type='tel' className='input' name='telephone' placeholder='Телефон'
                               id='users_telephone'/>
                        <ul className="users__modal__create__checkboxes">
                            <li>
                                <input type='checkbox' name='is_worker' id='users_is_worker'
                                       defaultValue={false}/>
                                <label htmlFor='users_is_worker'>Является рабочим</label>
                            </li>
                            <li>
                                <input type='checkbox' name='is_admin' id='users_is_admin'
                                       defaultValue={false}/>
                                <label htmlFor='users_is_admin'>Является админом</label>
                            </li>
                        </ul>
                    </form>
                </Modal>
                <Modal id='editUserModal' status={editionStatus} closeModal={editUserModalClose} buttons={
                    <>
                        <button className='editUserButton' onClick={editUser}>Изменить</button>
                    </>
                }>
                    <form className='users__modal'>
                        <input type='text' className='input' name='full_name' placeholder='ФИО'
                               id='users_full_name_editing' required={true} value={userFullName}
                               onChange={e => setUserFullName(e.target.value)}/>
                        <input type='text' className='input' name='login' placeholder='Логин' id='users_login_editing'
                               required={true} value={userLogin} onChange={e => setUserLogin(e.target.value)}/>
                        <input type='email' className='input' name='email' placeholder='Email' id='users_email_editing'
                               required={true} value={userEmail} onChange={e => setUserEmail(e.target.value)}/>
                        <input type='tel' className='input' name='telephone' placeholder='Телефон'
                               id='users_telephone_editing' value={userTelephone}
                               onChange={e => setUserTelephone(e.target.value)}/>
                        <ul className="users__modal__create__checkboxes">
                            <li>
                                <input type='checkbox' name='is_worker' id='users_is_worker_editing'
                                       checked={userIsWorker} onChange={e => setUserIsWorker(e.target.checked)}/>
                                <label htmlFor='users_is_worker_editing'>Является рабочим</label>
                            </li>
                            <li>
                                <input type='checkbox' name='is_admin' id='users_is_admin_editing'
                                       checked={userIsStaff} onChange={e => setUserIsStaff(e.target.checked)}/>
                                <label htmlFor='users_is_admin_editing'>Является админом</label>
                            </li>
                        </ul>
                    </form>
                </Modal>
            </div>
        </>
    )
}