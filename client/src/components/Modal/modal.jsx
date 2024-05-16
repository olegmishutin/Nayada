import './modal.css'

export default function Modal(props) {
    function closeModal() {
        document.getElementById('modal-window').style.display = 'none'
    }

    return (
        <>
            <div className="modal" id={props.id ? props.id : 'modal-window'}>
                <div className="modal__container">
                    {props.children}
                    <p className='modal__container__status'>{props.status}</p>
                    <div className="modal__container__buttons">
                        {props.buttons}
                        <button className='modal__container__buttons__close'
                                onClick={props.id ? props.closeModal : closeModal}>Закрыть
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}