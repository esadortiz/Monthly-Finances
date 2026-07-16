export function AuthBackground() {
  return (
    <>
      <picture>
        <source srcSet="/images/Fondo_Destop_Negro.png" media="(prefers-color-scheme: dark)" />
        <img
          src="/images/Fondo_Destop_Blanco.png"
          alt=""
          className="hidden md:block absolute inset-0 size-full object-cover"
        />
      </picture>
      <picture>
        <source srcSet="/images/Fondo_Telefono_Negro.png" media="(prefers-color-scheme: dark)" />
        <img
          src="/images/Fondo_Telefono_Blanco.png"
          alt=""
          className="block md:hidden absolute inset-0 size-full object-cover"
        />
      </picture>
    </>
  )
}
