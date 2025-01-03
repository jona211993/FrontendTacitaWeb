import logo from '../images/icono-logo.png'; // Ajusta la ruta según sea necesario

export const Logo = () => {
    return (
      <div className='flex items-center justify-center p-3 mt-6'>
          <div className="w-10 h-10 flex items-center justify-center">
            <img src={logo} alt="logo" />          
          </div> 
      </div>
    );
}