/* Diffusion or particles in two dimensions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,meanBy,range} from "lodash-es";
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (displayContainer,plotContainer,controlsContainer) => {


    const N = 1000; // Number of pparticles
    var timer = {}

    const X = d3.scaleLinear()
        .domain(config.display.xr)
        .range([config.display.margin.l,config.display.width - config.display.margin.r]);

    const Y = d3.scaleLinear()
        .domain(config.display.yr)
        .range([config.display.height - config.display.margin.b,config.display.margin.t]);

    const T = d3.scaleLinear()
        .domain(config.plot.xr)
        .range([config.plot.margin.l,config.plot.width - config.plot.margin.r]);

    const R = d3.scaleLinear()
        .domain(config.plot.yr)
        .range([config.plot.height - config.plot.margin.b,config.plot.margin.t]);


    const xAxis = d3.axisBottom(X);
    const yAxis = d3.axisLeft(Y);

    const tAxis = d3.axisBottom(T);
    const rAxis = d3.axisLeft(R);

    const curve = d3.line().x(d => X(d.x)).y(d => Y(d.y));
    const pcurve = d3.line().x(d => T(d.t)).y(d => R(d.r));


    const dw = d3.randomNormal(0,1);
    var tick = 0;
    var agents = map(range(N),i => ({id: i,x: 0,y: 0}));
    var msd = [{t: tick,r: meanBy(agents,d => Math.sqrt(d.x * d.x + d.y * d.y))}];
    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const display = d3.select(displayContainer.current)
    const controls = d3.select(controlsContainer.current)
    const plot = d3.select(plotContainer.current)

    const buttons = map(config.widgets.buttons,
        v => widgets.button()
            .id(v.id)
            .value(v.value)
            .actions(v.actions)
            .position(g.position(v.position.x,v.position.y))
    );

    function iterate() {
        tick++;
        each(agents,a => {a.x += dw(),a.y += dw()})
        msd.push({t: tick,r: meanBy(agents,d => Math.sqrt(d.x * d.x + d.y * d.y))})

        display.selectAll("." + styles.agent).data(agents)
            .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

        plot.select("#msd").datum(msd).attr("d",pcurve)

        if(tick > N) {
            reset()
        }
    }

    function reset() {
        tick = 0;
        agents = map(range(N),i => ({id: i,x: 0,y: 0}));
        msd = [{t: tick,r: meanBy(agents,d => Math.sqrt(d.x * d.x + d.y * d.y))}];
        display.selectAll("." + styles.agent).data(agents)
            .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

        plot.select("#msd").datum(msd).attr("d",pcurve)

    }

    function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

    buttons[0].update(go)
    buttons[1].update(reset)


    controls.selectAll(null).data(buttons).enter().append(widgets.widget);

    const update = () => {
    }

    display.append("g").attr("transform","translate(0," + Y(0) + ")").call(xAxis).style("font-size",config.display.fontsize).attr("class",styles.axis);
    display.append("g").attr("transform","translate(" + X(0) + ",0)").call(yAxis).style("font-size",config.display.fontsize).attr("class",styles.axis);

    display.selectAll("." + styles.agent).data(agents).enter().append("circle")
        .attr("class",styles.agent)
        .attr("r","3")
        .style("stroke","none")
        .attr("transform",function(d) {return "translate(" + X(d.x) + "," + Y(d.y) + ")"})

    plot.append("path").datum(msd).attr("d",pcurve)
        .attr("id","msd")
        .attr("class",styles.plotline)


    plot.append("g")
        .attr("transform","translate(0," + R(0) + ")")
        .attr("class",styles.axis)
        .call(tAxis)
        .style("font-size",config.plot.fontsize);

    plot.append("g")
        .attr("transform","translate(" + T(0) + ",0)")
        .attr("class",styles.axis)
        .call(rAxis)
        .style("font-size",config.plot.fontsize);


    // controls.selectAll("*").data(g.points).enter().append("circle")
    //     .attr("class","grid")
    //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
    //     .attr("r",1)
    //     .style("fill","black")
    //     .style("stroke","none")

    return () => {
        controls.selectAll("*").remove(); // Remove all circles from the second SVG
        display.selectAll("*").remove(); // Remove all circles from the second SVG
        plot.selectAll("*").remove(); // Remove all circles from the second SVG
    };
}

export default ({id}) => {
    const displayContainerRef = useRef(null); // Ref for the first div
    const plotContainerRef = useRef(null); // Ref for the second div
    const controlsContainerRef = useRef(null); // Ref for the second div
    const ContainerRef = useRef(null); // Ref for the first div

    useEffect(() => {

        return loadExplorable(displayContainerRef,plotContainerRef,controlsContainerRef);


    },[id]); // Add `id` as a dependency to ensure it updates if the prop changes

    return (
        <>
            <div
                ref={ContainerRef}
                id={id}
                className={config.container.class}
            >
                <div className="flex">
                    <svg
                        ref={displayContainerRef}
                        id={`${id}-display`}
                        className={config.display.class}
                        width={config.display.width}
                        height={config.display.height}
                        viewBox={`0 0 ${config.display.width} ${config.display.height}`}
                    />

                    <svg
                        ref={plotContainerRef}
                        id={`${id}-plot`}
                        className={config.plot.class}
                        width={config.plot.width}
                        height={config.plot.height}
                        viewBox={`0 0 ${config.plot.width} ${config.plot.height}`}
                    />
                </div>
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