import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const PhysicsCanvas = () => {
    const sceneRef = useRef(null);

    useEffect(() => {
        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

        // Create an engine
        const engine = Engine.create();

        // Create a renderer
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
            },
        });

        // Create two boxes and a ground
        const boxA = Bodies.rectangle(400, 200, 80, 80);
        const boxB = Bodies.rectangle(450, 50, 80, 80);
        const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        // Add all of the bodies to the world
        Composite.add(engine.world, [boxA, boxB, ground]);

        // Run the renderer
        Render.run(render);

        // Create a runner
        const runner = Runner.create();

        // Run the engine
        Runner.run(runner, engine);

        // Clean up on unmount
        return () => {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
        };
    }, []);

    return <div ref={sceneRef} />;
};

export default PhysicsCanvas;
