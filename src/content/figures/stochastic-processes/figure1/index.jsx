/* Illustation of the Gaussian and Cauchy distributions */

import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import 'katex/dist/katex.min.css';
import {map} from 'lodash-es';
import {useEffect,useRef} from 'react';
import config from './config.js';
import styles from './styles.module.css';
import {cauchy,gauss} from './utils.js';

const loadExplorable = (displayContainer,controlsContainer) => {

    var data1,data2;

    const X = d3.scaleLinear().domain(config.plot.xr)
        .range([config.plot.margin.l,config.display.width - config.plot.margin.r]);
    const Y = d3.scaleLinear().domain(config.plot.yr)
        .range([config.display.height - config.plot.margin.b,config.plot.margin.t]);
    const xAxis = d3.axisBottom(X);
    const yAxis = d3.axisLeft(Y);
    const line = d3.line().x(d => X(d.x)).y(d => Y(d.y));

    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const display = d3.select(displayContainer)
    const controls = d3.select(controlsContainer)

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

    const update = () => {
        data1 = d3.range(config.plot.xr[0],config.plot.xr[1],0.01)
            .map(d => ({x: d,y: gauss(d,sliders[0].value(),sliders[1].value())}));
        data2 = d3.range(config.plot.xr[0],config.plot.xr[1],0.01)
            .map(d => ({x: d,y: cauchy(d,sliders[0].value(),sliders[1].value())}));
    }

    sliders[0].update(function() {
        update()
        display.select("#gauss").datum(data1).attr("d",line)
        display.select("#cauchy").datum(data2).attr("d",line)
    });

    sliders[1].update(function() {
        update()
        display.select("#gauss").datum(data1).attr("d",line)
        display.select("#cauchy").datum(data2).attr("d",line)
    });

    controls.selectAll(null).data(sliders).enter().append(widgets.widget);

    display.append("g").datum(config.plot.xaxis).attr("class",styles.axis)
        .attr("transform",function(d) {return "translate(0," + Y(0) + ")"})
        .call(xAxis);

    display.append("g").datum(config.plot.yaxis).attr("class",styles.axis)
        .attr("transform",function(d) {return "translate(" + X(0) + ",0)"})
        .call(yAxis);

    // display.append("foreignObject")
    //     .attr("x",config.plot.xaxis.position.x + 90) // Adjust position
    //     .attr("y",config.plot.xaxis.position.y - 50) // Adjust position
    //     .attr("width",50) // Set width for the foreignObject
    //     .attr("height",50) // Set height for the foreignObject
    //     .append("xhtml:div") // Append an HTML div inside the foreignObject
    //     .html(katex.renderToString("x",{displayMode: true})); // Render LaTeX using KaTeX


    // display.append("foreignObject")
    //     .attr("x",config.plot.yaxis.position.x - 10) // Adjust position
    //     .attr("y",config.plot.yaxis.position.y - 25) // Adjust position
    //     .attr("width",50) // Set width for the foreignObject
    //     .attr("height",50) // Set height for the foreignObject
    //     .append("xhtml:div") // Append an HTML div inside the foreignObject
    //     .html(katex.renderToString("p(x)",{displayMode: true})); // Render LaTeX using KaTeX

    display.append("g").attr("class","grid")

    update();

    display.append("path").datum(data1).attr("d",line).attr("id","gauss")
        .style("stroke","darkred")
        .style("stroke-width",4)
        .style("fill","none")

    display.append("path").datum(data2).attr("d",line).attr("id","cauchy")
        .style("stroke","darkblue")
        .style("stroke-width",4)
        .style("fill","none")


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
}


export default ({id}) => {
    const ContainerRef = useRef(null); // Ref for the first div
    const displayContainerRef = useRef(null); // Ref for the first div
    const controlsContainerRef = useRef(null); // Ref for the second div

    useEffect(() => {

        const width = ContainerRef.current.clientWidth;
        const height = ContainerRef.current.clientHeight;

        console.log("Container dimensions:",width,height);

        console.log("Container dimensions:",width,height);

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