import React, { useContext } from 'react'
import AdminNavbar from '../AdminNavbar';
import { ThemeContext } from '../Context/ThemeContext'
import ArchivedData from './ArchivedData';

const Archives = () => {
    const theme = useContext(ThemeContext);
    const { isLightTheme, light, dark } = theme;
    const checkTheme = isLightTheme ? light : dark;
    return (
        <div style={{backgroundColor: checkTheme.bg, color: checkTheme.bgColor}}>
            <AdminNavbar />
            <div className="archives-page">
              <div className="archive-welcome"><h2 style={{textAlign: 'center'}}>Archives</h2></div>
              <ArchivedData />
            </div>
        </div>
    )
}

export default Archives
