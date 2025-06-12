import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,range} from 'lodash-es';
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';

const loadExplorable = (displayContainer,controlsContainer) => {

    const display = d3.select(displayContainer);
    const controls = d3.select(controlsContainer);

    const N = 3; // Number of agents
    const L = config.plot.L; // Length of the display area
    const margin = config.plot.margin; // Margin for the plot
    var timer = {};
    var t = 0;
    var dt = 0.01;

    var X = d3.scaleLinear().domain([-L / 2,L / 2]).range([margin,config.display.width - margin]);
    var Y = d3.scaleLinear().domain([-L / 2,L / 2]).range([margin,config.display.height - margin]);

    const agents = map(range(N),(a,i) => {
        let theta = 2 * Math.PI * Math.random();
        return {
            theta: theta,
            omega: 3 + 2 * i,
            x: Math.cos(theta),
            y: Math.sin(theta)
        }
    })

    const iterate = () => {
        each(agents,a => {
            a.theta += dt * (a.omega);
            a.x = Math.cos(a.theta);
            a.y = Math.sin(a.theta);
        })
        display.selectAll("." + styles.agent)
            .attr("transform",function(d) {
                return "translate(" + X(L / 2 * Math.cos(d.theta)) + "," + Y(L / 2 * Math.sin(d.theta)) + ")"
            })
    }

    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const button = widgets.button()
        .id(config.controls.button.id)
        .value(config.controls.button.value)
        .actions(config.controls.button.actions)
        .position(g.position(config.controls.button.position.x,config.controls.button.position.y));

    const go = (d) => {button.value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

    button.update(go)

    controls.selectAll(null).data([button]).enter().append(widgets.widget);

    display.append("circle").attr("r",0.5 * (config.display.width - 2 * margin))
        .attr("class",styles.big_circle)
        .attr("transform","translate(" + X(0) + "," + Y(0) + ")")

    display.selectAll("." + styles.agent).data(agents).enter().append("circle")
        .attr("class",styles.agent)
        .attr("r",config.plot.agentsize)
        .attr("transform",function(d) {
            return "translate(" + X(L / 2 * Math.cos(d.theta)) + "," + Y(L / 2 * Math.sin(d.theta)) + ")"
        })

    display.append("g").attr("class","grid")

    const cleanup = () => {
        if(timer) timer.stop();
        display.selectAll("*").remove();
        controls.selectAll("*").remove();
    }

    // controls.selectAll("*").data(g.points).enter().append("circle")
    //     .attr("class","grid")
    //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
    //     .attr("r",1)
    //     .style("fill","black")
    //     .style("stroke","none")

    return cleanup;
}


export default ({id}) => {
    const ContainerRef = useRef(null); // Ref for the first div
    const displayContainerRef = useRef(null); // Ref for the first div
    const controlsContainerRef = useRef(null); // Ref for the second div

    useEffect(() => {

        return loadExplorable(displayContainerRef.current,controlsContainerRef.current);

    },[id]); // Add `id` as a dependency to ensure it updates if the prop changes

    return (
        <>
            <div
                ref={ContainerRef}
                id={id}
                className={config.container.class}
            >
                <svg
                    ref={displayContainerRef}
                    id={`${id}-display`}
                    className={config.display.class}
                    width={config.display.width}
                    height={config.display.height}
                    viewBox={`0 0 ${config.display.width} ${config.display.height}`}
                />
                <svg
                    ref={controlsContainerRef}
                    id={`${id}-controls`}
                    className={config.controls.class}
                    width={config.controls.width}
                    height={config.controls.height}
                    viewBox={`0 0 ${config.controls.width} ${config.controls.height}`}
                />
            </div>
        </>
    );
}