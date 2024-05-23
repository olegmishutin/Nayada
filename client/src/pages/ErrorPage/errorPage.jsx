import {Outlet, useRouteError} from "react-router-dom"
import anonImage from "../../images/Auth/anon image.jpg";
import Panel from "../../components/Panel/panel.jsx";

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <>
            <div className="index">
                <Panel/>
                <div className='index__detail'>
                    <div className="anon">
                        <div className="anon__image">
                            <img src={anonImage} alt='anon image' loading='lazy'/>
                        </div>
                        <h1>Возникла ошибка: {error.status}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}