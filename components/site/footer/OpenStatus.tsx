type OpenStatusData = {
    open: boolean;
    todayLabel?: string;
};

type Props = {
    openStatus?: OpenStatusData | null;
    className?: string;
};

export function OpenStatus({
                               openStatus,
                               className = '',
                           }: Props) {
    if (!openStatus) {
        return null;
    }

    return (
        <div
            className={`site-open-fixed white ${
                openStatus.open ? 'is-open' : 'is-closed'
            } ${className}`}
        >
            <svg
                className="site-open-fixed__icon"
                width="24"
                height="34"
                viewBox="0 0 24 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M18.4 1.06743L1.5 1L3.83333 29.6615H21.4667C21.8733 29.6615 22.2633 29.497 22.5509 29.2042C22.8384 28.9114 23 28.5144 23 28.1003V6.24441C23 4.87139 22.5154 3.5546 21.6527 2.58373C20.79 1.61286 19.62 1.06743 18.4 1.06743Z"
                    fill="#FF5000"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <path
                    d="M10.7333 20.2947V17.1724C10.7333 16.3102 11.4198 15.6113 12.2667 15.6113C13.1135 15.6113 13.8 16.3102 13.8 17.1724V20.2947C13.8 21.1569 13.1135 21.8558 12.2667 21.8558C11.4198 21.8558 10.7333 21.1569 10.7333 20.2947ZM18.4 30.8796L18.3805 31.2242C18.343 31.5669 18.2507 31.902 18.105 32.2151C17.9109 32.6324 17.6277 33.0003 17.277 33.293C16.9262 33.5856 16.516 33.7956 16.076 33.9074C15.6362 34.0192 15.1775 34.0298 14.7329 33.9394L3.69857 31.6953C2.65548 31.483 1.71651 30.9092 1.04219 30.0716C0.367856 29.2339 -0.000420964 28.1834 3.6111e-07 27.1003L3.6111e-07 1.56105C3.6111e-07 1.09333 0.206251 0.650133 0.561524 0.353613C0.916769 0.0572303 1.38394 -0.0613226 1.83431 0.0304087L13.4691 2.39956C14.859 2.68246 16.11 3.4471 17.0089 4.56289C17.908 5.67897 18.3996 7.07871 18.4 8.52214V30.8796Z"
                    fill="white"
                />

                <path
                    d="M10.7333 20.2946V17.1724C10.7333 16.3102 11.4198 15.6112 12.2666 15.6112C13.1134 15.6112 13.7999 16.3102 13.7999 17.1724V20.2946C13.7999 21.1568 13.1134 21.8558 12.2666 21.8558C11.4198 21.8558 10.7333 21.1568 10.7333 20.2946Z"
                    fill="#FF5000"
                />
            </svg>

            <div>
                <strong>
                    {openStatus.open
                        ? 'Actuellement ouvert'
                        : 'Actuellement fermé'}
                </strong>

                {openStatus.todayLabel ? (
                    <span>{openStatus.todayLabel}</span>
                ) : null}
            </div>
        </div>
    );
}