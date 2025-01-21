import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import image1 from "../assets/images/closeups/c1.jpg";
import image2 from "../assets/images/closeups/c2.jpg";
import image3 from "../assets/images/closeups/c3.jpg";
import jade_button from "../assets/images/collage/jade_button.png";
import oolong_button from "../assets/images/collage/oolong_button.png";
import hibiscus_button from "../assets/images/collage/hibiscus_button.png";

import hibiscus_cut_out from "../assets/images/collage/hibiscus_cut_out.png";
import oolong_cut_out from "../assets/images/collage/oolong_cut_out.png";
import sencha_cut_out from "../assets/images/collage/sencha_cut_out.png";

import macha_croissant from "../assets/images/collage/macha_croissant_bland.png";
import paint_tube from "../assets/images/collage/paint_tube.png";
import saxophone from "../assets/images/collage/saxophone.png";

const BallPool = ({ onBodyClick }) => {
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
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
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
                    frictionAir: 0, // Increase air resistance
                });
            } else {
                body = Bodies.polygon(x, y, size.sides, size.radius, {
                    ...options,
                    restitution: .7, // High restitution for bounciness
                    frictionAir: 0, // Increase air resistance
                });
            }

            const randomVelocity = {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3,
            };
            Matter.Body.setVelocity(body, randomVelocity);

            // Apply random angular velocity for spinning
            const randomAngularVelocity = (Math.random() - 0.5) * 0.05; // Adjust the multiplier for faster or slower spin
            Matter.Body.setAngularVelocity(body, randomAngularVelocity);
            return body;
        };

        // Adding various bodies
        Composite.add(world, [
            createBody('rectangle', { width: 100, height: 180 }, { render: { sprite: { texture: oolong_cut_out, xScale: 0.2, yScale: 0.2 } } }),
            createBody('rectangle', { width: 100, height: 180 }, { render: { sprite: { texture: hibiscus_cut_out, xScale: 0.2, yScale: 0.2 } } }),
            createBody('rectangle', { width: 100, height: 180 }, { render: { sprite: { texture: sencha_cut_out, xScale: 0.2, yScale: 0.2 } } }),
            createBody('circle', 35, { render: { sprite: { texture: jade_button, xScale: 0.06, yScale: 0.06 } } }),
            createBody('circle', 35, { render: { sprite: { texture: hibiscus_button, xScale: 0.06, yScale: 0.06 } } }),
            createBody('circle', 35, { render: { sprite: { texture: oolong_button, xScale: 0.06, yScale: 0.06 } } }),
            createBody('rectangle', { width: 160, height: 60 }, { render: { sprite: { texture: macha_croissant, xScale: 0.12, yScale: 0.12 } } }),
            createBody('rectangle', { width: 40, height: 180 }, { render: { sprite: { texture: saxophone, xScale: 0.15, yScale: 0.15 } } }),
                createBody('rectangle', { width: 40, height: 160 }, { render: { sprite: { texture: paint_tube, xScale: 0.15, yScale: 0.15 } } }),

        ]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: { visible: false },
                },
            });

        mouse.pixelRatio = pixelRatio;

        Composite.add(world, mouseConstraint);

        let isDragging = false;
        let initialMousePosition = null;

        Events.on(mouseConstraint, 'mousedown', function(event) {
            initialMousePosition = { x: event.mouse.position.x, y: event.mouse.position.y };
            isDragging = false;
        });

        Events.on(mouseConstraint, 'mousemove', function(event) {
            if (initialMousePosition) {
                const currentMousePosition = event.mouse.position;
                const distance = Math.sqrt(
                    Math.pow(currentMousePosition.x - initialMousePosition.x, 2) +
                    Math.pow(currentMousePosition.y - initialMousePosition.y, 2)
                );

                if (distance > 5) { // Adjust this threshold as needed
                    isDragging = true;
                }
            }
        });

        Events.on(mouseConstraint, 'mouseup', function(event) {
            if (!isDragging && initialMousePosition) {
                const mousePosition = event.mouse.position;
                const clickedBodies = Query.point(Composite.allBodies(world), mousePosition);

                clickedBodies.forEach((body) => {
                    if (onBodyClick) { // Pass the click event handler as a prop
                        onBodyClick(body);
                      }
                    // alert(`You clicked on a body with ID: ${body.id}`);
                });

                
            }

            initialMousePosition = null;
            isDragging = false;
        });

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

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