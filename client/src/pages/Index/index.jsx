import Panel from "../../components/Panel/panel.jsx"
import {Outlet} from "react-router-dom"
import './index.css'

export default function Index() {
    return (
        <>
            <div className="index">
                <Panel/>
                <div className='index__detail'>
                    <Outlet/>
                </div>
            </div>
        </>
    )
}