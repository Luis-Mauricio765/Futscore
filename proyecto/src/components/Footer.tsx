
const Footer = () => {
    return (
        <footer className="text-light py-3 mt-auto"
            style={{ backgroundColor: "#001f3f" }}>
            <div className="container text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} Futscore. Todos los derechos reservados.</p>
                <small> Empresa Syda.co </small>
            </div>
        </footer>
    );
};

export default Footer;
