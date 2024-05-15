import {useState, useEffect} from "react"
import axios from "axios"

import './orders.css'
import anonImage from '../../images/Auth/anon image.jpg'

export default function Orders() {
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
            {userType !== 'anon' ? <>
                <h1>Мои заказы</h1>
            </> : <>
                <div className="anon">
                    <div className="anon__image">
                        <img src={anonImage} alt='anon image' loading='lazy'/>
                    </div>
                    <h1>Вы не вошли в систему</h1>
                </div>
            </>
            }
        </>
    )
}