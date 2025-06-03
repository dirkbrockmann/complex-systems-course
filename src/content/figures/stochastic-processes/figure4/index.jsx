import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {map,range} from 'lodash-es';
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';


const X = d3.scaleLinear().domain(config.plot.xr)
    .range([config.plot.margin.l,config.display.width - config.plot.margin.r]);
const Y = d3.scaleLinear().domain(config.plot.yr)
    .range([config.display.height - config.plot.margin.b,config.plot.margin.t]);
const xAxis = d3.axisBottom(X);
const yAxis = d3.axisLeft(Y);
const line = d3.line().x(d => X(d.x)).y(d => Y(d.y));

const gauss = (x,t) => {return 1.0 / Math.sqrt(2 * Math.PI * t) * Math.exp(-(x) * (x) / (2 * t))}
const xr = config.plot.xr;
const t0 = 0.01; // Standard deviation
var T = t0; // Current time
const dt = 0.01; // Time step
var timer = {};

var data = range(xr[0],xr[1],0.01).map(d => ({x: d,y: gauss(d,t0)}));


export default function Fig4({id}) {
    const Container = useRef(null); // Ref for the first div
    const displayContainer = useRef(null); // Ref for the first div
    const controlsContainer = useRef(null); // Ref for the second div

    useEffect(() => {
        console.log(data)
        const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
        const display = d3.select(displayContainer.current)
        const controls = d3.select(controlsContainer.current)

        const buttons = map(config.widgets.buttons,
            v => widgets.button()
                .id(v.id)
                .value(v.value)
                .actions(v.actions)
                .position(g.position(v.position.x,v.position.y))
        );

        const iterate = () => {
            T += dt;
            data = d3.range(xr[0],xr[1],0.01).map(function(d) {return {x: d,y: gauss(d,T)}});

            display.select("#gauss").datum(data).attr("d",line);
        }
        const reset = () => {
            T = t0;
            data = range(xr[0],xr[1],0.01).map(d => ({x: d,y: gauss(d,t0)}));
            display.select("#gauss").datum(data).attr("d",line);
        }

        function go(d) {buttons[0].value() == 1 ? timer = d3.timer(iterate,0) : timer.stop();}

        buttons[0].update(go);
        buttons[1].update(reset);

        controls.selectAll(null).data(buttons).enter().append(widgets.widget);

        display.append("g").datum(config.plot.xaxis).attr("class",styles.axis)
            .attr("transform",function(d) {return "translate(0," + Y(0) + ")"})
            .call(xAxis);

        display.append("g").datum(config.plot.yaxis).attr("class",styles.axis)
            .attr("transform",function(d) {return "translate(" + X(0) + ",0)"})
            .call(yAxis);

        display.append("text").text(config.plot.xaxis.label)
            .attr("x",config.plot.xaxis.label_position.x)
            .attr("y",config.plot.xaxis.label_position.y)
            .style("font-size",config.plot.xaxis.fontsize)

        display.append("text").text(config.plot.yaxis.label)
            .attr("x",config.plot.yaxis.label_position.x)
            .attr("y",config.plot.yaxis.label_position.y)
            .style("font-size",config.plot.yaxis.fontsize)


        display.append("g").attr("class","grid")


        display.append("path").datum(data).attr("d",line).attr("id","gauss")
            .style("stroke","darkred")
            .style("stroke-width",4)
            .style("fill","none")

        controls.selectAll("*").data(g.points).enter().append("circle")
            .attr("class","grid")
            .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
            .attr("r",1)
            .style("fill","black")
            .style("stroke","none")


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