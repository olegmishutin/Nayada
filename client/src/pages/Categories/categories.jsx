import {useState, useEffect} from "react"
import Modal from "../../components/Modal/modal.jsx"
import axios from "axios"
import './categories.css'

export default function Categories() {
    const [creatingStatus, setCreatingStatus] = useState('')
    const [editingStatus, setEditingStatus] = useState('')
    const [categories, setCategories] = useState([])

    const [categoryId, setCategoryId] = useState(undefined)
    const [categoryName, setCategoryName] = useState('')

    useEffect(() => {
        getCategories()
    }, []);

    function getCategories() {
        axios({
            method: 'GET',
            url: '/api/categories/'
        }).then((response) => {
            if (response.status === 200) {
                setCategories(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
    }

    function createCategory(event) {
        const data = {
            name: document.getElementById('creating_category_name').value
        }

        axios({
            method: 'POST',
            url: '/api/categories/',
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 201) {
                setCreatingStatus('Успешно создано')
                getCategories()
            } else {
                setCreatingStatus('Что-то пошло не так')
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
                setCreatingStatus(message)
            } else {
                setCreatingStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
    }

    function editCategory(event) {
        const data = {
            name: document.getElementById('edit_category_name').value
        }

        axios({
            method: 'PUT',
            url: `/api/categories/${categoryId}/`,
            data: data,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 200) {
                setEditingStatus('Успешно изменено')
                getCategories()
            } else {
                setEditingStatus('Что-то пошло не так')
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
                setEditingStatus(message)
            } else {
                setEditingStatus('Что-то пошло не так')
            }
        })
        event.preventDefault()
    }

    function deleteCategory(id) {
        axios({
            method: 'DELETE',
            url: `/api/categories/${id}/`,
            xsrfHeaderName: 'X-CSRFTOKEN',
            xsrfCookieName: 'csrftoken',
            withCredentials: true
        }).then((response) => {
            if (response.status === 204) {
                getCategories()
            } else {
                console.log(response)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    function openCreateCategoryModal() {
        document.getElementById('create_category_modal').style.display = 'flex'
    }

    function closeCreateCategoryModal() {
        setCreatingStatus('')
        document.getElementById('create_category_modal').style.display = 'none'
    }

    function openEditCategoryModal(value) {
        setCategoryId(value.id)
        setCategoryName(value.name)
        document.getElementById('edit_category_modal').style.display = 'flex'
    }

    function closeEditCategoryModal() {
        setCategoryId(undefined)
        setCategoryName('')
        setEditingStatus('')
        document.getElementById('edit_category_modal').style.display = 'none'
    }

    return (
        <>
            <div className="categories">
                <header className='categories__header'>
                    <h2>Управление категориями</h2>
                    <button className='categories__header__creating' onClick={openCreateCategoryModal}>
                        Создать категорию
                    </button>
                </header>
                <ul className='categories__list'>
                    {
                        categories.map((value, key) => {
                            return (
                                <>
                                    <li className='categories__list__category'>
                                        <h3>{value.name}</h3>
                                        <div className="buttons">
                                            <button className='edit' onClick={
                                                (event) => {
                                                    openEditCategoryModal(value)
                                                }
                                            }>Изменить
                                            </button>
                                            <button className='delete' onClick={
                                                (event) => {
                                                    deleteCategory(value.id)
                                                }
                                            }>Удалить
                                            </button>
                                        </div>
                                    </li>
                                </>
                            )
                        })
                    }
                </ul>
                <Modal id='create_category_modal' status={creatingStatus} closeModal={closeCreateCategoryModal}
                       buttons={
                           <>
                               <button className='create_category_button' onClick={createCategory}>Создать</button>
                           </>
                       }>
                    <form className='category__modal'>
                        <input type='text' name='name' id='creating_category_name' placeholder='Название категории'/>
                    </form>
                </Modal>
                <Modal id='edit_category_modal' status={editingStatus} closeModal={closeEditCategoryModal} buttons={
                    <>
                        <button className='edit_category_button' onClick={editCategory}>Изменить</button>
                    </>
                }>
                    <form className='category__modal'>
                        <input type='text' name='name' id='edit_category_name' placeholder='Название категории'
                               value={categoryName} onChange={
                            (e) => {
                                setCategoryName(e.target.value)
                            }
                        }/>
                    </form>
                </Modal>
            </div>
        </>
    )
}