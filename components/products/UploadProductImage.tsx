"use client"

import { uploadImage } from '@/actions/upload-image-action'
import { getImagePath } from '@/src/utils'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function UploadProductImage({currentImage} : {currentImage? : string}) {

    const [image, setImage] = useState('')

    const onDrop = useCallback(async (files : File[]) => {//Función que se ejecuta cuando se suelta una imagen
        const formData = new FormData()//Se intancian los datos para mandarlos en un formulario
        files.forEach(file => {//Como es un arreglo se iteran sobre cada valor
            formData.append('file', file)/// se le agrega el archivo a dcho arreglo
        })
        const image = await uploadImage(formData)//Se utiliza el server action de uploadImage
        setImage(image)//Se setea la imagen  (state)
    }, [])

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        accept: {//Tipos de archivos que se aceptan
            'image/jpeg' : ['.jpg'],
            'image/png' : ['.png'],
        },
        onDrop,
        maxFiles: 1
    })


  return (
    <>
        <div className="space-y-1">
            <label className="block text-sm font-medium leading-6 text-gray-900">
            Imagen Producto
            </label>
            <div {...getRootProps({
            className: `
                    py-20 border-2 border-dashed  text-center 
                    ${isDragActive ? 'border-gray-900 text-gray-900 bg-gray-200 ' : 'border-gray-400 text-gray-400 bg-white'} 
                    ${isDragReject ? 'border-none bg-white' : 'cursor-not-allowed'}
                `})}>
            <input {...getInputProps()} />
                {isDragAccept && (<p>Suelta la Imagen</p>)}
                {isDragReject && (<p>Archivo no válido</p>)}
                {!isDragActive && (<p>Arrastra y suelta una imagen aquí</p>)}
            </div>
        </div>

        {image && (
            <div className='py-5 space-y-3'>
                <p className='font-bold'>Imagen Producto:</p>
                <div className='w-[300px] h-[420px] relative'>
                    <Image
                        src={image}
                        alt='Imagen Publicada'
                        className='object-cover'
                        fill
                    />
                </div>
            </div>
        )}

        {currentImage && !image && (
            <div className='py-5 space-y-3'>
                <p className='font-bold'>Imagen Actual:</p>
                <div className='w-[300px] h-[420px] relative'>
                    <Image
                        src={getImagePath(currentImage)}
                        alt='Imagen Publicada'
                        className='object-cover'
                        fill
                    />
                </div>
            </div>
        )}
    
        {/* Campo oculto para guardar la url de la imagen en el DB */}
        <input
            type='hidden'
            name='image'
            defaultValue={image ? image : currentImage}
        />
    </>
  )
}
