export function AuthBackground() {
  return (
    <>
      <div className="hidden md:block absolute inset-0">
        <img
          src="/images/Fondo_Destop_Blanco.png"
          alt=""
          className="size-full object-cover dark:hidden"
        />
        <img
          src="/images/Fondo_Destop_Negro.png"
          alt=""
          className="hidden dark:block size-full object-cover"
        />
      </div>
      <div className="block md:hidden absolute inset-0">
        <img
          src="/images/Fondo_Telefono_Blanco.png"
          alt=""
          className="size-full object-cover dark:hidden"
        />
        <img
          src="/images/Fondo_Telefono_Negro.png"
          alt=""
          className="hidden dark:block size-full object-cover"
        />
      </div>
    </>
  )
}
