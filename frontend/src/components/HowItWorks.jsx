import React from 'react'

function HowItWorks() {
    return (
        <>

            <article className="title-subtitle">
                {/* <p className="subtitle">
                   AI Experience Assistant es una plataforma web que convierte ideas de negocio en modelos completos usando inteligencia artificial. Solo con una breve descripción, el sistema genera automáticamente un logotipo, una descripción del producto, paleta de colores, tipografías, user persona, mockups y más. Está pensada para ayudar a emprendedores a presentar y desarrollar sus ideas de forma rápida, visual y profesional.
                </p> */}
                <h2 className="project-description">
                    Transformá tus ideas en realidad con <i className="gradient">Inteligencia Artificial.</i>
                </h2>
                <button className="create-project"
                    onClick={() => document.querySelector('textarea[name="idea"]').focus()}
                > Creá tu proyecto ahora</button>
            </article>

            <section className="how-it-works">
                <h3>¿Cómo funciona?</h3>
                <ul className="list-hiw">
                    <li>
                        <img src="/inspiration.png" alt="" />
                        <span>Idea</span>
                    </li>
                    <li>
                        <img src="/ai3.png" alt="" />
                        <span>Diseño</span>
                    </li>
                    <li>
                        <img src="/technical-support.png" alt="" />
                        <span>Desarrollo</span>
                    </li>
                </ul>
            </section>
        </>
    )
}

export default HowItWorks