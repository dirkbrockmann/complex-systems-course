import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,last,map,range} from 'lodash-es';
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const dt = 0.01; // Time step
const N = 10;
const Tmax = config.plot.xr[1]; // Maximum time
var xr = config.plot.xr;
const yr = config.plot.yr;

const X = d3.scaleLinear().domain(xr).range([config.plot.margin.l,config.display.width - config.plot.margin.r]);
const Y = d3.scaleLinear().domain(yr).range([config.display.height - config.plot.margin.b,config.plot.margin.t]);
const xAxis = d3.axisBottom(X);
const yAxis = d3.axisLeft(Y);
const curve = d3.line().x(d => X(d.t)).y(d => Y(d.X));



var agents = [];
var ticks = 0;
var timer = {};
const dw = d3.randomNormal(0,1);

export default function Fig5({id}) {
    const Container = useRef(null); // Ref for the first div
    const displayContainer = useRef(null); // Ref for the first div
    const controlsContainer = useRef(null); // Ref for the second div

    useEffect(() => {

        console.log(agents)

        const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
        const display = d3.select(displayContainer.current)
        const controls = d3.select(controlsContainer.current)

        const iterate = () => {
            ticks++;
            let k = sliders[1].value();
            let sigma = sliders[0].value();

            each(agents,(d) => {
                let t = last(d.trajectory).t;
                let X = last(d.trajectory).X;
                d.trajectory.push({t: t + dt,X: X - k * dt * X + Math.sqrt(sigma * dt) * dw()})
                if(ticks > Tmax / dt / 2) {
                    d.trajectory.shift();
                }
            })

            if(ticks > Tmax / dt / 2) {
                xr = [xr[0] + dt,xr[1] + dt];
                X.domain(xr);
                display.select("#xaxis").call(xAxis);
            }

            display.selectAll("." + styles.agent).data(agents).attr("d",d => curve(d.trajectory))


        }
        const reset = () => {
            ticks = 0
            agents = map(range(N),(d,i) => ({id: i,trajectory: [{t: 0,X: 0}]}))


            xr = config.plot.xr;
            X.domain(xr);
            display.select("#xaxis").call(xAxis);


            display.selectAll("." + styles.agent).remove();

            display.selectAll("." + styles.agent).data(agents).enter().append("path")
                .attr("d",d => curve(d.trajectory))
                .attr("class",styles.agent)
                .classed(styles.singular,d => d.id == 0)

        }

        const buttons = map(config.widgets.buttons,
            v => widgets.button()
                .id(v.id)
                .value(v.value)
                .actions(v.actions)
                .position(g.position(v.position.x,v.position.y))
        );

        const sliders = map(config.widgets.sliders,
            v => widgets.slider()
                .id(v.id)
                .label(v.label)
                .range(v.range)
                .value(v.value)
                .fontsize(config.widgets.slider_fontsize)
                .size(config.widgets.slider_size)
                .girth(config.widgets.slider_girth)
                .knob(config.widgets.slider_knob)
                .position(g.position(v.position.x,v.position.y))
        );

        reset();


        function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

        buttons[0].update(go);
        buttons[1].update(reset);

        controls.selectAll(null).data(buttons).enter().append(widgets.widget);
        controls.selectAll(null).data(sliders).enter().append(widgets.widget);

        display.append("g").datum(config.plot.xaxis).attr("class",styles.axis)
            .attr("id","xaxis")
            .attr("transform",function(d) {return "translate(0," + Y(0) + ")"})
            .call(xAxis)
            .style("font-size",config.plot.xaxis.fontsize);

        display.append("g").datum(config.plot.yaxis).attr("class",styles.axis)
            .attr("transform",function(d) {return "translate(" + X(0) + ",0)"})
            .call(yAxis)
            .style("font-size",config.plot.xaxis.fontsize);



        // controls.selectAll("*").data(g.points).enter().append("circle")
        //     .attr("class","grid")
        //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
        //     .attr("r",1)
        //     .style("fill","black")
        //     .style("stroke","none")


        return () => {
            controls.selectAll("*").remove(); // Remove all circles from the second SVG
            display.selectAll("*").remove(); // Remove all circles from the second SVG
        };

    },[id]); // Add `id` as a dependency to ensure it updates if the prop changes

    return (
        <>
            <div
                ref={Container}
                id={id}
                className={config.container.class}
            >
                <svg
                    ref={displayContainer}
                    id={`${id}-display`}
                    className={config.display.class}
                    width={config.display.width}
                    height={config.display.height}
                    viewBox={`0 0 ${config.display.width} ${config.display.height}`}
                />
                <svg
                    ref={controlsContainer}
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