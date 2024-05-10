interface ModalProp {
    show: boolean;
    title?: string;
    positiveAction?: () => void;
    positiveLabel?: string;
    negativeAction?: () => void;
    negativeLabel?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    children?: any;
}

export function Modal({ show, title, children, showCloseButton = true, ...props }: ModalProp) {

    if (!show) {
        return null;
    }

    const onClose = () => {
        props.onClose && props.onClose();
    };

    return (
        <div className="fixed inset-0">
            <div className="fixed inset-0 bg-gray-900 opacity-50" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                    className="min-w-72 sm:max-w-96 px-8 py-4 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] grid place-content-center"
                >
                    <div className="absolute top-[-0.7rem] right-2 bg-red-500 rounded-full p-1 border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-red-700" hidden={!showCloseButton}>
                        <svg onClick={() => onClose()}
                            className="h-6 w-6 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                                className="stroke-current text-black"
                            />
                        </svg>
                    </div>
                    <div>
                        {title && <h1 className="text-2xl mb-4">{title}</h1>}
                        {children}
                        <div className="flex space-x-2 mx-auto w-32">
                            {
                                props.negativeLabel &&
                                <button
                                    onClick={() =>
                                        props.negativeAction && props.negativeAction()
                                    }
                                    className="text-base">Cancel</button>
                            }
                            {
                                props.positiveLabel &&
                                <button
                                    onClick={() =>
                                        props.positiveAction && props.positiveAction()
                                    }
                                    className="h-12 border-black border-2 p-2.5 bg-[#A6FAFF] hover:bg-[#79F7FF] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:bg-[#00E1EF] rounded-full"
                                >
                                    {props.positiveLabel}
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
}