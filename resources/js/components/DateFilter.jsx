import React, { useState } from "react";
import {
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBInputGroup,
    MDBBtn
} from "mdb-react-ui-kit";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter = ({ onChange }) => {
    const [range, setRange] = useState("yesterday");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleRangeChange = (type) => {
        setRange(type);
        let from, to;

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        switch (type) {
            case "today":
                from = to = today;
                break;
            case "yesterday":
                from = to = yesterday;
                break;
            case "7days":
                from = new Date();
                from.setDate(today.getDate() - 6);
                to = today;
                break;
            case "month":
                from = new Date(today.getFullYear(), today.getMonth(), 1);
                to = today;
                break;
            case "all":
                from = null;
                to = null;
                break;
            default:
                from = startDate;
                to = endDate;
                break;
        }

        onChange({ type, from, to });
    };

    const handleCustomRange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            handleRangeChange("custom");
        }
    };

    return (
        <div className="d-flex flex-wrap align-items-center gap-2">
            <MDBBtn
                size="sm"
                color={range === "today" ? "primary" : "light"}
                onClick={() => handleRangeChange("today")}
            >
                Сегодня
            </MDBBtn>
            <MDBBtn
                size="sm"
                color={range === "yesterday" ? "primary" : "light"}
                onClick={() => handleRangeChange("yesterday")}
            >
                Вчера
            </MDBBtn>
            <MDBBtn
                size="sm"
                color={range === "7days" ? "primary" : "light"}
                onClick={() => handleRangeChange("7days")}
            >
                Последние 7 дней
            </MDBBtn>
            <MDBBtn
                size="sm"
                color={range === "month" ? "primary" : "light"}
                onClick={() => handleRangeChange("month")}
            >
                За месяц
            </MDBBtn>
            <MDBBtn
                size="sm"
                color={range === "all" ? "primary" : "light"}
                onClick={() => handleRangeChange("all")}
            >
                Всё время
            </MDBBtn>

            <MDBDropdown className="ms-auto">
                <MDBDropdownToggle color="light" size="sm">
                    Календарь
                </MDBDropdownToggle>
                <MDBDropdownMenu className="p-3">
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleCustomRange}
                        dateFormat="yyyy-MM-dd"
                        isClearable
                    />
                </MDBDropdownMenu>
            </MDBDropdown>
        </div>
    );
};

export default DateFilter;
