import './notFound.css'
import notFound from '../../images/not found.jpg'

export default function NotFound() {
    return (
        <>
            <div className="not_found">
                <div className="not_found__image">
                    <img src={notFound} alt='not found' loading='lazy'/>
                </div>
                <h3>Здесь ничего нет</h3>
            </div>
        </>
    )
}