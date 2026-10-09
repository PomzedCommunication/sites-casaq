type HourItem = {
    label?: string;
    day?: string;
    [key: string]: any;
};

type Hours = {
    title?: string;
};

type Props = {
    hours: Hours;
    hourItems: HourItem[];
    isTodayHourItem: (item: HourItem) => boolean;
    formatHourItem: (item: HourItem) => string;
    className?: string;
};

export function Horaires({
                                   hours,
                                   hourItems,
                                   isTodayHourItem,
                                   formatHourItem,
                                   className = ''
                               }: Props) {
    if (!hourItems.length) {
        return null;
    }

    return (
        <div className={`site-footer__column ${className}`}>
            <h3>
                {hours.title || 'Horaires'}
            </h3>

            <div className="site-footer__hours">
                {hourItems.map((item, index) => {
                    const isToday = isTodayHourItem(item);

                    return (
                        <div
                            key={index}
                            className={`site-footer__hour-row ${isToday ? 'is-today' : ''}`}
                        >
                            <span className="site-footer__hour-day">
                                {item.label || item.day}
                            </span>

                            <span className="site-footer__hour-value">
                                {formatHourItem(item)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}