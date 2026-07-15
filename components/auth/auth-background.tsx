"use client"

import Image from "next/image"

export function AuthBackground() {
  return (
    <>
      <Image
        src="/images/Fondo_Destop_Blanco.png"
        alt=""
        fill
        className="object-cover hidden md:block"
        priority
      />
      <Image
        src="/images/Fondo_Telefono_Blanco.png"
        alt=""
        fill
        className="object-cover block md:hidden"
        priority
      />
    </>
  )
}
