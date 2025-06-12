import * as d3 from 'd3';
import * as widgets from 'd3-widgets';
import {each,map,range} from 'lodash-es';
import {useEffect,useRef} from 'react';
import {findAllRoots} from '../../../../utils/math-utils.js';
import config from './config.js';
import styles from './styles.module.css';


const loadExplorable = (displayContainer,controlsContainer) => {

    const g = widgets.grid(config.controls.width,config.controls.height,config.controls.grid.x,config.controls.grid.y);
    const display = d3.select(displayContainer);
    const controls = d3.select(controlsContainer);
    const xr = config.plot.xr;
    const yr = config.plot.yr;

    const X = d3.scaleLinear().domain(xr).range([config.plot.margin.l,config.display.width - config.plot.margin.r]);
    const Y = d3.scaleLinear().domain(yr).range([config.display.height - config.plot.margin.b,config.plot.margin.t]);
    const xAxis = d3.axisBottom(X);
    const yAxis = d3.axisLeft(Y);
    const curve = d3.line().x(d => X(d.x)).y(d => Y(d.y));

    display.append('defs').append('marker')
        .attr('id','arrowhead')
        .attr('viewBox','-0 -5 10 10')
        .attr('refX',5)
        .attr('refY',0)
        .attr('orient','auto')
        .attr('markerWidth',3)
        .attr('markerHeight',3)
        .attr('xoverflow','visible')
        .append('svg:path')
        .attr('d','M 0,-5 L 10 ,0 L 0,5')
        .attr('fill','black')
        .style('stroke','none');

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
            .show(v.show)
            .position(g.position(v.position.x,v.position.y))
    );

    controls.selectAll(null).data(sliders).enter().append(widgets.widget);

    // controls.selectAll("*").data(g.points).enter().append("circle")
    //     .attr("class","grid")
    //     .attr("transform",function(d) {return "translate(" + d.x + "," + d.y + ")"})
    //     .attr("r",1)
    //     .style("fill","black")
    //     .style("stroke","none")


    const omega = sliders[0];
    const K = sliders[1];

    const f = (x) => {return omega.value() - K.value() * Math.sin(x)};
    const fp = (x) => {return -K.value() * Math.cos(x)};
    const max_arrow_length = (xr[1] - xr[0]) / config.plot.number_of_arrows;
    const arrow_anchors = range(xr[0],xr[1],max_arrow_length);
    console.log(arrow_anchors.length * max_arrow_length);
    console.log(max_arrow_length)
    const arrow_scale = config.plot.arrow_scale || 1;

    var points = map(range(xr[0],xr[1],(xr[1] - xr[0]) / 200),x => ({x: x,y: f(x)}));
    var roots = findAllRoots(f,fp,[0,2 * Math.PI]);

    const update = () => {
        roots = findAllRoots(f,fp,[0,2 * Math.PI]);
        points = map(range(xr[0],xr[1],(xr[1] - xr[0]) / 200),x => ({x: x,y: f(x)}));
        display.selectAll("." + styles.fixpoint).remove();
        display.selectAll("." + styles.fixpoint).data(roots).enter().append("circle")
            .attr("class",styles.fixpoint)
            .attr("r",config.plot.fixpointradius)
            .attr("transform",function(d) {return "translate(" + X(d) + "," + Y(0) + ")"})
            .classed(styles.stable,d => (fp(d) < 0))
        display.select("." + styles.curve).datum(points).attr("d",curve)
        display.selectAll("." + styles.arrow)
            .data(arrow_anchors)
            .attr("d",x0 => {
                let al = arrow_scale * Math.abs(f(x0)) > 1 ? max_arrow_length * Math.sign(f(x0)) : arrow_scale * f(x0) * max_arrow_length;
                let a = [{x: x0,y: 0},{x: x0 + al,y: 0}];
                return curve(a);
            })

    }

    each(sliders,s => s.update(update));

    console.log(roots);

    display.append("g").call(xAxis)
        .attr("class",styles.xaxis)
        .attr("transform","translate(" + 0 + "," + Y(0) + ")");

    display.append("g").call(yAxis)
        .attr("class",styles.yaxis)
        .attr("transform","translate(" + X(0) + "," + 0 + ")");

    display.append("text").text("x").attr("class",styles.axis_label)
        .attr("transform","translate(" + X(6) + "," + (Y(0) + 30) + ")")


    display.append("text").text("f(x)").attr("class",styles.axis_label)
        .attr("transform","translate(" + (X(0) + 20) + "," + (Y(1) + 10) + ")")


    display.append("path").datum(points).attr("d",curve)
        .attr("class",styles.curve);

    display.selectAll("." + styles.arrow)
        .data(arrow_anchors).enter().append("path")
        .attr("d",x0 => {
            let al = arrow_scale * Math.abs(f(x0)) > 1 ? max_arrow_length * Math.sign(f(x0)) : arrow_scale * f(x0) * max_arrow_length;
            let a = [{x: x0,y: 0},{x: x0 + al,y: 0}];
            return curve(a);
        })
        .attr("class",styles.arrow)
        .attr("marker-end","url(#arrowhead)")



    update()




    //.style("fill",function(d) {return d.slope > 0 ? "darkred" : "blue"})
    //.style("opacity",function(d) {return d.x ? 1 : 0})

    // display.append("text").text("x")
    // 	.attr("transform","translate("+X(5)+","+(Y(0)+30)+")")
    // 	.style("text-anchor","middle").style("font-size",16)	

    // plt.append("text").text("f(x)")
    // 	.attr("transform","translate("+(X(0)+20)+","+(Y(3)+10)+")")
    // 	.style("text-anchor","middle").style("font-size",16)

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