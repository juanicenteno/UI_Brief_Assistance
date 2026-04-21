import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useMemo, useState } from 'react';

function Wait() {
    const loadingSteps = useMemo(() => ([
        "Definiendo la estrategia de marca...",
        "Creando el brief creativo...",
        "Generando logo y mockup...",
        "Armando el resultado final...",
    ]), []);
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        // Al montar, desactivar scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Al desmontar, restaurar el scroll original
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % loadingSteps.length);
        }, 2200);

        return () => clearInterval(id);
    }, [loadingSteps.length]);

    return (
        <div className='wait-container'>
            <div className='wait-card'>
                <p className='wait-chip'>Generando tu propuesta</p>
                <h3 className='wait-title'>Tu brief se esta construyendo</h3>
                <p className='wait-subtitle'>{loadingSteps[stepIndex]}</p>

                <div className='gif'>
                <DotLottieReact
                    src="https://lottie.host/ec206cea-fa40-43d1-874a-1b441c8d9e08/fxw7hCkl9a.json"
                    loop
                    autoplay
                />
                </div>

                <div className='wait-progress-track'>
                    <div className='wait-progress-fill' />
                </div>
                <p className='wait-footnote'>Suele tardar entre 15 y 40 segundos.</p>
            </div>
        </div>
    )
}

export default Wait