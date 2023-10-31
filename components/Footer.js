import React from 'react'

export default function Footer() {
    const d = new Date();
    const currentYear = d.getFullYear();
    return (
        <div className='bg-slate-300 p-2 text-center position:absolute bottom-0'>
            Address: 1122 33rd Ave. Flushing NY 11354
            <br /> <small>&copy; Copyright {currentYear}, abc Corporation</small>
        </div>
    )
}
