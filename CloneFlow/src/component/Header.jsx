import './Header.css';
import menuIcon from '../assets/menu-icon.svg';
import logo from '../assets/logo.svg';
import searchIcon from '../assets/search-icon.svg';
import parthalogo from '../assets/parthalogo.svg';

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                {/* Left: Menu Icon + Logo */}
                <div className="header-left">
                    <button className="menu-button">
                        <img src={menuIcon} className="menu-icon" alt="Menu Icon" />
                    </button>

                    <div className="logo-container">
                        <img src={logo} className="company-logo" alt="Company Logo" />
                        <span className="company-name"></span>
                    </div>
                </div>

                {/* Center: Search Bar */}
                <div className="header-center">
                    <div className="search-wrapper">
                        <div className="search-icon-container">
                            <img src={searchIcon} className="search-icon" alt="Search Icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects, templates, or users..."
                            className="search-input aoT"
                        />
                    </div>
                </div>

                {/* Right: User Avatar */}
                <div className="header-right">
                    <button className="avatar-button">
                        <img 
                            src={parthalogo} 
                            className="user-avatar" 
                            alt="User Avatar" 
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
