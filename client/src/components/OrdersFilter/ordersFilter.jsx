import './ordersFilter.css'

export default function OrdersFilter(props) {
    return (
        <>
            <div className="orders_filter">
                <h4 className='orders_filter__header_text'>Фильтры состояний</h4>
                <form className="orders_filter__filters">
                    <div className="orders_filter__box">
                        <input type='checkbox' name='new_order' id='new_order_checkbox'/>
                        <label htmlFor='new_order_checkbox'>Новые</label>
                    </div>
                    <div className="orders_filter__box">
                        <input type='checkbox' name='processing_order' id='processing_order_checkbox'/>
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
                <h4 className='orders_filter__header_text'>Фильтры категорий</h4>
                <ul className='orders_filter__filters'>
                    {
                        props.categories.map((value, key) => {
                            return (
                                <>
                                    <li className='orders_filter__box'>
                                        <input type='checkbox' name={`category-${value.id}`}
                                               id={`order-category-${value.id}`}/>
                                        <label for={`order-category-${value.id}`}>{value.name}</label>
                                    </li>
                                </>
                            )
                        })
                    }
                </ul>
                <button onClick={props.filterFunc} className='orders_filter__button'>Отфильтровать</button>
            </div>
        </>
    )
}