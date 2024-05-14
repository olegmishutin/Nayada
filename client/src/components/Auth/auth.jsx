import './auth.css'

export default function Auth(props) {
    return (
        <>
            <div className="auth">
                <div className="auth__box">
                    <form>
                        {props.children}
                        <p>{props.status}</p>
                    </form>
                    <div className="auth__box__image">
                        <img src={props.authImage} alt='reg image'/>
                    </div>
                </div>
            </div>
        </>
    )
}