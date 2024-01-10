function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
              <svg className="bi" width="30" height="24"><use xlinkHref="#bootstrap"></use></svg>
            </a>
            <span className="mb-3 mb-md-0 text-muted">© 2024 Company, Inc</span>
          </div>
          {/* Adicione mais links ou informações aqui */}
          <div>
            <a href="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</a>
            <a href="/contact" className="text-muted text-decoration-none me-3">Contact Us</a>
          </div>
        </footer>
      </div>
    </footer>
  );
}

export default Footer;
