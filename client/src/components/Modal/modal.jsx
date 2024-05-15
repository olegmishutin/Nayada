import './modal.css'

export default function Modal(props) {
    function closeModal(){
        document.getElementById('modal-window').style.display = 'none'
    }

    return (
        <>
            <div className="modal" id='modal-window'>
                <div className="modal__container">
                    {props.children}
                    <div className="modal__container__buttons">
                        {props.buttons}
                        <button className='modal__container__buttons__close' onClick={closeModal}>Закрыть</button>
                    </div>
                </div>
            </div>
        </>
    )
}