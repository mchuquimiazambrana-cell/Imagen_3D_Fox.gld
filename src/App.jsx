
import { useState, useEffect, useRef } from 'react';
import './App.css';

// Funcion para controlar el tamaño en los tres ejes
const s = (n) => `${n} ${n} ${n}`;

export default function App() {

  // ESTADOS DE LA APLICACION
  const [personaje, setPersonaje] = useState(false);
  const [grande, setGrande] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [detectado, setDetectado] = useState(false);

  // Referencia del marcador Hiro
  const markerRef = useRef(null);

  // DETECCION DEL MARCADOR
  useEffect(() => {

    const marker = markerRef.current;

    if (!marker) return;

    const encontrado = () => {
      console.log("Marcador Hiro detectado");
      setDetectado(true);
    };

    const perdido = () => {
      console.log("Marcador Hiro perdido");
      setDetectado(false);
    };

    marker.addEventListener('markerFound', encontrado);
    marker.addEventListener('markerLost', perdido);

    return () => {
      marker.removeEventListener('markerFound', encontrado);
      marker.removeEventListener('markerLost', perdido);
    };

  }, []);

  return (
    <>

      {/* PANEL DE CONTROLES */}

      <div className="panel">

        {/* BOTON PARA CAMBIAR EL OBJETO */}

        <button onClick={() => {
          setPersonaje(prev => !prev);
          setClicks(prev => prev + 1);
        }}>
          {personaje ? "objeto" : "personaje"}
        </button>

        {/* BOTON PARA CAMBIAR EL TAMAÑO */}

        <button onClick={() => {
          setGrande(prev => !prev);
          setClicks(prev => prev + 1);
        }}>
          tamaño
        </button>

        {/* CONTADOR DE CLICS */}

        <span>
          Clics : {clicks}
        </span>

        {/* ESTADO DEL MARCADOR */}

        <span>
          {detectado
            ? "Hiro detectado"
            : "Buscando Hiro..."}
        </span>

      </div>


      {/* ESCENARIO DE REALIDAD AUMENTADA */}

      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        vr-mode-ui="enabled: false"
        renderer="antialias: true; alpha: true"
      >

        {/* MARCADOR HIRO */}

        <a-marker
          ref={markerRef}
          preset="hiro"
          emitevents="true"
        >

          {/* CONTENEDOR DEL OBJETO */}

          <a-entity
            scale={s(grande ? 2 : 1)}
            animation="
              property: rotation;
              to: 0 360 0;
              loop: true;
              dur: 4000
            "
          >

            {/* MOSTRAR FOX O CUBO */}

            {personaje ? (

              // PERSONAJE FOX CON MOVIMIENTO DE SALTO

              <a-gltf-model
                src="/Fox.glb"
                scale={s(0.01)}
                animation="
                  property: position;
                  from: 0 0 0;
                  to: 0 0.8 0;
                  dir: alternate;
                  loop: true;
                  dur: 700;
                  easing: easeInOutSine
                "
              />

            ) : (

              // CUBO MORADO

              <a-box
                position="0 0.5 0"
                color="#824cd9"
              />

            )}

          </a-entity>

        </a-marker>

        {/* CAMARA */}

        <a-entity camera></a-entity>

      </a-scene>

    </>
  );
}
