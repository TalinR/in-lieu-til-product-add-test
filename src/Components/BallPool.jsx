import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

// "dO MoRe EffiCienT ImPorts"
const importAll = (r) => {
    let images = {};
    r.keys().forEach((key) => {
      const name = key.replace('./', '').replace(/\.[^/.]+$/, ''); // Remove './' and extension
      images[name] = r(key);
    });
    return images;
  };
  
const images = importAll(require.context('../assets/images/floating_people', false, /\.(png|jpe?g|svg)$/));


const BallPool = function() {
    const sceneRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const engineRef = useRef(null); // Store Matter.js engine instance

    


    useEffect(() => {

        // Ensure that this code runs only once
        if (engineRef.current) {
            return;
        }
        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Composite = Matter.Composite,
            Composites = Matter.Composites,
            Common = Matter.Common,
            Bodies = Matter.Bodies,
            Events = Matter.Events,
            Query = Matter.Query;

        // Create engine
        // Create engine if not already created

        Matter.Common._nextId = 0;

        const engine = Engine.create(),
            world = engine.world;



        // Set gravity to zero
        world.gravity.y = 0;
        world.gravity.x = 0;

        // gravity = engine.gravity

        const pixelRatio = window.devicePixelRatio;

        // Create renderer
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                showAngleIndicator: false,
                wireframes: false,
                background: 'transparent',
                pixelRatio: pixelRatio,
            },
        });

        Render.run(render);

        // Create runner
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Add bounding walls at the edges of the viewport with bouncy restitution
        const thickness = 1000; // Minimum width for the walls
        const boundaries = [
            Bodies.rectangle(window.innerWidth / 2, 60 - thickness / 2, window.innerWidth, thickness, { 
                isStatic: true, restitution: 1, render: { opacity: 0 }
            }),
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight + thickness / 2, window.innerWidth, thickness, { 
                isStatic: true, restitution: 1, render: { opacity: 0 }
            }),
            Bodies.rectangle(0 - thickness / 2, window.innerHeight / 2, thickness, window.innerHeight, { 
                isStatic: true, restitution: 1, render: { opacity: 0 }
            }),
            Bodies.rectangle(window.innerWidth + thickness / 2, window.innerHeight / 2, thickness, window.innerHeight, { 
                isStatic: true, restitution: 1, render: { opacity: 0 }
            }),
        ];
        Composite.add(world, boundaries);

        const randomPosition = (maxWidth, maxHeight) => ({
            x: Math.random() * maxWidth,
            y: Math.random() * maxHeight
        });



        const createBody = (type, size, options) => {
            var { x, y } = randomPosition(window.innerWidth, window.innerHeight-60);
            y+=60
            let body;
            if (type === 'circle') {
                body = Bodies.circle(x, y, size, {
                    ...options,
                    restitution: .7, // High restitution for bounciness
                    frictionAir: 0, // Increase air resistance
                });
            } else if (type === 'rectangle') {
                body = Bodies.rectangle(x, y, size.width, size.height, {
                    ...options,
                    restitution: .7, // High restitution for bounciness
                    frictionAir: 0.001, // Increase air resistance
                });
            } else {
                body = Bodies.polygon(x, y, size.sides, size.radius, {
                    ...options,
                    restitution: .7, // High restitution for bounciness
                    frictionAir: 0, // Increase air resistance
                });
            }

            const randomVelocity = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
            };
            Matter.Body.setVelocity(body, randomVelocity);

            // Apply random angular velocity for spinning
            const randomAngularVelocity = (Math.random() - 0.5) * 0.1; // Adjust the multiplier for faster or slower spin
            Matter.Body.setAngularVelocity(body, randomAngularVelocity);
            return body;
        };

        // Adding various bodies
        // yes its some bad code whatever...
        Composite.add(world, [
            createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['1'], xScale: 0.1, yScale: 0.1 } } }),
            createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['2'], xScale: 0.1, yScale: 0.1 } } }),
            createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['3'], xScale: 0.1, yScale: 0.1 } } }),
            createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['4'], xScale: 0.1, yScale: 0.1 } } }),
            createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['5'], xScale: 0.1, yScale: 0.1 } } }),
            createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['6'], xScale: 0.1, yScale: 0.1 } } }),
            // createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['7'], xScale: 0.1, yScale: 0.1 } } }),
            createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['8'], xScale: 0.1, yScale: 0.1 } } }),
            // createBody('rectangle', { width: 70, height: 170 }, { render: { sprite: { texture: images['9'], xScale: 0.1, yScale: 0.1 } } }),

            // createBody('rectangle', { width: 100, height: 180 }, { render: { sprite: { texture: images['3'], xScale: 0.2, yScale: 0.2 } } }),
            // createBody('rectangle', { width: 160, height: 60 }, { render: { sprite: { texture: images['4'], xScale: 0.12, yScale: 0.12 } } }),
            // createBody('rectangle', { width: 40, height: 180 }, { render: { sprite: { texture: images['5'], xScale: 0.15, yScale: 0.15 } } }),
            // createBody('rectangle', { width: 40, height: 160 }, { render: { sprite: { texture: images['6'], xScale: 0.15, yScale: 0.15 } } }),
            // createBody('rectangle', { width: 40, height: 160 }, { render: { sprite: { texture: images['7'], xScale: 0.15, yScale: 0.15 } } }),
            // createBody('rectangle', { width: 40, height: 160 }, { render: { sprite: { texture: images['8'], xScale: 0.15, yScale: 0.15 } } }),
            // createBody('rectangle', { width: 40, height: 160 }, { render: { sprite: { texture: images['9'], xScale: 0.15, yScale: 0.15 } } }),



        ]);


        if (typeof window !== 'undefined') {
            var updateGravity = function(event) {
                var orientation = typeof window.screen.orientation !== 'undefined' ? window.screen.orientation : 0,
                    gravity = engine.gravity;

    
                if (orientation === 0) {
                    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
                    gravity.y = Common.clamp(event.beta, -90, 90) / 90;
                } else if (orientation === 180) {
                    gravity.x = Common.clamp(event.gamma, -90, 90) / 90;
                    gravity.y = Common.clamp(-event.beta, -90, 90) / 90;
                } else if (orientation === 90) {
                    gravity.x = Common.clamp(event.beta, -90, 90) / 90;
                    gravity.y = Common.clamp(-event.gamma, -90, 90) / 90;
                } else if (orientation === -90) {
                    gravity.x = Common.clamp(-event.beta, -90, 90) / 90;
                    gravity.y = Common.clamp(event.gamma, -90, 90) / 90;
                }
            };
    
            // window.addEventListener('deviceorientation', updateGravity);
            window.screen.orientation.addEventListener("change",updateGravity);
        }

        // Keep the mouse in sync with rendering

        // Fit the render viewport to the scene
        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: window.innerWidth, y: window.innerHeight },
        });

        setIsMounted(true);
        engineRef.current = engine;

        return () => {
            if (isMounted) {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
            engine.events = {};
            }
        };

    }, []);

    return <div ref={sceneRef} />;
};

export default BallPool;