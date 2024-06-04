import './ordersFilter.css'

export default function OrdersFilter(props) {
    function resetFilter(func) {
        const checkboxes = [
            'new_order_checkbox',
            'processing_order_checkbox',
            'completed_order_checkbox',
            'canceled_order_checkbox',
            'expensive_order_checkbox',
            'cheap_order_checkbox'
        ]

        checkboxes.forEach((value) => {
            document.getElementById(value).checked = false
        })

        props.categories.forEach((value) => {
            document.getElementById(`order-category-${value.id}`).checked = false
        })

        func()
    }

    return (
        <>
            <div className="orders_filter">
                <h4 className='orders_filter__header_text'>Фильтры состояний</h4>
                <form className="orders_filter__filters">
                    <div className="orders_filter__box">
                        <input type='checkbox' name='new_order' id='new_order_checkbox' defaultChecked={true}/>
                        <label htmlFor='new_order_checkbox'>Новые</label>
                    </div>
                    <div className="orders_filter__box">
                        <input type='checkbox' name='processing_order' id='processing_order_checkbox'
                               defaultChecked={true}/>
                        <label htmlFor='processing_order_checkbox'>В обработке</label>
                    </div>
                    <div className="orders_filter__box">
                        <input type='checkbox' name='completed_order' id='completed_order_checkbox'/>
                        <label htmlFor='completed_order_checkbox'>Выполнен</label>
                    </div>
                    <div className="orders_filter__box">
                        <input type='checkbox' name='canceled_order' id='canceled_order_checkbox'/>
                        <label htmlFor='canceled_order_checkbox'>Отменен</label>
                    </div>
                    <div className="orders_filter__box">
                        <input type='checkbox' name='expensive_order' id='expensive_order_checkbox'/>
                        <label htmlFor='expensive_order_checkbox'>Сначала дорогие</label>
                    </div>
                    <div className="orders_filter__box">
                        <input type='checkbox' name='cheap_order' id='cheap_order_checkbox'/>
                        <label htmlFor='cheap_order_checkbox'>Сначала дешевые</label>
                    </div>
                </form>
                {props.categories.length > 0 ? <>
                    <h4 className='orders_filter__header_text'>Фильтры категорий</h4>
                    <ul className='orders_filter__filters'>
                        {
                            props.categories.map((value, key) => {
                                return (
                                    <>
                                        <li className='orders_filter__box'>
                                            <input type='checkbox' name={`category-${value.id}`}
                                                   id={`order-category-${value.id}`}/>
                                            <label htmlFor={`order-category-${value.id}`}>{value.name}</label>
                                        </li>
                                    </>
                                )
                            })
                        }
                    </ul>
                </> : ''}
                <div className="orders_filter__button_box">
                    <button onClick={props.filterFunc} className='orders_filter__button'>Отфильтровать</button>
                    <button onClick={() => {
                        resetFilter(props.filterFunc)
                    }} className='orders_filter__button'>Сбросить
                    </button>
                </div>
            </div>
        </>
    )
}

export function getOrdersFilterUrlParams(categories) {
    let urlParams = ''
    const statuses = []

    const statusCheckboxes = [
        ['new_order_checkbox', 'Н'],
        ['processing_order_checkbox', 'О'],
        ['completed_order_checkbox', 'В'],
        ['canceled_order_checkbox', 'ОТ']
    ]

    const priceCheckboxes = [
        ['expensive_order_checkbox', 'expensive'],
        ['cheap_order_checkbox', 'cheap']
    ]

    statusCheckboxes.forEach((value) => {
        if (document.getElementById(value[0]).checked) {
            statuses.push(value[1])
        }
    })

    if (statuses) {
        urlParams += `?status=${statuses}`
    }

    priceCheckboxes.forEach((value) => {
        if (document.getElementById(value[0]).checked) {
            if (urlParams) {
                urlParams += `&${value[1]}=true`
            } else {
                urlParams += `?${value[1]}=true`
            }
        }
    })

    categories.forEach((value) => {
        if (document.getElementById(`order-category-${value.id}`).checked) {
            if (urlParams) {
                urlParams += `&category-${value.id}=true`
            } else {
                urlParams += `?category-${value.id}=true`
            }
        }
    })

    return urlParams
}