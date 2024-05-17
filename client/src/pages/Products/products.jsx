import {useState, useEffect} from "react"
import axios from "axios"
import ProductsFilter from "../../components/ProductsFilter/productsFilter.jsx";
import './products.css'

export default function Products() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        getProducts(event)
    }, []);

    function getProducts(event) {
        axios({
            method: 'GET',
            url: '/api/admin-products/'
        }).then((response) => {
            if (response.status === 200) {
                setProducts(response.data)
            } else {
                window.location.href = '/'
            }
        }).catch((error) => {
            window.location.href = '/'
        })
        event.preventDefault()
    }

    return (
        <>
            <div className="products">
                <header className='products__header'>
                    <h2>Управление продуктами</h2>
                    <button className='products__header__create'>
                        Добавить продукт
                    </button>
                </header>
                <ProductsFilter/>
                <ul className='products__list'>
                    {products.map((value, key) => {
                        return (
                            <>
                                <li>
                                    <div className="product__photo">
                                        {value.photos[0] ?
                                            value.photos.map((value, key) => {
                                                if (key < 5) {
                                                    return (
                                                        <>
                                                            <img src={value.photo} alt='product photo'/>
                                                        </>
                                                    )
                                                }
                                            }) : ''
                                        }
                                    </div>
                                    <div className="product__data">
                                        <div className="product__data__info">
                                            <p><b>Название:</b> {value.name}</p>
                                            <p>{value.info}</p>
                                            <p><b>Описание:</b> {value.description}</p>
                                            <p><b>Цена:</b> {value.price}</p>
                                        </div>
                                    </div>
                                </li>
                            </>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}