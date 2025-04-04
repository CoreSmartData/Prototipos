'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-black to-gray-900">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/core-logo1.png"
              alt="Core Smart Data Logo"
              width={400}
              height={400}
              className="mx-auto mb-8"
            />
            <h1 className="text-5xl font-bold mb-6">
              Soluciones Tecnológicas Inteligentes
            </h1>
            <p className="text-xl mb-8">
              Transformamos la industria de la construcción y energías renovables
              con soluciones basadas en datos
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Conoce más
            </button>
          </motion.div>
        </div>
      </section>

      {/* Modal Próximamente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-lg max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-bold mb-4 text-center">Próximamente</h3>
            <p className="text-gray-600 text-center mb-6">
              Estamos trabajando en nuevas funcionalidades para mejorar tu experiencia.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Contacto */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-lg max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-bold mb-4 text-center">Contáctanos</h3>
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">Llama a nuestro número:</p>
              <a 
                href="tel:+529611036739" 
                className="text-2xl font-semibold text-black hover:text-gray-700 transition-colors"
              >
                +52 961 103 6739
              </a>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowContactModal(false)}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Servicios Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Soluciones para Construcción",
                description: "Software especializado para gestión de proyectos, control de costos, seguimiento de obras y optimización de recursos en la industria de la construcción."
              },
              {
                title: "Energías Renovables",
                description: "Sistemas de monitoreo, análisis de eficiencia energética y gestión de proyectos de energía solar, eólica y otras fuentes renovables."
              },
              {
                title: "Inteligencia de Negocios",
                description: "Dashboards interactivos y reportes personalizados para visualizar KPIs, tendencias y métricas clave en construcción y energía renovable."
              },
              {
                title: "Inteligencia Artificial",
                description: "Algoritmos predictivos para optimización de recursos, mantenimiento preventivo y toma de decisiones basada en datos históricos."
              },
              {
                title: "Análisis de Datos",
                description: "Transformación de datos en insights valiosos para la toma de decisiones estratégicas en construcción y energía renovable."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-gray-50 rounded-lg shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">¿Listo para transformar tu negocio?</h2>
          <p className="text-xl mb-8">
            Contáctanos para discutir cómo podemos ayudarte a alcanzar tus objetivos
          </p>
          <button 
            onClick={() => setShowContactModal(true)}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Contactar ahora
          </button>
        </div>
      </section>
    </main>
  )
} 