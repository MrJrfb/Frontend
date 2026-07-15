function Header({titulo,tagline}){
    return (
        <header className="site-header">
            <h1>{titulo}</h1>
            <p className="site-tagline">{tagline}</p>
        </header>
    )
}

export default Header